package com.topfo.app.ui.rankings

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.topfo.app.data.model.RankingEntity
import com.topfo.app.data.repository.RankingRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class RankingsTab(val key: String, val label: String, val source: String)

data class RankingsUiState(
    val selectedTab: Int = 0,
    val rankings: List<RankingEntity> = emptyList(),
    val isLoading: Boolean = true
)

class RankingsViewModel(application: Application) : AndroidViewModel(application) {
    private val repo = RankingRepository.getInstance(application)
    private val _state = MutableStateFlow(RankingsUiState())

    val state: StateFlow<RankingsUiState> = _state.asStateFlow()

    val tabs = listOf(
        RankingsTab("qs2027", "QS 2027\n综合", "qs2027_overall"),
        RankingsTab("qs2025_cs", "QS 2025\nCS", "qs2025_cs"),
        RankingsTab("qs2025_eng", "QS 2025\n工程", "qs2025_eng"),
        RankingsTab("the2026", "THE 2026\n综合", "the2026_overall"),
        RankingsTab("usnews", "US News\n综合", "usnews2025_overall")
    )

    init {
        viewModelScope.launch {
            repo.ensureDataLoaded()
            loadRankings(tabs[0].source)
        }
    }

    fun selectTab(index: Int) {
        _state.update { it.copy(selectedTab = index, isLoading = true) }
        viewModelScope.launch { loadRankings(tabs[index].source) }
    }

    private suspend fun loadRankings(source: String) {
        repo.getRankings(source).collect { rankings ->
            _state.update { it.copy(rankings = rankings, isLoading = false) }
        }
    }
}
