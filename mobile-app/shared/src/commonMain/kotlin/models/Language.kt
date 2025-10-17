package com.topprogramsguide.shared.models

import kotlinx.serialization.Serializable

/**
 * Represents salary range information for a programming language
 */
@Serializable
data class SalaryRange(
    val min: Int,
    val max: Int,
    val currency: String,
    val experienceLevel: String? = null
)

/**
 * Represents a programming language with comprehensive details
 */
@Serializable
data class Language(
    val id: Int,
    val name: String,
    val description: String,
    val useCases: List<String>,
    val advantages: List<String>,
    val salaryRange: SalaryRange,
    val popularityIndex: Int,
    val releaseYear: Int,
    val logoUrl: String,
    val createdAt: String,
    val updatedAt: String
)

/**
 * API response wrapper with pagination information
 */
@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val data: T,
    val pagination: Pagination? = null
)

/**
 * Pagination metadata
 */
@Serializable
data class Pagination(
    val page: Int,
    val limit: Int,
    val total: Int,
    val totalPages: Int
)

/**
 * Represents the result of an operation that can succeed or fail
 */
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Exception) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

/**
 * Extension function to check if result is successful
 */
fun <T> Result<T>.isSuccess(): Boolean = this is Result.Success

/**
 * Extension function to get data from successful result
 */
fun <T> Result<T>.getOrNull(): T? = when (this) {
    is Result.Success -> data
    else -> null
}
