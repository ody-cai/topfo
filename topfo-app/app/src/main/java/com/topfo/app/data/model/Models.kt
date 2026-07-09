package com.topfo.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

// ===== School & Program =====

@Entity(tableName = "schools")
data class SchoolEntity(
    @PrimaryKey val id: Long = 0,
    val name: String,
    val city: String,
    val province: String,
    val deadline: String,
    val tuition: String,
    val tuitionRMB: String,
    val tier: String,
    val isFoundation: Boolean = false
)

@Entity(tableName = "programs")
data class ProgramEntity(
    @PrimaryKey val id: Long = 0,
    val schoolId: Long,
    val programKey: String,   // eng/cs/math/psych/biz/health/sci/social
    val programName: String,
    val gpa: String,
    val label: String,         // ok/close/hard/na
    val ielts: String,
    val dual: String,          // yes/no/limit
    val dualType: String,
    val dualThreshold: String,
    val coop: String,
    val coopNote: String,
    val note: String,
    val noteDetail: String
)

@Entity(tableName = "rankings")
data class RankingEntity(
    @PrimaryKey val id: Long = 0,
    val source: String,     // qs2027_overall / qs2025_cs / qs2025_eng / the2026_overall / usnews2025_overall
    val rank: Int,
    val universityName: String,
    val score: Double,
    val country: String
)

// ===== DTOs for API =====

@Serializable
data class LoginRequest(val username: String, val password: String)

@Serializable
data class LoginResponse(val token: String)

@Serializable
data class ProfileResponse(
    val gpa: Double,
    val ieltsTotal: Double,
    val ieltsListening: Double,
    val ieltsReading: Double,
    val ieltsWriting: Double,
    val ieltsSpeaking: Double
)

@Serializable
data class ProfileUpdateRequest(
    val gpa: Double,
    val ieltsTotal: Double,
    val ieltsListening: Double,
    val ieltsReading: Double,
    val ieltsWriting: Double,
    val ieltsSpeaking: Double
)

@Serializable
data class ChatRequest(val message: String, val clear: Boolean = false)

@Serializable
data class ChatMessage(val id: Long = 0, val username: String = "", val role: String, val content: String, val createdAt: String = "")

@Serializable
data class ChatHistoryResponse(val messages: List<ChatMessage>)
