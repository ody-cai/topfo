package com.topfo.app.data.repository

import android.content.Context
import com.topfo.app.data.local.AppDatabase
import com.topfo.app.data.local.dao.ProgramDao
import com.topfo.app.data.local.dao.SchoolDao
import com.topfo.app.data.model.ProgramEntity
import com.topfo.app.data.model.SchoolEntity
import com.topfo.app.data.remote.TopfoApi
import com.topfo.app.data.remote.dto.SchoolDto
import com.topfo.app.data.remote.dto.SchoolsResponse
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.serialization.json.*
import java.io.BufferedReader

/**
 * NetworkFirst 策略：
 * 1. 尝试从 /api/schools 获取最新数据 → 写入 Room
 * 2. API 失败 → 降级使用 Room 缓存
 * 3. Room 无数据 → 降级使用打包的 schools.json 兜底
 */
class SchoolRepository(
    private val context: Context,
    private val api: TopfoApi?
) {
    private val db = AppDatabase.getInstance(context)
    private val schoolDao: SchoolDao = db.schoolDao()
    private val programDao: ProgramDao = db.programDao()

    private val programNames = mapOf(
        "eng" to "工程", "cs" to "计算机", "math" to "数学", "psych" to "心理学",
        "biz" to "商科", "health" to "健康科学", "sci" to "理科综合", "social" to "社会科学"
    )

    fun getSchoolsByTier(tier: String): Flow<List<SchoolEntity>> = schoolDao.getByTier(tier)
    fun searchSchools(query: String): Flow<List<SchoolEntity>> = schoolDao.search(query)
    fun getPrograms(schoolId: Long): Flow<List<ProgramEntity>> = programDao.getBySchool(schoolId)
    fun programName(key: String): String = programNames[key] ?: key

    suspend fun ensureDataLoaded() {
        // 1. 尝试 API
        if (api != null) {
            try {
                val response = api.getSchools()
                if (response.schools.isNotEmpty()) {
                    saveFromApi(response)
                    return
                }
            } catch (e: Exception) {
                // API 失败，降级
            }
        }

        // 2. Room 已有数据？
        if (schoolDao.getAll().first().isNotEmpty()) return

        // 3. 兜底：打包的 JSON
        loadBundledJson()
    }

    private suspend fun saveFromApi(response: SchoolsResponse) {
        val allSchools = mutableListOf<SchoolEntity>()
        val allPrograms = mutableListOf<ProgramEntity>()
        var schoolId = 1L

        for ((tier, schoolList) in response.schools) {
            for (s in schoolList) {
                val school = SchoolEntity(
                    id = schoolId,
                    name = s.name,
                    city = s.city ?: "",
                    province = s.prov ?: "",
                    deadline = s.deadline ?: "",
                    tuition = s.tuition ?: "",
                    tuitionRMB = s.tuitionRMB ?: "",
                    tier = tier,
                    isFoundation = false
                )
                allSchools.add(school)

                s.programs?.forEach { (progKey, prog) ->
                    allPrograms.add(ProgramEntity(
                        id = allPrograms.size.toLong() + 1,
                        schoolId = schoolId,
                        programKey = progKey,
                        programName = programName(progKey),
                        gpa = prog.gpa ?: "",
                        label = prog.label ?: "close",
                        ielts = prog.ielts ?: "",
                        dual = prog.dual ?: "no",
                        dualType = prog.dualType ?: "",
                        dualThreshold = prog.dualThr ?: "",
                        coop = prog.coop ?: "no",
                        coopNote = prog.coopNote ?: "",
                        note = prog.note ?: "",
                        noteDetail = prog.noteDetail ?: ""
                    ))
                }
                schoolId++
            }
        }

        schoolDao.deleteAll()
        programDao.deleteAll()
        schoolDao.insertAll(allSchools)
        programDao.insertAll(allPrograms)
    }

    private suspend fun loadBundledJson() {
        val json = context.resources.openRawResource(
            context.resources.getIdentifier("schools", "raw", context.packageName)
        ).bufferedReader().use(BufferedReader::readText)

        val root = Json.parseToJsonElement(json).jsonObject
        val schoolsObj = root["schools"]!!.jsonObject

        val allSchools = mutableListOf<SchoolEntity>()
        val allPrograms = mutableListOf<ProgramEntity>()
        var schoolId = 1L

        for ((tier, schoolsArr) in schoolsObj) {
            for (schoolEl in schoolsArr.jsonArray) {
                val s = schoolEl.jsonObject
                val isFoundation = s["isFoundation"]?.jsonPrimitive?.booleanOrNull ?: false
                val school = SchoolEntity(
                    id = schoolId,
                    name = s["name"]!!.jsonPrimitive.content,
                    city = s["city"]!!.jsonPrimitive.content,
                    province = s["prov"]!!.jsonPrimitive.content,
                    deadline = s["deadline"]!!.jsonPrimitive.content,
                    tuition = s["tuition"]!!.jsonPrimitive.content,
                    tuitionRMB = s["tuitionRMB"]!!.jsonPrimitive.content,
                    tier = tier,
                    isFoundation = isFoundation
                )
                allSchools.add(school)

                val programsObj = s["programs"]?.jsonObject ?: JsonObject(emptyMap())
                for ((progKey, progEl) in programsObj) {
                    val p = progEl.jsonObject
                    allPrograms.add(ProgramEntity(
                        id = allPrograms.size.toLong() + 1,
                        schoolId = schoolId,
                        programKey = progKey,
                        programName = programName(progKey),
                        gpa = p["gpa"]?.jsonPrimitive?.content ?: "",
                        label = p["label"]?.jsonPrimitive?.content ?: "close",
                        ielts = p["ielts"]?.jsonPrimitive?.content ?: "",
                        dual = p["dual"]?.jsonPrimitive?.content ?: "no",
                        dualType = p["dual_type"]?.jsonPrimitive?.content ?: "",
                        dualThreshold = p["dual_thr"]?.jsonPrimitive?.content ?: "",
                        coop = p["coop"]?.jsonPrimitive?.content ?: "no",
                        coopNote = p["coop_note"]?.jsonPrimitive?.content ?: "",
                        note = p["note"]?.jsonPrimitive?.content ?: "",
                        noteDetail = p["note_detail"]?.jsonPrimitive?.content ?: ""
                    ))
                }
                schoolId++
            }
        }

        schoolDao.deleteAll()
        programDao.deleteAll()
        schoolDao.insertAll(allSchools)
        programDao.insertAll(allPrograms)
    }

    companion object {
        @Volatile private var INSTANCE: SchoolRepository? = null
        fun getInstance(context: Context, api: TopfoApi? = null): SchoolRepository =
            INSTANCE ?: synchronized(this) {
                SchoolRepository(context.applicationContext, api).also { INSTANCE = it }
            }
    }
}
