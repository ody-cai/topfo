package com.topfo.app.data.repository

import com.topfo.app.data.remote.TopfoApi
import com.topfo.app.data.remote.dto.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class AuthRepository(private val api: TopfoApi) {
    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    private val _username = MutableStateFlow("")
    val username: StateFlow<String> = _username.asStateFlow()

    private var _token: String = ""

    fun getToken(): String = _token

    suspend fun login(username: String, password: String): Result<String> {
        return try {
            val response = api.login(LoginRequest(username, password))
            val token = response.token ?: throw Exception("Login failed: no token")
            _token = token
            _isLoggedIn.value = true
            _username.value = username
            Result.success(token)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun fetchProfile(): Result<MeDataResponse> {
        return try {
            val response = api.getMeData("Bearer $_token")
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun restoreSession(token: String, username: String) {
        _token = token
        _username.value = username
        _isLoggedIn.value = true
    }

    fun logout() {
        _token = ""
        _isLoggedIn.value = false
        _username.value = ""
    }
}
