package com.topfo.app.data.remote

import com.topfo.app.data.remote.dto.*
import retrofit2.http.*

/**
 * API interface — exact match with Cloudflare Pages Functions endpoints.
 * All are relative paths; base URL is configured in Retrofit.Builder.
 */
interface TopfoApi {

    // === Auth ===

    @POST("api/login")
    suspend fun login(@Body body: LoginRequest): LoginResponse

    // === User Profile ===

    @GET("api/me/data")
    suspend fun getMeData(@Header("Authorization") token: String): MeDataResponse

    // === AI Chat (shared D1 with web) ===

    @POST("api/chat")
    suspend fun sendChatMessage(
        @Header("Authorization") token: String,
        @Body body: ChatRequest
    ): ChatResponse

    @GET("api/chat")
    suspend fun getChatHistory(
        @Header("Authorization") token: String,
        @Query("archive") archive: Boolean? = null
    ): ChatHistoryResponse

    // === Public Data (no auth required) ===

    @GET("api/rankings")
    suspend fun getRankings(): RankingsResponse

    @GET("api/schools")
    suspend fun getSchools(): SchoolsResponse

    // === App Version Check ===

    @GET("download/version.json")
    suspend fun checkVersion(): VersionCheckResponse
}
