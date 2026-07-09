package com.topfo.app.ui.home

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.topfo.app.data.local.PreferencesManager
import com.topfo.app.data.repository.AuthRepository
import com.topfo.app.data.repository.SchoolRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class HomeUiState(
    val isLoggedIn: Boolean = false,
    val username: String = "",
    val gpa: Double = 89.6,
    val ieltsTotal: Double = 5.0,
    val isLoading: Boolean = true
)

class HomeViewModel(application: Application) : AndroidViewModel(application) {
    private val prefs = PreferencesManager(application)
    private val schoolRepo = SchoolRepository.getInstance(application)
    private val _state = MutableStateFlow(HomeUiState())

    val state: StateFlow<HomeUiState> = _state.asStateFlow()

    init {
        viewModelScope.launch {
            // Restore login
            val token = prefs.getToken()
            val username = prefs.getUsername()
            if (token.isNotEmpty() && username.isNotEmpty()) {
                _state.update {
                    it.copy(isLoggedIn = true, username = username)
                }
            }

            // Load static data
            schoolRepo.ensureDataLoaded()
            _state.update { it.copy(isLoading = false) }
        }
    }

    fun onLoginSuccess(token: String, username: String) {
        prefs.saveToken(token)
        prefs.saveUsername(username)
        _state.update { it.copy(isLoggedIn = true, username = username) }
    }

    fun onLogout() {
        prefs.clear()
        _state.update { it.copy(isLoggedIn = false, username = "", gpa = 89.6, ieltsTotal = 5.0) }
    }
}
