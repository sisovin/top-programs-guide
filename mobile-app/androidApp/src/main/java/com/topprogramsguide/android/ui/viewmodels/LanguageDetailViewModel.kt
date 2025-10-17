package com.topprogramsguide.android.ui.viewmodels

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import models.Language
import models.Result
import repository.LanguageRepository

class LanguageDetailViewModel(
    private val savedStateHandle: SavedStateHandle,
    private val repository: LanguageRepository = LanguageRepository()
) : ViewModel() {
    
    private val languageId: String = checkNotNull(savedStateHandle["languageId"])
    
    private val _uiState = MutableStateFlow<Result<Language>>(Result.Loading())
    val uiState: StateFlow<Result<Language>> = _uiState.asStateFlow()
    
    init {
        loadLanguage()
    }
    
    private fun loadLanguage() {
        viewModelScope.launch {
            repository.getLanguageById(languageId)
                .collect { result ->
                    _uiState.value = result
                }
        }
    }
    
    fun retry() {
        loadLanguage()
    }
}
