package com.topfo.app.ui.chat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.topfo.app.data.remote.dto.ChatMessageDto
import com.topfo.app.data.repository.ChatRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class ChatUiState(
    val messages: List<ChatMessageDto> = emptyList(),
    val inputText: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)

class ChatViewModel(
    private val chatRepo: ChatRepository,
    private val getToken: () -> String
) : ViewModel() {
    private val _state = MutableStateFlow(ChatUiState())
    val state: StateFlow<ChatUiState> = _state.asStateFlow()

    fun loadHistory() {
        viewModelScope.launch {
            chatRepo.loadHistory(getToken()).fold(
                onSuccess = { msgs -> _state.update { it.copy(messages = msgs.reversed()) } },
                onFailure = {}
            )
        }
    }

    fun setInput(text: String) { _state.update { it.copy(inputText = text) } }

    fun send() {
        val text = _state.value.inputText.trim()
        if (text.isEmpty()) return

        _state.update { it.copy(inputText = "", isLoading = true, error = null) }

        viewModelScope.launch {
            chatRepo.sendMessage(getToken(), text).fold(
                onSuccess = { response ->
                    val replyText = response.reply ?: ""
                    _state.update {
                        it.copy(
                            messages = it.messages + listOf(
                                ChatMessageDto(role = "user", content = text),
                                ChatMessageDto(role = "assistant", content = replyText)
                            ),
                            isLoading = false
                        )
                    }
                },
                onFailure = { e ->
                    _state.update { it.copy(error = e.message, isLoading = false) }
                }
            )
        }
    }

    fun clear() {
        viewModelScope.launch {
            chatRepo.clearChat(getToken()).fold(
                onSuccess = { _state.update { it.copy(messages = emptyList()) } },
                onFailure = { e -> _state.update { it.copy(error = e.message) } }
            )
        }
    }
}
