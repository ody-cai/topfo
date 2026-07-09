package com.topfo.app.data.repository

import android.content.Context
import com.topfo.app.data.local.AppDatabase
import com.topfo.app.data.local.dao.RankingDao
import com.topfo.app.data.model.RankingEntity
import com.topfo.app.data.remote.TopfoApi
import kotlinx.coroutines.flow.*
import kotlinx.serialization.json.*

/**
 * NetworkFirst 策略：
 * 1. 尝试从 /api/rankings 获取最新数据 → 写入 Room
 * 2. API 失败 → 降级使用 Room 缓存
 * 3. Room 无数据 → 降级使用打包的 rankings.json 兜底
 *
 * 数据转换：网站格式（按学科, qs/the/usn 列）→ App 格式（按排名机构, 单一 rank+score）
 */
class RankingRepository(
    private val context: Context,
    private val api: TopfoApi?
) {
    private val rankingDao: RankingDao = AppDatabase.getInstance(context).rankingDao()

    fun getRankings(source: String): Flow<List<RankingEntity>> = rankingDao.getBySource(source)

    /**
     * 尝试从 API 同步最新排名数据。
     * 成功 → 写入 Room；失败 → 使用已有数据；Room 空 → 兜底 JSON。
     */
    suspend fun ensureDataLoaded() {
        // 1. 尝试 API
        if (api != null) {
            try {
                val response = api.getRankings()
                if (response.data.isNotEmpty()) {
                    val entities = transformRankings(response.data)
                    rankingDao.deleteAll()
                    rankingDao.insertAll(entities)
                    return
                }
            } catch (e: Exception) {
                // API 失败，降级
            }
        }

        // 2. Room 已有数据？
        if (rankingDao.getBySource("qs2027_overall").first().isNotEmpty()) return

        // 3. 兜底：打包的 JSON
        loadBundledJson()
    }

    /**
     * 将网站格式（按学科，含 qs/the/usn）转为 App 格式（按排名机构）
     *
     * 映射：
     *   data.overall[].qs  → source="qs2027_overall"
     *   data.cs[].qs       → source="qs2025_cs"
     *   data.eng[].qs      → source="qs2025_eng"
     *   data.overall[].the → source="the2026_overall"
     *   data.overall[].usn → source="usnews2025_overall"
     */
    private fun transformRankings(
        data: Map<String, List<com.topfo.app.data.remote.dto.RankingEntryDto>>
    ): List<RankingEntity> {
        val all = mutableListOf<RankingEntity>()
        var id = 1L

        // 定义数据源映射: (学科key, 列名, source名)
        val mappings = listOf(
            Triple("overall", "qs", "qs2027_overall"),
            Triple("cs", "qs", "qs2025_cs"),
            Triple("eng", "qs", "qs2025_eng"),
            Triple("overall", "the", "the2026_overall"),
            Triple("overall", "usn", "usnews2025_overall")
        )

        for ((progKey, col, source) in mappings) {
            val entries = data[progKey] ?: continue
            for (entry in entries) {
                // 提取对应列的值
                val rawValue = when (col) {
                    "qs" -> entry.qs
                    "the" -> entry.the
                    "usn" -> entry.usn
                    else -> null
                } ?: continue

                // 解析排名（可能是数字、范围如"151-200"、或"—"）
                val rank = parseRank(rawValue) ?: continue

                // 估算分数（排名越高分数越高，简单反向映射）
                val score = estimateScore(rank)

                all.add(RankingEntity(
                    id = id++,
                    source = source,
                    rank = rank,
                    universityName = entry.school,
                    score = score,
                    country = "加拿大"
                ))
            }

            // 按排名升序排列
            val sorted = all.filter { it.source == source }.sortedBy { it.rank }
            all.removeAll { it.source == source }
            all.addAll(sorted)
        }

        return all
    }

    /** 解析排名值：数字直接返回，"151-200"取下限，"—"返回 null */
    private fun parseRank(raw: String): Int? {
        if (raw == "—" || raw.isBlank()) return null
        // 尝试直接解析数字
        raw.toIntOrNull()?.let { return it }
        // 尝试解析范围 "151-200"
        val rangeMatch = Regex("""(\d+)\s*[-–]\s*\d+""").find(raw)
        return rangeMatch?.groupValues?.get(1)?.toIntOrNull()
    }

    /** 基于排名粗略估算分数（满分100，排名越靠前分数越高） */
    private fun estimateScore(rank: Int): Double {
        return when {
            rank <= 10 -> 95.0 - rank * 1.5
            rank <= 50 -> 85.0 - (rank - 10) * 0.5
            rank <= 100 -> 65.0 - (rank - 50) * 0.3
            rank <= 300 -> 50.0 - (rank - 100) * 0.15
            rank <= 500 -> 20.0 - (rank - 300) * 0.05
            else -> 10.0
        }.coerceIn(5.0, 99.0)
    }

    /** 兜底：从打包的 res/raw/rankings.json 加载 */
    private suspend fun loadBundledJson() {
        val json = context.resources.openRawResource(
            context.resources.getIdentifier("rankings", "raw", context.packageName)
        ).bufferedReader().use { it.readText() }

        val root = Json.parseToJsonElement(json).jsonObject
        val allRankings = mutableListOf<RankingEntity>()
        var id = 1L

        for ((source, arr) in root) {
            for (item in arr.jsonArray) {
                val obj = item.jsonObject
                allRankings.add(RankingEntity(
                    id = id++,
                    source = source,
                    rank = obj["rank"]!!.jsonPrimitive.int,
                    universityName = obj["univ"]!!.jsonPrimitive.content,
                    score = obj["score"]!!.jsonPrimitive.double,
                    country = obj["country"]!!.jsonPrimitive.content
                ))
            }
        }

        rankingDao.deleteAll()
        rankingDao.insertAll(allRankings)
    }

    companion object {
        @Volatile private var INSTANCE: RankingRepository? = null
        fun getInstance(context: Context, api: TopfoApi? = null): RankingRepository =
            INSTANCE ?: synchronized(this) {
                RankingRepository(context.applicationContext, api).also { INSTANCE = it }
            }
    }
}
