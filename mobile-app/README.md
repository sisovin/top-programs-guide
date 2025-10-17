# Mobile App - Kotlin Multiplatform Mobile (KMM)

Top 10 Programming Languages mobile application built with Kotlin Multiplatform Mobile (KMM), sharing business logic between Android and iOS.

---

## Architecture

```
mobile-app/
├── shared/                   # Shared Kotlin code
│   └── src/
│       └── commonMain/      # Platform-agnostic code
│           ├── api/         # API client
│           ├── models/      # Data models
│           └── repository/  # Data repository
├── androidApp/              # Android-specific code
│   └── src/main/
│       ├── java/           # Jetpack Compose UI
│       └── res/            # Android resources
└── iosApp/                 # iOS-specific code (macOS only)
    └── iosApp/             # SwiftUI code
```

---

## Prerequisites

### Common Requirements

- **JDK**: 17 or higher
- **Kotlin**: 1.9.20+ (installed via Gradle)
- **Gradle**: 8.5 (included via wrapper)

### Android Development

- **Android Studio**: Hedgehog (2023.1.1) or later
- **Android SDK**: API 34 (Android 14)
- **Min SDK**: API 24 (Android 7.0)

### iOS Development (macOS only)

- **Xcode**: 14.3 or later
- **macOS**: 12.0 (Monterey) or later
- **CocoaPods**: Latest version
- **iOS Target**: 15.0+

---

## Quick Start

### 1. Setup Project

```bash
# Clone repository (if not already done)
cd mobile-app

# Verify Gradle wrapper
./gradlew --version   # macOS/Linux
gradlew.bat --version # Windows

# Install dependencies
./gradlew build
```

### 2. Android Development

#### Option A: Android Studio (Recommended)

1. Open Android Studio
2. File → Open → Select `mobile-app` directory
3. Wait for Gradle sync to complete
4. Select `androidApp` run configuration
5. Choose emulator or connected device
6. Click Run ▶️

#### Option B: Command Line

```bash
# Build APK
./gradlew :androidApp:assembleDebug

# Install on connected device
./gradlew :androidApp:installDebug

# Build and run
./gradlew :androidApp:installDebug
adb shell am start -n com.topprogramsguide.android/.MainActivity
```

**Output**: `androidApp/build/outputs/apk/debug/androidApp-debug.apk`

### 3. iOS Development (macOS only)

```bash
# Open iOS project in Xcode
cd iosApp
open iosApp.xcodeproj

# Or use command line
xcodebuild -project iosApp.xcodeproj \
           -scheme iosApp \
           -destination 'platform=iOS Simulator,name=iPhone 15' \
           -configuration Debug \
           build
```

**In Xcode**:

1. Select target device/simulator
2. Product → Run (⌘R)

---

## Project Configuration

### Environment Variables

Create `local.properties` in `mobile-app/` directory:

```properties
# Android SDK path (auto-detected by Android Studio)
sdk.dir=/Users/username/Library/Android/sdk

# Optional: Backend API URL override
api.base.url=http://10.0.2.2:3001
```

**Note**: `10.0.2.2` is the special IP for Android emulator to access host localhost.

### API Configuration

API endpoints are configured in `shared/src/commonMain/kotlin/api/LanguageApi.kt`:

```kotlin
private const val BASE_URL = "http://localhost:3001"  // Development
// private const val BASE_URL = "https://api.production.com"  // Production
```

For Android emulator, use:

```kotlin
private const val BASE_URL = "http://10.0.2.2:3001"
```

For iOS simulator, use:

```kotlin
private const val BASE_URL = "http://localhost:3001"
```

For physical devices, use your machine's IP:

```kotlin
private const val BASE_URL = "http://192.168.1.100:3001"
```

---

## Build Commands

### Shared Module

```bash
# Build shared library
./gradlew :shared:build

# Run shared tests
./gradlew :shared:test

# Generate iOS framework
./gradlew :shared:linkDebugFrameworkIosArm64
```

### Android App

```bash
# Build debug APK
./gradlew :androidApp:assembleDebug

# Build release APK (requires signing)
./gradlew :androidApp:assembleRelease

# Build Android App Bundle (AAB) for Play Store
./gradlew :androidApp:bundleRelease

# Run unit tests
./gradlew :androidApp:testDebugUnitTest

# Run instrumented tests (requires emulator/device)
./gradlew :androidApp:connectedAndroidTest

# Lint checks
./gradlew :androidApp:lintDebug
```

### iOS App (macOS only)

```bash
# Build for simulator
xcodebuild -project iosApp/iosApp.xcodeproj \
           -scheme iosApp \
           -sdk iphonesimulator \
           -configuration Debug \
           build

# Build for device
xcodebuild -project iosApp/iosApp.xcodeproj \
           -scheme iosApp \
           -sdk iphoneos \
           -configuration Release \
           build

# Run tests
xcodebuild test -project iosApp/iosApp.xcodeproj \
                -scheme iosApp \
                -destination 'platform=iOS Simulator,name=iPhone 15'
```

---

## Development Workflow

### 1. Start Backend API

```bash
cd ../backend
npm run dev
# Backend runs on http://localhost:3001
```

### 2. Android Development

```bash
# Terminal 1: Watch shared module changes
./gradlew :shared:build --continuous

# Terminal 2: Run Android app
./gradlew :androidApp:installDebug && adb logcat | grep TopProgramsGuide
```

### 3. iOS Development

```bash
# Rebuild shared framework when code changes
./gradlew :shared:linkDebugFrameworkIosArm64

# Then rebuild in Xcode (⌘B)
```

---

## Troubleshooting

### Android Issues

**Problem**: Gradle sync failed

```bash
# Solution: Clear Gradle cache
./gradlew clean cleanBuildCache
rm -rf ~/.gradle/caches
```

**Problem**: SDK not found

```bash
# Solution: Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
set ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk  # Windows
```

**Problem**: Cannot connect to localhost API

```bash
# Solution: Use Android emulator special IP
# Change BASE_URL to http://10.0.2.2:3001
```

**Problem**: Build fails with "Duplicate class"

```bash
# Solution: Exclude duplicate dependencies
./gradlew :androidApp:dependencies --configuration debugRuntimeClasspath
# Look for duplicates and exclude in build.gradle.kts
```

### iOS Issues

**Problem**: "No such module 'shared'"

```bash
# Solution: Rebuild shared framework
./gradlew :shared:clean
./gradlew :shared:linkDebugFrameworkIosArm64
# Then clean build folder in Xcode: Shift+⌘K
```

**Problem**: CocoaPods issues

```bash
cd iosApp
pod deintegrate
pod install
```

**Problem**: Xcode build fails

```bash
# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clean build folder in Xcode
Product → Clean Build Folder (Shift+⌘K)
```

### Shared Module Issues

**Problem**: Ktor client not working

```bash
# Verify dependencies in shared/build.gradle.kts
# Ensure correct Ktor version for each platform
```

**Problem**: Serialization issues

```bash
# Verify @Serializable annotation on data classes
# Ensure kotlinx-serialization-json dependency is present
```

---

## Testing

### Unit Tests (Shared)

```bash
# Run common tests
./gradlew :shared:test

# Run Android-specific tests
./gradlew :shared:testDebugUnitTest
```

### Android Tests

```bash
# Unit tests
./gradlew :androidApp:testDebugUnitTest

# Instrumented tests (requires emulator)
./gradlew :androidApp:connectedDebugAndroidTest
```

### iOS Tests

```bash
xcodebuild test -project iosApp/iosApp.xcodeproj \
                -scheme iosApp \
                -destination 'platform=iOS Simulator,name=iPhone 15'
```

---

## Release Builds

### Android Release

1. **Create keystore** (first time only):

```bash
keytool -genkey -v -keystore release-key.jks \
        -alias top-programs-guide \
        -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure signing** in `androidApp/build.gradle.kts`:

```kotlin
signingConfigs {
    create("release") {
        storeFile = file("../release-key.jks")
        storePassword = System.getenv("KEYSTORE_PASSWORD")
        keyAlias = "top-programs-guide"
        keyPassword = System.getenv("KEY_PASSWORD")
    }
}
```

3. **Build release**:

```bash
export KEYSTORE_PASSWORD="your-password"
export KEY_PASSWORD="your-key-password"
./gradlew :androidApp:bundleRelease
```

**Output**: `androidApp/build/outputs/bundle/release/androidApp-release.aab`

### iOS Release

1. **Configure signing** in Xcode:
   - Select project → Signing & Capabilities
   - Enable "Automatically manage signing"
   - Select your Team

2. **Archive**:
   - Product → Archive
   - Organizer → Distribute App → App Store Connect

---

## Dependencies

### Shared Module

- **Ktor**: 2.3.5 (HTTP client)
- **Kotlinx Serialization**: 1.6.0 (JSON parsing)
- **Kotlinx Coroutines**: 1.7.3 (Async programming)
- **Kotlinx DateTime**: 0.4.1 (Date/time utilities)

### Android App

- **Jetpack Compose**: 2024.01.00 (UI framework)
- **Material 3**: Latest (Material Design components)
- **Navigation Compose**: 2.7.6 (Navigation)
- **Coil**: 2.5.0 (Image loading)
- **Lifecycle**: 2.7.0 (ViewModel, LiveData)

### iOS App

- **SwiftUI**: Built-in (UI framework)
- **Combine**: Built-in (Reactive programming)

---

## Code Structure

### Shared Module (`shared/`)

```kotlin
// API Client
api/LanguageApi.kt
  - getAllLanguages()
  - getLanguageById(id)
  - searchLanguages(query)

// Data Models
models/Language.kt
  - @Serializable data class Language

// Repository
repository/LanguageRepository.kt
  - suspend fun fetchLanguages(): List<Language>
  - suspend fun getLanguage(id: String): Language?
```

### Android App (`androidApp/`)

```kotlin
// UI Screens
ui/screens/LanguageListScreen.kt
  - @Composable LanguageListScreen()
  - Displays list of languages

ui/screens/LanguageDetailScreen.kt
  - @Composable LanguageDetailScreen(id: String)
  - Shows language details

// ViewModels
ui/viewmodels/LanguageListViewModel.kt
  - class LanguageListViewModel : ViewModel()
  - Manages list state

ui/viewmodels/LanguageDetailViewModel.kt
  - class LanguageDetailViewModel : ViewModel()
  - Manages detail state

// Theme
ui/theme/Theme.kt
  - @Composable TopProgramsGuideTheme()
```

---

## Performance Optimization

### Android

- **R8/ProGuard**: Enabled in release builds
- **Code shrinking**: Removes unused code
- **Resource shrinking**: Removes unused resources
- **Compose compiler**: Optimizes UI rendering

### iOS

- **Optimization level**: `-O` for release builds
- **Bitcode**: Enabled for App Store
- **Dead code stripping**: Enabled

### Shared

- **Kotlin Native**: Optimized for each platform
- **Framework**: Static linking for iOS

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build Mobile App

on: [push, pull_request]

jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Build Android
        run: |
          cd mobile-app
          ./gradlew :androidApp:assembleDebug
          
  ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - name: Build iOS
        run: |
          cd mobile-app
          ./gradlew :shared:linkDebugFrameworkIosArm64
          cd iosApp
          xcodebuild -project iosApp.xcodeproj -scheme iosApp build
```

---

## Additional Resources

- **Kotlin Multiplatform**: <https://kotlinlang.org/docs/multiplatform.html>
- **Jetpack Compose**: <https://developer.android.com/jetpack/compose>
- **SwiftUI**: <https://developer.apple.com/xcode/swiftui/>
- **Ktor**: <https://ktor.io/>
- **Android Studio**: <https://developer.android.com/studio>
- **Xcode**: <https://developer.apple.com/xcode/>

---

## Support

For mobile app issues, see:

- Main project [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md)
- Android [developer guide](https://developer.android.com)
- iOS [developer guide](https://developer.apple.com)
- KMM [documentation](https://kotlinlang.org/docs/multiplatform-mobile-getting-started.html)

---

**Last Updated**: October 17, 2025  
**Kotlin**: 1.9.20  
**Gradle**: 8.5  
**Android SDK**: 34  
**iOS Target**: 15.0+
