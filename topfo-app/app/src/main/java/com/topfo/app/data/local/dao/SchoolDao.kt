package com.topfo.app.data.local.dao

import androidx.room.*
import com.topfo.app.data.model.SchoolEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface SchoolDao {
    @Query("SELECT * FROM schools ORDER BY id")
    fun getAll(): Flow<List<SchoolEntity>>

    @Query("SELECT * FROM schools WHERE tier = :tier")
    fun getByTier(tier: String): Flow<List<SchoolEntity>>

    @Query("SELECT * FROM schools WHERE name LIKE '%' || :query || '%'")
    fun search(query: String): Flow<List<SchoolEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(schools: List<SchoolEntity>)

    @Query("DELETE FROM schools")
    suspend fun deleteAll()
}
