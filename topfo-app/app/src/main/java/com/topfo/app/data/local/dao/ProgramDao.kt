package com.topfo.app.data.local.dao

import androidx.room.*
import com.topfo.app.data.model.ProgramEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ProgramDao {
    @Query("SELECT * FROM programs WHERE schoolId = :schoolId")
    fun getBySchool(schoolId: Long): Flow<List<ProgramEntity>>

    @Query("SELECT * FROM programs WHERE programKey = :key")
    fun getByProgramKey(key: String): Flow<List<ProgramEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(programs: List<ProgramEntity>)

    @Query("DELETE FROM programs")
    suspend fun deleteAll()
}
