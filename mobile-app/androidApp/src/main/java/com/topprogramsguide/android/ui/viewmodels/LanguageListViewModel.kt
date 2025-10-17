package com.topprogramsguide.android.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import models.Language
import models.Result
import repository.LanguageRepository

class LanguageListViewModel(
    private val repository: LanguageRepository = LanguageRepository()
) : ViewModel() {
    
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()
    
    private val _uiState = MutableStateFlow<Result<List<Language>>>(Result.Loading())
    val uiState: StateFlow<Result<List<Language>>> = _uiState.asStateFlow()
    
    init {
        loadLanguages()
        observeSearchQuery()
    }
    
    private fun loadLanguages() {
        viewModelScope.launch {
            repository.getLanguages()
                .collect { result ->
                    _uiState.value = result
                }
        }
    }
    
    private fun observeSearchQuery() {
        viewModelScope.launch {
            searchQuery
                .debounce(300) // Wait 300ms after user stops typing
                .distinctUntilChanged()
                .collect { query ->
                    if (query.isBlank()) {
                        loadLanguages()
                    } else {
                        searchLanguages(query)
                    }
                }
        }
    }
    
    private fun searchLanguages(query: String) {
        viewModelScope.launch {
            repository.searchLanguages(query)
                .collect { result ->
                    _uiState.value = result
                }
        }
    }
    
    fun onSearchQueryChange(query: String) {
        _searchQuery.value = query
    }
    
    fun refresh() {
        viewModelScope.launch {
            repository.getLanguages(forceRefresh = true)
                .collect { result ->
                    _uiState.value = result
                }
        }
    }
    
    fun retry() {
        loadLanguages()
    }
}
