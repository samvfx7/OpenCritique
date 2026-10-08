package com.opencritique.domain.repository

import com.opencritique.domain.model.Exercise
import com.opencritique.domain.model.Habit
import com.opencritique.domain.model.HabitCompletion
import com.opencritique.domain.model.TrainingProgram
import com.opencritique.domain.model.Workout

interface ExerciseRepository {
    suspend fun getExercises(): List<Exercise>
    suspend fun save(exercise: Exercise)
}

interface WorkoutRepository {
    suspend fun getWorkout(id: String): Workout?
    suspend fun save(workout: Workout)
}

interface TrainingProgramRepository {
    suspend fun getPrograms(): List<TrainingProgram>
    suspend fun save(program: TrainingProgram)
}

interface HabitRepository {
    suspend fun getHabits(): List<Habit>
    suspend fun save(habit: Habit)
    suspend fun saveCompletion(completion: HabitCompletion)
}

interface ProgressionRepository {
    suspend fun getTotalXp(): Long
    suspend fun saveXpEvent(sourceId: String, xp: Long)
}
