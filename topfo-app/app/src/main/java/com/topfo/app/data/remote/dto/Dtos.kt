package com.topfo.app.data.remote.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// ===== Login =====

@Serializable
data class LoginRequest(
    val username: String,
    val password: String
)

@Serializable
data class LoginResponse(
    val token: String? = null,
    val error: String? = null
)

// ===== Me Data =====

@Serializable
data class MeDataResponse(
    val username: String? = null,
    val gpa: Double? = null,
    @SerialName("ielts_total") val ieltsTotal: Double? = null,
    @SerialName("ielts_listening") val ieltsListening: Double? = null,
    @SerialName("ielts_reading") val ieltsReading: Double? = null,
    @SerialName("ielts_writing") val ieltsWriting: Double? = null,
    @SerialName("ielts_speaking") val ieltsSpeaking: Double? = null,
    val error: String? = null
)

// ===== Chat =====

@Serializable
data class ChatRequest(
    val message: String,
    val clear: Boolean? = null
)

@Serializable
data class ChatResponse(
    val reply: String? = null,
    val messages: List<ChatMessageDto>? = null,
    val error: String? = null
)

@Serializable
data class ChatMessageDto(
    val id: Long? = null,
    val role: String,
    val content: String,
    @SerialName("created_at") val createdAt: String? = null,
    val archived: Boolean? = null
)

// ===== Chat History =====

@Serializable
data class ChatHistoryResponse(
    val messages: List<ChatMessageDto> = emptyList(),
    val error: String? = null
)

// ===== Rankings (from /api/rankings) =====

@Serializable
data class RankingsResponse(
    val programs: List<RankingProgramDto> = emptyList(),
    val data: Map<String, List<RankingEntryDto>> = emptyMap(),
    val updated: String? = null
)

@Serializable
data class RankingProgramDto(
    val key: String,
    val label: String
)

@Serializable
data class RankingEntryDto(
    val school: String,
    val city: String? = null,
    val qs: String? = null,    // can be number or range like "151-200" or "—"
    val the: String? = null,
    val usn: String? = null
)

// ===== Schools (from /api/schools) =====

@Serializable
data class SchoolsResponse(
    val tiers: List<TierDto> = emptyList(),
    val programs: Map<String, String> = emptyMap(),
    val schools: Map<String, List<SchoolDto>> = emptyMap(),
    val updated: String? = null
)

@Serializable
data class TierDto(
    val key: String,
    val label: String,
    val badge: String,
    val title: String
)

@Serializable
data class SchoolDto(
    val name: String,
    val city: String? = null,
    val prov: String? = null,
    val deadline: String? = null,
    val tuition: String? = null,
    val tuitionRMB: String? = null,
    val programs: Map<String, ProgramDto>? = null
)

@Serializable
data class ProgramDto(
    val gpa: String? = null,
    val label: String? = null,
    val ielts: String? = null,
    val dual: String? = null,
    @SerialName("dual_type") val dualType: String? = null,
    @SerialName("dual_thr") val dualThr: String? = null,
    val coop: String? = null,
    @SerialName("coop_note") val coopNote: String? = null,
    val note: String? = null,
    @SerialName("note_detail") val noteDetail: String? = null
)

// ===== App Version Check =====

@Serializable
data class VersionCheckResponse(
    val versionName: String = "",
    val versionCode: Int = 0,
    val apkUrl: String = "",
    val changelog: String = ""
)
