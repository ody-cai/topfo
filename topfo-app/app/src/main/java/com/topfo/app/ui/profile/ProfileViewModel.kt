package com.topfo.app.ui.profile

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.topfo.app.BuildConfig
import com.topfo.app.data.remote.dto.MeDataResponse
import com.topfo.app.data.remote.dto.VersionCheckResponse
import com.topfo.app.data.repository.AuthRepository
import com.topfo.app.data.repository.VersionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ProfileUiState(
    val isLoggedIn: Boolean = false,
    val username: String = "",
    val showLogin: Boolean = false,
    val showEdit: Boolean = false,
    val gpa: Double = 89.6,
    val ieltsTotal: Double = 5.0,
    val ieltsListening: Double = 4.5,
    val ieltsReading: Double = 4.5,
    val ieltsWriting: Double = 5.5,
    val ieltsSpeaking: Double = 5.0,
    val loginError: String? = null,
    val isLoading: Boolean = false,
    // Version check states
    val currentVersion: String = BuildConfig.VERSION_NAME,
    val isCheckingVersion: Boolean = false,
    val versionInfo: VersionCheckResponse? = null,
    val showUpdateDialog: Boolean = false,
    val isDownloading: Boolean = false,
    val downloadError: String? = null,
    val versionMessage: String? = null
)

class ProfileViewModel(
    private val authRepo: AuthRepository,
    private val versionRepo: VersionRepository? = null
) : ViewModel() {
    private val _state = MutableStateFlow(ProfileUiState())
    val state: StateFlow<ProfileUiState> = _state.asStateFlow()

    init {
        // Restore login state from AuthRepository (which was restored from prefs in Application)
        if (authRepo.isLoggedIn.value) {
            _state.update { it.copy(isLoggedIn = true, username = authRepo.username.value) }
            loadProfile()
        }
    }

    fun showLogin() { _state.update { it.copy(showLogin = true, loginError = null) } }
    fun hideLogin() { _state.update { it.copy(showLogin = false) } }
    fun showEdit() { _state.update { it.copy(showEdit = true) } }
    fun hideEdit() { _state.update { it.copy(showEdit = false) } }

    fun login(username: String, password: String) {
        _state.update { it.copy(isLoading = true, loginError = null) }
        viewModelScope.launch {
            authRepo.login(username, password).fold(
                onSuccess = {
                    _state.update { it.copy(isLoggedIn = true, username = username, showLogin = false, isLoading = false) }
                    loadProfile()
                },
                onFailure = { e ->
                    _state.update { it.copy(loginError = "登录失败：" + (e.message ?: "未知错误"), isLoading = false) }
                }
            )
        }
    }

    fun logout() {
        authRepo.logout()
        _state.update { it.copy(isLoggedIn = false, username = "", gpa = 89.6, ieltsTotal = 5.0) }
    }

    private fun loadProfile() {
        viewModelScope.launch {
            authRepo.fetchProfile().fold(
                onSuccess = { p ->
                    _state.update {
                        it.copy(gpa = p.gpa ?: it.gpa, ieltsTotal = p.ieltsTotal ?: it.ieltsTotal,
                            ieltsListening = p.ieltsListening ?: it.ieltsListening,
                            ieltsReading = p.ieltsReading ?: it.ieltsReading,
                            ieltsWriting = p.ieltsWriting ?: it.ieltsWriting,
                            ieltsSpeaking = p.ieltsSpeaking ?: it.ieltsSpeaking)
                    }
                },
                onFailure = {}
            )
        }
    }

    fun updateGpa(gpa: Double) { _state.update { it.copy(gpa = gpa) } }
    fun updateIelts(l: Double, r: Double, w: Double, s: Double) {
        _state.value = _state.value.copy(ieltsListening = l, ieltsReading = r, ieltsWriting = w, ieltsSpeaking = s)
    }

    // ===== Version Check =====

    fun checkVersion() {
        if (versionRepo == null) return
        _state.update { it.copy(isCheckingVersion = true, versionMessage = null, downloadError = null) }
        viewModelScope.launch {
            versionRepo.checkUpdate().fold(
                onSuccess = { info ->
                    _state.update {
                        it.copy(
                            isCheckingVersion = false,
                            versionInfo = info,
                            showUpdateDialog = true
                        )
                    }
                },
                onFailure = { e ->
                    _state.update {
                        it.copy(
                            isCheckingVersion = false,
                            versionMessage = e.message ?: "检查失败"
                        )
                    }
                }
            )
        }
    }

    fun dismissUpdateDialog() {
        _state.update { it.copy(showUpdateDialog = false, versionInfo = null) }
    }

    fun dismissVersionMessage() {
        _state.update { it.copy(versionMessage = null) }
    }

    fun confirmUpdate() {
        val info = _state.value.versionInfo ?: return
        if (versionRepo == null) return
        _state.update { it.copy(showUpdateDialog = false, isDownloading = true, downloadError = null) }
        viewModelScope.launch {
            versionRepo.downloadApk(info).fold(
                onSuccess = { uri ->
                    _state.update { it.copy(isDownloading = false) }
                    versionRepo.installApk(uri)
                },
                onFailure = { e ->
                    _state.update {
                        it.copy(isDownloading = false, downloadError = "下载失败：" + (e.message ?: "未知错误"))
                    }
                }
            )
        }
    }
}
