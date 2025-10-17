package com.topprogramsguide.shared.repository

import com.topprogramsguide.shared.api.LanguageApi
import com.topprogramsguide.shared.models.Language
import com.topprogramsguide.shared.models.Result
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Repository layer that manages data fetching and caching
 * Implements offline-first strategy with in-memory caching
 */
class LanguageRepository(
    private val api: LanguageApi = LanguageApi()
) {
    // In-memory cache
    private val languagesCache = MutableStateFlow<List<Language>>(emptyList())
    private val languageDetailCache = mutableMapOf<Int, Language>()
    
    // Cache state
    private var isCacheInitialized = false
    private var lastFetchTime: Long = 0
    private val cacheValidityDuration = 5 * 60 * 1000 // 5 minutes

    /**
     * Get all languages as a Flow (reactive stream)
     * Returns cached data if available and valid, otherwise fetches from API
     */
    fun getLanguages(
        forceRefresh: Boolean = false
    ): Flow<Result<List<Language>>> {
        val resultFlow = MutableStateFlow<Result<List<Language>>>(Result.Loading)
        
        kotlinx.coroutines.GlobalScope.launch {
            try {
                // Return cached data if valid and not forcing refresh
                if (!forceRefresh && isCacheValid() && languagesCache.value.isNotEmpty()) {
                    resultFlow.value = Result.Success(languagesCache.value)
                    return@launch
                }
                
                // Fetch from API
                resultFlow.value = Result.Loading
                when (val apiResult = api.getTopLanguages(50)) {
                    is Result.Success -> {
                        // Update cache
                        languagesCache.value = apiResult.data
                        isCacheInitialized = true
                        lastFetchTime = System.currentTimeMillis()
                        
                        // Cache individual items
                        apiResult.data.forEach { lang ->
                            languageDetailCache[lang.id] = lang
                        }
                        
                        resultFlow.value = Result.Success(apiResult.data)
                    }
                    is Result.Error -> {
                        // If fetch fails but we have cached data, return it
                        if (languagesCache.value.isNotEmpty()) {
                            resultFlow.value = Result.Success(languagesCache.value)
                        } else {
                            resultFlow.value = Result.Error(apiResult.exception)
                        }
                    }
                    else -> resultFlow.value = Result.Loading
                }
            } catch (e: Exception) {
                // Fallback to cache on error
                if (languagesCache.value.isNotEmpty()) {
                    resultFlow.value = Result.Success(languagesCache.value)
                } else {
                    resultFlow.value = Result.Error(e)
                }
            }
        }
        
        return resultFlow.asStateFlow()
    }

    /**
     * Get a single language by ID
     * Checks detail cache first, then list cache, then fetches from API
     */
    suspend fun getLanguageById(id: Int): Result<Language> {
        return try {
            // Check detail cache first
            languageDetailCache[id]?.let {
                return Result.Success(it)
            }
            
            // Check if it exists in the languages list cache
            languagesCache.value.find { it.id == id }?.let {
                languageDetailCache[id] = it
                return Result.Success(it)
            }
            
            // Fetch from API
            when (val apiResult = api.getLanguageById(id)) {
                is Result.Success -> {
                    languageDetailCache[id] = apiResult.data
                    Result.Success(apiResult.data)
                }
                is Result.Error -> Result.Error(apiResult.exception)
                else -> Result.Loading
            }
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    /**
     * Search languages by query
     * Performs search on cached data if available, otherwise fetches from API
     */
    suspend fun searchLanguages(query: String): Result<List<Language>> {
        return try {
            if (query.isBlank()) {
                return Result.Success(languagesCache.value)
            }
            
            // Search in cache first
            if (languagesCache.value.isNotEmpty()) {
                val filtered = languagesCache.value.filter { language ->
                    language.name.contains(query, ignoreCase = true) ||
                    language.description.contains(query, ignoreCase = true) ||
                    language.useCases.any { it.contains(query, ignoreCase = true) }
                }
                return Result.Success(filtered)
            }
            
            // Fetch from API if cache is empty
            api.searchLanguages(query)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    /**
     * Refresh the cache with fresh data from API
     */
    suspend fun refresh(): Result<List<Language>> {
        return try {
            when (val apiResult = api.getTopLanguages(50)) {
                is Result.Success -> {
                    languagesCache.value = apiResult.data
                    isCacheInitialized = true
                    lastFetchTime = System.currentTimeMillis()
                    
                    // Update detail cache
                    apiResult.data.forEach { lang ->
                        languageDetailCache[lang.id] = lang
                    }
                    
                    Result.Success(apiResult.data)
                }
                is Result.Error -> Result.Error(apiResult.exception)
                else -> Result.Loading
            }
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    /**
     * Clear all cached data
     */
    fun clearCache() {
        languagesCache.value = emptyList()
        languageDetailCache.clear()
        isCacheInitialized = false
        lastFetchTime = 0
    }

    /**
     * Check if the cache is still valid
     */
    private fun isCacheValid(): Boolean {
        if (!isCacheInitialized) return false
        val currentTime = System.currentTimeMillis()
        return (currentTime - lastFetchTime) < cacheValidityDuration
    }

    /**
     * Get the current cache state
     */
    fun getCachedLanguages(): List<Language> = languagesCache.value
}

// Note: GlobalScope.launch is used for simplicity in this example.
// In a production app, you should use a properly scoped coroutine context.
private fun <T> kotlinx.coroutines.GlobalScope.launch(block: suspend () -> T) {
    kotlinx.coroutines.GlobalScope.launch {
        block()
    }
}
