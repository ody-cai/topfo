package com.topfo.app.ui.files

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class FileItem(
    val id: String,
    val title: String,
    val date: String,
    val source: String,
    val pages: Int,
    val size: String,
    val fileName: String,
    val summary: String
)

data class FilesUiState(
    val files: List<FileItem> = FilesViewModel.defaultFiles,
    val selectedFile: FileItem? = null
)

class FilesViewModel : ViewModel() {
    private val _state = MutableStateFlow(FilesUiState())
    val state: StateFlow<FilesUiState> = _state.asStateFlow()

    fun selectFile(file: FileItem) {
        _state.update { it.copy(selectedFile = file) }
    }

    companion object {
        val defaultFiles = listOf(
            FileItem(
                id = "qs-skills-2027",
                title = "QS World Future Skills Index 2027",
                date = "2027年",
                source = "Quacquarelli Symonds (QS)",
                pages = 62,
                size = "5.5MB",
                fileName = "QS_World_Future_Skills_Index_2027.pdf",
                summary = "全球89个经济体的未来技能评估：学术准备度、经济转型、就业市场匹配度、技能缺口。加拿大排名全球第5，学术准备度第4，AI技能缺口突出。"
            )
        )
    }
}
