package com.topfo.app.ui.insights

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class InsightItem(val num: Int, val label: String, val title: String, val desc: String)

data class InsightsUiState(
    val isLoggedIn: Boolean = false,
    val gpa: Double = 89.6,
    val ieltsTotal: Double = 5.0,
    val findings: List<InsightItem> = InsightsViewModel.defaultFindings
)

class InsightsViewModel : ViewModel() {
    private val _state = MutableStateFlow(InsightsUiState())
    val state: StateFlow<InsightsUiState> = _state.asStateFlow()

    fun setLoggedIn(gpa: Double, ielts: Double) {
        _state.update { it.copy(isLoggedIn = true, gpa = gpa, ieltsTotal = ielts) }
    }

    companion object {
        val defaultFindings = listOf(
            InsightItem(1, "critical", "多大分校区比主校容易很多",
                "UTM CS要求mid-high 80s，你GPA 89.6已超线（vs UTSG 93%/97.2%中位）；UTSC心理仅需mid-high 70s，你89.6远超，且有Co-op。"),
            InsightItem(2, "critical", "UBC Okanagan比温哥华低10分+有双录",
                "UBC Okanagan工程80-85%你完全够，有EFP英语预科。对比UBC温哥华工程92%+的录取线，Okanagan是进入UBC体系的绝佳跳板。"),
            InsightItem(3, "important", "数学比CS好进约9分",
                "麦马数学85% vs CS 94%，你正好踩线数学。可以以数学为跳板，之后辅修或转CS。"),
            InsightItem(4, "important", "心理学比CS好进10-15分",
                "阿尔伯塔心理75% vs CS 82%，你89.6远超心理线。UTSC心理有Co-op且录取友好。"),
            InsightItem(5, "success", "TMU CS 82%你完全够",
                "多伦多市中心+Co-op+雅思5.0双录达标，是城市大学中最现实的选择之一。"),
            InsightItem(6, "success", "麦马MELD门槛降至5.0你已达标",
                "商科88%你89.6超1.6分，MELD(1年)双录通道已解锁。"),
            InsightItem(7, "important", "渥太华+SFU雅思5.0双录已达标",
                "渥太华CS Co-op就业好，SFU FIC桥梁温哥华地理位置佳。两校GPA均在你范围内。"),
            InsightItem(8, "critical", "皇后的Q-Bridge EAP需5.5",
                "皇后工程88%你GPA够，但Q-Bridge EAP门槛5.5你差0.5分，需进一步提升雅思或争取Accelerated(6.0)轨。"),
            InsightItem(9, "success", "多个保底校雅思5.0双录已达标",
                "温莎ELIP 4.5+、曼尼托巴ELSP 5.0+、纽芬兰纪念ESL 5.0+，学费最低6-9万人民币/年。"),
            InsightItem(10, "important", "雅思听力+阅读各差1.5分是最大瓶颈",
                "从5.0到6.5需提高1.5分。听读是提分最快项（中国考生传统弱项），建议集中攻听读+0.5-1分即可解锁大量双录/直录路径。")
        )
    }
}
