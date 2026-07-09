package com.topfo.app.data.repository

import com.topfo.app.data.remote.TopfoApi
import com.topfo.app.data.remote.dto.ChatRequest
import com.topfo.app.data.remote.dto.ChatMessageDto
import com.topfo.app.data.remote.dto.ChatResponse

class ChatRepository(private val api: TopfoApi) {
    suspend fun sendMessage(token: String, message: String): Result<ChatResponse> {
        return try {
            val response = api.sendChatMessage("Bearer $token", ChatRequest(message = message))
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun loadHistory(token: String): Result<List<ChatMessageDto>> {
        return try {
            val response = api.getChatHistory("Bearer $token")
            Result.success(response.messages)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun clearChat(token: String): Result<Unit> {
        return try {
            api.sendChatMessage("Bearer $token", ChatRequest(message = "", clear = true))
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
