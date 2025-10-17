package com.topprogramsguide.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.topprogramsguide.android.ui.screens.LanguageDetailScreen
import com.topprogramsguide.android.ui.screens.LanguageListScreen
import com.topprogramsguide.android.ui.theme.TopProgramsGuideTheme
import com.topprogramsguide.android.ui.viewmodels.LanguageDetailViewModel
import com.topprogramsguide.android.ui.viewmodels.LanguageListViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TopProgramsGuideTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavigation()
                }
            }
        }
    }
}

@Composable
fun AppNavigation(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = "languages"
    ) {
        composable("languages") {
            val viewModel: LanguageListViewModel = viewModel()
            LanguageListScreen(
                viewModel = viewModel,
                onLanguageClick = { languageId ->
                    navController.navigate("language/$languageId")
                }
            )
        }
        
        composable(
            route = "language/{languageId}",
            arguments = listOf(
                navArgument("languageId") { 
                    type = NavType.StringType 
                }
            )
        ) {
            val viewModel: LanguageDetailViewModel = viewModel()
            LanguageDetailScreen(
                viewModel = viewModel,
                onNavigateBack = {
                    navController.popBackStack()
                }
            )
        }
    }
}
