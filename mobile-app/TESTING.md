# Mobile App Testing Guide

**Project**: Top Programs Guide - Kotlin Multiplatform Mobile  
**Task**: T070 - Cross-platform mobile testing  
**Date**: October 17, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Android Testing](#android-testing)
3. [iOS Testing](#ios-testing)
4. [Shared Code Testing](#shared-code-testing)
5. [API Integration Testing](#api-integration-testing)
6. [Manual Testing](#manual-testing)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This mobile app uses **Kotlin Multiplatform Mobile (KMM)** to share business logic between Android and iOS while maintaining native UI implementations. Testing strategy:

- **Shared Code**: Unit tests in `shared/src/commonTest/`
- **Android**: Instrumented tests with Espresso/AndroidJUnit4
- **iOS**: UI tests with XCTest (macOS only)
- **API Integration**: Ktor client tests in shared module

---

## Android Testing

### Prerequisites

- Android Studio installed
- Android SDK configured
- Android Emulator or physical device

### Project Structure

```
androidApp/
├── src/
│   ├── main/          # Production code
│   ├── test/          # Unit tests (JUnit)
│   └── androidTest/   # Instrumented tests (Espresso)
```

### Setup Android Tests

**1. Add testing dependencies to `androidApp/build.gradle.kts`:**

```kotlin
dependencies {
    // Testing dependencies
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlin:kotlin-test")
    
    // Android instrumented tests
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4:1.5.4")
    
    // Debug manifest for Compose testing
    debugImplementation("androidx.compose.ui:ui-test-manifest:1.5.4")
}
```

**2. Create test directory structure:**

```bash
cd androidApp/src
mkdir -p androidTest/kotlin/com/topprograms/android
mkdir -p test/kotlin/com/topprograms/android
```

### Unit Tests (Local Tests)

**Location**: `androidApp/src/test/kotlin/`

**Example**: ViewModel unit test

```kotlin
// androidApp/src/test/kotlin/com/topprograms/android/LanguageViewModelTest.kt
package com.topprograms.android

import org.junit.Test
import org.junit.Assert.*

class LanguageViewModelTest {
    @Test
    fun `fetch languages returns non-empty list`() {
        // Given
        val viewModel = LanguageViewModel()
        
        // When
        val languages = viewModel.getLanguages()
        
        // Then
        assertTrue(languages.isNotEmpty())
    }
}
```

**Run unit tests:**

```bash
# Via Gradle
./gradlew :androidApp:testDebugUnitTest

# With coverage
./gradlew :androidApp:testDebugUnitTest --coverage
```

### Instrumented Tests (UI Tests)

**Location**: `androidApp/src/androidTest/kotlin/`

**Example**: Compose UI test

```kotlin
// androidApp/src/androidTest/kotlin/com/topprograms/android/LanguageListTest.kt
package com.topprograms.android

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class LanguageListTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun languageListDisplaysLanguages() {
        // Given
        composeTestRule.setContent {
            LanguageListScreen()
        }

        // Then
        composeTestRule
            .onNodeWithText("Python")
            .assertIsDisplayed()
        
        composeTestRule
            .onNodeWithText("JavaScript")
            .assertIsDisplayed()
    }

    @Test
    fun clickingLanguageNavigatesToDetail() {
        // Given
        composeTestRule.setContent {
            LanguageListScreen()
        }

        // When
        composeTestRule
            .onNodeWithText("Python")
            .performClick()

        // Then
        composeTestRule
            .onNodeWithText("Python Details")
            .assertIsDisplayed()
    }
}
```

**Run instrumented tests:**

```bash
# Start emulator first
emulator -avd Pixel_5_API_33 &

# Run instrumented tests
./gradlew :androidApp:connectedAndroidTest

# Or via Android Studio:
# Right-click androidTest folder → Run Tests
```

### Espresso UI Tests

For traditional View-based UI (if not using Compose):

```kotlin
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.action.ViewActions.click
import androidx.test.espresso.assertion.ViewAssertions.matches
import androidx.test.espresso.matcher.ViewMatchers.*
import androidx.test.ext.junit.rules.ActivityScenarioRule
import org.junit.Rule
import org.junit.Test

class MainActivityTest {
    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
    fun testLanguageListDisplayed() {
        onView(withId(R.id.recyclerView))
            .check(matches(isDisplayed()))
    }

    @Test
    fun testNavigationToDetail() {
        onView(withText("Python"))
            .perform(click())
        
        onView(withId(R.id.detailTitle))
            .check(matches(withText("Python")))
    }
}
```

### Test Coverage

```bash
# Generate coverage report
./gradlew :androidApp:createDebugCoverageReport

# View report
# androidApp/build/reports/coverage/androidTest/debug/index.html
```

---

## iOS Testing

### Prerequisites

- **macOS** (iOS development requires macOS)
- Xcode installed
- iOS Simulator or physical device

### Project Structure

```
iosApp/
├── iosApp/                 # Production code
└── iosAppTests/            # Unit and UI tests
    ├── iosAppTests.swift   # Unit tests
    └── iosAppUITests.swift # UI tests
```

### Setup iOS Tests

**1. Open project in Xcode:**

```bash
cd iosApp
open iosApp.xcodeproj
```

**2. Create test targets** (if not exist):

- File → New → Target → iOS Unit Testing Bundle
- File → New → Target → iOS UI Testing Bundle

### Unit Tests (XCTest)

**Location**: `iosApp/iosAppTests/`

**Example**: ViewModel unit test

```swift
// iosApp/iosAppTests/LanguageViewModelTests.swift
import XCTest
@testable import iosApp

class LanguageViewModelTests: XCTestCase {
    var viewModel: LanguageViewModel!
    
    override func setUp() {
        super.setUp()
        viewModel = LanguageViewModel()
    }
    
    override func tearDown() {
        viewModel = nil
        super.tearDown()
    }
    
    func testFetchLanguagesReturnsNonEmptyList() {
        // Given
        let expectation = self.expectation(description: "Fetch languages")
        
        // When
        viewModel.fetchLanguages { languages in
            // Then
            XCTAssertFalse(languages.isEmpty, "Languages should not be empty")
            expectation.fulfill()
        }
        
        waitForExpectations(timeout: 5, handler: nil)
    }
    
    func testLanguageHasRequiredFields() {
        // Given/When
        viewModel.fetchLanguages { languages in
            guard let firstLanguage = languages.first else {
                XCTFail("No languages found")
                return
            }
            
            // Then
            XCTAssertFalse(firstLanguage.name.isEmpty)
            XCTAssertFalse(firstLanguage.description.isEmpty)
        }
    }
}
```

### UI Tests (XCTest)

**Location**: `iosApp/iosAppUITests/`

**Example**: UI flow test

```swift
// iosApp/iosAppUITests/LanguageListUITests.swift
import XCTest

class LanguageListUITests: XCTestCase {
    var app: XCUIApplication!
    
    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }
    
    func testLanguageListDisplaysLanguages() throws {
        // Wait for list to load
        let languageList = app.tables["LanguageList"]
        XCTAssertTrue(languageList.waitForExistence(timeout: 5))
        
        // Verify Python is displayed
        let pythonCell = app.staticTexts["Python"]
        XCTAssertTrue(pythonCell.exists)
        
        // Verify JavaScript is displayed
        let jsCell = app.staticTexts["JavaScript"]
        XCTAssertTrue(jsCell.exists)
    }
    
    func testNavigateToLanguageDetail() throws {
        // Given
        let languageList = app.tables["LanguageList"]
        XCTAssertTrue(languageList.waitForExistence(timeout: 5))
        
        // When
        app.staticTexts["Python"].tap()
        
        // Then
        let detailTitle = app.navigationBars["Python"]
        XCTAssertTrue(detailTitle.waitForExistence(timeout: 3))
        
        let descriptionText = app.textViews["LanguageDescription"]
        XCTAssertTrue(descriptionText.exists)
    }
    
    func testSearchFunctionality() throws {
        // Given
        let searchField = app.searchFields["Search languages"]
        XCTAssertTrue(searchField.waitForExistence(timeout: 5))
        
        // When
        searchField.tap()
        searchField.typeText("Python")
        
        // Then
        let pythonCell = app.staticTexts["Python"]
        XCTAssertTrue(pythonCell.exists)
        
        let javaScriptCell = app.staticTexts["JavaScript"]
        XCTAssertFalse(javaScriptCell.exists)
    }
}
```

### Run iOS Tests

**Via Xcode:**

1. Product → Test (⌘U)
2. View results in Test Navigator (⌘6)

**Via Command Line:**

```bash
# Unit tests
xcodebuild test \
  -project iosApp.xcodeproj \
  -scheme iosApp \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.0'

# UI tests
xcodebuild test \
  -project iosApp.xcodeproj \
  -scheme iosApp \
  -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.0' \
  -only-testing:iosAppUITests
```

### Test Coverage

```bash
# Generate coverage report
xcodebuild test \
  -project iosApp.xcodeproj \
  -scheme iosApp \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -enableCodeCoverage YES

# View coverage in Xcode:
# Report Navigator (⌘9) → Coverage tab
```

---

## Shared Code Testing

### Overview

Shared business logic is tested in `shared/src/commonTest/` with Kotlin common tests that run on both platforms.

### Project Structure

```
shared/
├── src/
│   ├── commonMain/       # Shared production code
│   ├── commonTest/       # Shared tests (cross-platform)
│   ├── androidMain/      # Android-specific code
│   ├── androidTest/      # Android-specific tests
│   ├── iosMain/          # iOS-specific code
│   └── iosTest/          # iOS-specific tests
```

### Setup Shared Tests

**Add dependencies to `shared/build.gradle.kts`:**

```kotlin
kotlin {
    sourceSets {
        val commonTest by getting {
            dependencies {
                implementation(kotlin("test"))
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
            }
        }
        
        val androidTest by getting {
            dependencies {
                implementation(kotlin("test-junit"))
                implementation("junit:junit:4.13.2")
            }
        }
        
        val iosTest by getting {
            // iOS tests use kotlin-test automatically
        }
    }
}
```

### Common Tests

**Example**: Repository test (runs on both platforms)

```kotlin
// shared/src/commonTest/kotlin/com/topprograms/shared/LanguageRepositoryTest.kt
package com.topprograms.shared

import kotlin.test.*

class LanguageRepositoryTest {
    private lateinit var repository: LanguageRepository
    
    @BeforeTest
    fun setUp() {
        repository = LanguageRepository()
    }
    
    @AfterTest
    fun tearDown() {
        // Cleanup if needed
    }
    
    @Test
    fun `fetchLanguages returns list of languages`() = runTest {
        // When
        val result = repository.fetchLanguages()
        
        // Then
        assertTrue(result.isSuccess)
        assertTrue(result.getOrNull()?.isNotEmpty() == true)
    }
    
    @Test
    fun `fetchLanguageById returns correct language`() = runTest {
        // Given
        val languageId = "python"
        
        // When
        val result = repository.fetchLanguageById(languageId)
        
        // Then
        assertTrue(result.isSuccess)
        assertEquals("Python", result.getOrNull()?.name)
    }
    
    @Test
    fun `fetchLanguageById returns error for invalid id`() = runTest {
        // Given
        val invalidId = "nonexistent"
        
        // When
        val result = repository.fetchLanguageById(invalidId)
        
        // Then
        assertTrue(result.isFailure)
    }
}
```

### API Client Tests

**Example**: Ktor client test

```kotlin
// shared/src/commonTest/kotlin/com/topprograms/shared/ApiClientTest.kt
package com.topprograms.shared

import io.ktor.client.*
import io.ktor.client.engine.mock.*
import io.ktor.http.*
import kotlin.test.*

class ApiClientTest {
    @Test
    fun `successful API call returns data`() = runTest {
        // Given
        val mockEngine = MockEngine { request ->
            respond(
                content = """{"success":true,"data":[{"id":"python","name":"Python"}]}""",
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }
        val client = ApiClient(HttpClient(mockEngine))
        
        // When
        val result = client.getLanguages()
        
        // Then
        assertTrue(result.isSuccess)
        assertEquals(1, result.getOrNull()?.size)
    }
    
    @Test
    fun `API error returns failure`() = runTest {
        // Given
        val mockEngine = MockEngine { request ->
            respond(
                content = """{"success":false,"error":"Server error"}""",
                status = HttpStatusCode.InternalServerError,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }
        val client = ApiClient(HttpClient(mockEngine))
        
        // When
        val result = client.getLanguages()
        
        // Then
        assertTrue(result.isFailure)
    }
}
```

### Run Shared Tests

```bash
# Run all shared tests
./gradlew :shared:allTests

# Android tests only
./gradlew :shared:androidTest

# iOS tests only (macOS)
./gradlew :shared:iosTest
```

---

## API Integration Testing

### Mock API Responses

For reliable testing, mock API responses:

**Kotlin (Android/Shared):**

```kotlin
class MockLanguageRepository : LanguageRepository {
    override suspend fun fetchLanguages(): Result<List<Language>> {
        return Result.success(listOf(
            Language(
                id = "python",
                name = "Python",
                description = "High-level programming language",
                useCases = listOf("Web Development", "Data Science"),
                averageSalary = 95000
            )
        ))
    }
}
```

**Swift (iOS):**

```swift
class MockLanguageService: LanguageService {
    func fetchLanguages(completion: @escaping (Result<[Language], Error>) -> Void) {
        let mockLanguages = [
            Language(id: "python", name: "Python", description: "...", useCases: [], averageSalary: 95000)
        ]
        completion(.success(mockLanguages))
    }
}
```

### Integration Test Example

```kotlin
// shared/src/commonTest/kotlin/com/topprograms/shared/IntegrationTest.kt
@Test
fun `full flow from API to UI`() = runTest {
    // Given
    val repository = LanguageRepository()
    val viewModel = LanguageViewModel(repository)
    
    // When - Fetch languages
    viewModel.loadLanguages()
    
    // Then - Verify UI state
    assertEquals(LoadingState.Success, viewModel.state.value)
    assertTrue(viewModel.languages.value.isNotEmpty())
    
    // When - Select language
    viewModel.selectLanguage("python")
    
    // Then - Verify detail state
    assertNotNull(viewModel.selectedLanguage.value)
    assertEquals("Python", viewModel.selectedLanguage.value?.name)
}
```

---

## Manual Testing

### Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|----------------|
| **App Launch** | 1. Open app | Splash screen → Language list |
| **View Languages** | 1. Scroll through list | All languages visible |
| **Language Detail** | 1. Tap language card | Detail screen with full info |
| **Search** | 1. Enter "Python" in search | Filter to Python only |
| **Sort** | 1. Select "Salary" sort | Languages sorted by salary |
| **Compare** | 1. Select 2+ languages<br>2. Tap "Compare" | Comparison screen with both |
| **Theme Toggle** | 1. Switch dark/light mode | UI updates immediately |
| **Offline Mode** | 1. Disable network<br>2. Open app | Cached data or error message |
| **API Error** | 1. Backend offline<br>2. Open app | Error message displayed |

### Accessibility Testing

**Android:**

1. Enable TalkBack (Settings → Accessibility)
2. Navigate app with gestures
3. Verify content descriptions

**iOS:**

1. Enable VoiceOver (Settings → Accessibility)
2. Navigate with swipe gestures
3. Verify accessibility labels

### Performance Testing

**Android (Profiler):**

1. Run app in Android Studio
2. View → Tool Windows → Profiler
3. Monitor CPU, memory, network usage

**iOS (Instruments):**

1. Product → Profile (⌘I)
2. Select Time Profiler or Allocations
3. Analyze performance metrics

---

## CI/CD Integration

### GitHub Actions - Android

```yaml
name: Android Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'adopt'
    
    - name: Grant execute permission for gradlew
      run: chmod +x gradlew
    
    - name: Run unit tests
      run: ./gradlew :androidApp:testDebugUnitTest
    
    - name: Upload test reports
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: android-test-reports
        path: androidApp/build/reports/tests/
```

### GitHub Actions - iOS

```yaml
name: iOS Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Xcode
      uses: maxim-lobanov/setup-xcode@v1
      with:
        xcode-version: latest-stable
    
    - name: Run tests
      run: |
        xcodebuild test \
          -project iosApp/iosApp.xcodeproj \
          -scheme iosApp \
          -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.0'
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: ios-test-results
        path: ~/Library/Logs/DiagnosticReports/
```

---

## Troubleshooting

### Android Issues

**Problem**: Tests fail with "Unable to find instrumentation info"

**Solution**:

```bash
# Clean and rebuild
./gradlew clean
./gradlew :androidApp:assembleDebugAndroidTest
```

**Problem**: Emulator not starting

**Solution**:

```bash
# List available AVDs
emulator -list-avds

# Start specific AVD
emulator -avd Pixel_5_API_33 -no-snapshot-load
```

**Problem**: Tests timeout

**Solution**:

```kotlin
// Increase timeout in test
@Test(timeout = 30000) // 30 seconds
fun longRunningTest() { ... }
```

### iOS Issues

**Problem**: "No schemes" error in xcodebuild

**Solution**:

```bash
# List schemes
xcodebuild -list -project iosApp.xcodeproj

# Ensure scheme is shared (in Xcode):
# Product → Scheme → Manage Schemes → Check "Shared"
```

**Problem**: Simulator not found

**Solution**:

```bash
# List available simulators
xcrun simctl list devices

# Create new simulator
xcrun simctl create "iPhone 15" "iPhone 15"
```

**Problem**: Code signing issues

**Solution**:

```bash
# Disable code signing for testing
xcodebuild test -project iosApp.xcodeproj \
  -scheme iosApp \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  CODE_SIGN_IDENTITY="" \
  CODE_SIGNING_REQUIRED=NO
```

---

## Test Coverage Goals

| Platform | Unit Tests | UI Tests | Integration Tests | Total Coverage |
|----------|------------|----------|-------------------|----------------|
| **Shared** | ✅ 80%+ | N/A | ✅ 70%+ | ✅ 75%+ |
| **Android** | ⏳ 70%+ | ⏳ 60%+ | ⏳ 50%+ | ⏳ 65%+ |
| **iOS** | ⏳ 70%+ | ⏳ 60%+ | ⏳ 50%+ | ⏳ 65%+ |

---

## Resources

- **Kotlin Test Docs**: <https://kotlinlang.org/api/latest/kotlin.test/>
- **Android Testing**: <https://developer.android.com/training/testing>
- **Espresso Guide**: <https://developer.android.com/training/testing/espresso>
- **XCTest Guide**: <https://developer.apple.com/documentation/xctest>
- **Ktor Client Mock**: <https://ktor.io/docs/http-client-testing.html>

---

**Last Updated**: October 17, 2025  
**Status**: Testing framework setup complete  
**Next Steps**: Implement test suites for Android and iOS apps
