package com.opencritique.presentation.design.motion

import androidx.compose.animation.core.EaseInOutCubic
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize

object OCMotionSpecs {
    val shortDuration = 200

    val mediumDuration = 300

    val longDuration = 500

    val quickEasing = tween<Float>(
        durationMillis = shortDuration,
        easing = FastOutSlowInEasing,
    )

    val standardEasing = tween<Float>(
        durationMillis = mediumDuration,
        easing = EaseInOutCubic,
    )

    val slowEasing = tween<Float>(
        durationMillis = longDuration,
        easing = EaseInOutCubic,
    )
}
