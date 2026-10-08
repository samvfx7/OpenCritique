package com.opencritique.presentation

import androidx.lifecycle.ViewModel
import com.opencritique.navigation.PrimaryDestination
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

data class OpenCritiqueUiState(
    val selectedDestination: PrimaryDestination = PrimaryDestination.HOME,
)

class OpenCritiqueViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(OpenCritiqueUiState())
    val uiState: StateFlow<OpenCritiqueUiState> = _uiState.asStateFlow()

    fun onDestinationSelected(destination: PrimaryDestination) {
        _uiState.update { it.copy(selectedDestination = destination) }
    }
}
