package com.topfo.app.ui.admission

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.topfo.app.data.model.ProgramEntity
import com.topfo.app.data.model.SchoolEntity
import com.topfo.app.data.repository.SchoolRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class AdmissionUiState(
    val schools: List<SchoolEntity> = emptyList(),
    val programs: Map<Long, List<ProgramEntity>> = emptyMap(),
    val selectedTier: String = "t2",
    val selectedProgram: String? = null,
    val searchQuery: String = "",
    val isLoading: Boolean = true,
    val isLoggedIn: Boolean = false,
    val userGpa: Double = 89.6,
    val userIelts: Double = 5.0
)

class AdmissionViewModel(application: Application) : AndroidViewModel(application) {
    private val repo = SchoolRepository.getInstance(application)
    private val _state = MutableStateFlow(AdmissionUiState())

    val state: StateFlow<AdmissionUiState> = _state.asStateFlow()

    val tiers = listOf("t1" to "第一梯队·极难申", "t2" to "第二梯队·现实目标", "t3" to "第三梯队·保底校", "au" to "澳洲保底")
    val programOptions = listOf(
        null to "全部专业", "eng" to "工程", "cs" to "计算机", "math" to "数学",
        "psych" to "心理学", "biz" to "商科", "health" to "健康科学", "sci" to "理科综合", "social" to "社会科学"
    )

    init {
        viewModelScope.launch {
            repo.ensureDataLoaded()
            loadData()
        }
    }

    fun selectTier(tier: String) {
        _state.update { it.copy(selectedTier = tier) }
        viewModelScope.launch { loadData() }
    }

    fun selectProgram(program: String?) {
        _state.update { it.copy(selectedProgram = program) }
    }

    fun setSearch(query: String) {
        _state.update { it.copy(searchQuery = query) }
    }

    fun setLoggedIn(gpa: Double, ielts: Double) {
        _state.update { it.copy(isLoggedIn = true, userGpa = gpa, userIelts = ielts) }
    }

    fun matchLabel(program: ProgramEntity): Int { // 0=ok, 1=close, 2=hard
        return when (program.label) {
            "ok" -> 0
            "close" -> 1
            "hard" -> 2
            else -> 1
        }
    }

    private suspend fun loadData() {
        val tier = _state.value.selectedTier
        repo.getSchoolsByTier(tier).collect { schools ->
            val programMap = mutableMapOf<Long, List<ProgramEntity>>()
            for (school in schools) {
                repo.getPrograms(school.id).collect { progs ->
                    programMap[school.id] = progs
                    _state.update {
                        it.copy(schools = schools, programs = programMap.toMap(), isLoading = false)
                    }
                }
            }
        }
    }
}
