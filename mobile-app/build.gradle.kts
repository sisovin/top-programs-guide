plugins {
    kotlin("multiplatform") version "1.9.20" apply false
    id("com.android.application") version "8.1.4" apply false
    id("com.android.library") version "8.1.4" apply false
    id("org.jetbrains.compose") version "1.5.10" apply false
}

tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}
