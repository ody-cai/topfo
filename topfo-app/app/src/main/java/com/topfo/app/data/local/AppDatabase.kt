package com.topfo.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.topfo.app.data.local.dao.ProgramDao
import com.topfo.app.data.local.dao.RankingDao
import com.topfo.app.data.local.dao.SchoolDao
import com.topfo.app.data.model.ProgramEntity
import com.topfo.app.data.model.RankingEntity
import com.topfo.app.data.model.SchoolEntity

@Database(
    entities = [SchoolEntity::class, ProgramEntity::class, RankingEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun schoolDao(): SchoolDao
    abstract fun programDao(): ProgramDao
    abstract fun rankingDao(): RankingDao

    companion object {
        @Volatile private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "topfo.db"
                ).fallbackToDestructiveMigration().build().also { INSTANCE = it }
            }
        }
    }
}
