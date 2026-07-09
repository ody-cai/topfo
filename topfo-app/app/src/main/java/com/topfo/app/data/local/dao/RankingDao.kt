package com.topfo.app.data.local.dao

import androidx.room.*
import com.topfo.app.data.model.RankingEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface RankingDao {
    @Query("SELECT * FROM rankings WHERE source = :source ORDER BY `rank`")
    fun getBySource(source: String): Flow<List<RankingEntity>>

    @Query("SELECT * FROM rankings WHERE universityName LIKE '%' || :name || '%'")
    fun search(name: String): Flow<List<RankingEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(rankings: List<RankingEntity>)

    @Query("DELETE FROM rankings")
    suspend fun deleteAll()
}
