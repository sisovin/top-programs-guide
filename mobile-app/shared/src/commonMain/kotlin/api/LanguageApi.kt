package com.topprogramsguide.shared.api

import com.topprogramsguide.shared.models.ApiResponse
import com.topprogramsguide.shared.models.Language
import com.topprogramsguide.shared.models.Result
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

/**
 * API client for programming languages data
 */
class LanguageApi(
    private val baseUrl: String = "http://localhost:3001/api"
) {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
                prettyPrint = true
            })
        }
    }

    /**
     * Fetch all programming languages with optional query parameters
     */
    suspend fun getLanguages(
        page: Int = 1,
        limit: Int = 10,
        search: String? = null,
        sort: String = "popularityIndex",
        order: String = "desc"
    ): Result<List<Language>> {
        return try {
            val response = client.get("$baseUrl/languages") {
                parameter("page", page)
                parameter("limit", limit)
                if (search != null) parameter("search", search)
                parameter("sort", sort)
                parameter("order", order)
            }
            
            val apiResponse: ApiResponse<List<Language>> = response.body()
            Result.Success(apiResponse.data)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    /**
     * Fetch a single programming language by ID
     */
    suspend fun getLanguageById(id: Int): Result<Language> {
        return try {
            val response = client.get("$baseUrl/languages/$id")
            val apiResponse: ApiResponse<Language> = response.body()
            Result.Success(apiResponse.data)
        } catch (e: Exception) {
            Result.Error(e)
        }
    }

    /**
     * Search languages by query string
     */
    suspend fun searchLanguages(query: String): Result<List<Language>> {
        return getLanguages(search = query, limit = 50)
    }

    /**
     * Get top N languages by popularity
     */
    suspend fun getTopLanguages(count: Int = 10): Result<List<Language>> {
        return getLanguages(limit = count, sort = "popularityIndex", order = "desc")
    }

    /**
     * Clean up resources
     */
    fun close() {
        client.close()
    }
}
