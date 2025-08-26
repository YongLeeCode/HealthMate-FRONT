import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { getExercisesByMuscleGroup, getExercisesByDifficulty } from '@/data/exercises';
import { Exercise, MuscleGroup, DifficultyLevel, WorkoutLocation } from '@/types/workout';

export default function WorkoutCurriculumScreen() {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const router = useRouter();
  
  const { muscles, difficulty, duration, restTime, location } = useLocalSearchParams<{
    muscles?: string;
    difficulty?: string;
    duration?: string;
    restTime?: string;
    location?: string;
  }>();

  const muscleGroups = useMemo(() => 
    muscles?.split(',') as MuscleGroup[] || [], 
    [muscles]
  );

  const difficultyLevel = useMemo(() => 
    difficulty as DifficultyLevel || 'beginner', 
    [difficulty]
  );

  const workoutDuration = useMemo(() => 
    parseInt(duration || '30') * 60, 
    [duration]
  );

  const restDuration = useMemo(() => 
    parseInt(restTime || '45'), 
    [restTime]
  );

  const workoutLocation = useMemo(() => 
    location as WorkoutLocation || 'home', 
    [location]
  );

  // Generate exercises based on preferences
  useEffect(() => {
    if (muscleGroups.length > 0) {
      const allExercises: Exercise[] = [];
      
      // Get exercises for each muscle group
      muscleGroups.forEach(muscleGroup => {
        const exercises = getExercisesByMuscleGroup(muscleGroup);
        allExercises.push(...exercises);
      });

      // Filter by difficulty
      const difficultyFiltered = allExercises.filter(exercise => 
        exercise.difficulty === difficultyLevel
      );

      // Filter by location (equipment availability)
      const locationFiltered = difficultyFiltered.filter(exercise => {
        if (workoutLocation === 'home' || workoutLocation === 'office') {
          return exercise.equipment.length === 0; // No equipment needed
        }
        return true; // Gym/outdoor can use any equipment
      });

      // Remove duplicates and select exercises
      const uniqueExercises = locationFiltered.filter((exercise, index, self) =>
        index === self.findIndex(e => e.id === exercise.id)
      );

      // Select exercises to fit the duration
      const selected = selectExercisesForDuration(uniqueExercises, workoutDuration, restDuration);
      setSelectedExercises(selected);
    }
  }, [muscleGroups, difficultyLevel, workoutDuration, restDuration, workoutLocation]);

  // Calculate total duration when exercises change
  useEffect(() => {
    const total = selectedExercises.reduce((sum, exercise) => {
      return sum + exercise.durationSeconds + restDuration;
    }, 0) - restDuration; // Subtract last rest period
    setTotalDuration(total);
  }, [selectedExercises, restDuration]);

  const selectExercisesForDuration = (
    exercises: Exercise[], 
    targetDuration: number, 
    restTime: number
  ): Exercise[] => {
    const selected: Exercise[] = [];
    let currentDuration = 0;
    
    // Shuffle exercises for variety
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    
    for (const exercise of shuffled) {
      const exerciseWithRest = exercise.durationSeconds + restTime;
      
      if (currentDuration + exerciseWithRest <= targetDuration) {
        selected.push(exercise);
        currentDuration += exerciseWithRest;
      }
      
      if (selected.length >= 8) break; // Max 8 exercises
    }
    
    return selected;
  };

  const toggleExercise = (exerciseId: string) => {
    setSelectedExercises(prev => 
      prev.filter(exercise => exercise.id !== exerciseId)
    );
  };

  const handleStartWorkout = () => {
    if (selectedExercises.length > 0) {
      // Create workout session
      const session = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        muscleGroups,
        difficulty: difficultyLevel,
        location: workoutLocation,
        totalDuration,
        exercises: selectedExercises.map((exercise, index) => ({
          exerciseId: exercise.id,
          order: index + 1,
          durationSeconds: exercise.durationSeconds,
          restSeconds: restDuration,
          completed: false,
        })),
        completedExercises: [],
        createdAt: new Date().toISOString(),
      };

      router.push({
        pathname: '/workout-timer',
        params: { 
          sessionId: session.id,
          sessionData: JSON.stringify(session)
        }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Workout Plan</Text>
        <Text style={styles.subtitle}>
          Review and customize your exercises
        </Text>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Workout Summary</Text>
          <Text style={styles.summaryText}>
            {selectedExercises.length} exercises • {formatTime(totalDuration)} total
          </Text>
          <Text style={styles.summaryText}>
            {muscleGroups.join(', ')} • {difficultyLevel} • {workoutLocation}
          </Text>
        </View>

        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {selectedExercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseNumber}>{index + 1}</Text>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                </View>
                <Pressable
                  onPress={() => toggleExercise(exercise.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </Pressable>
              </View>
              
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseDetail}>
                  Duration: {formatTime(exercise.durationSeconds)}
                </Text>
                <Text style={styles.exerciseDetail}>
                  Rest: {restDuration}s
                </Text>
                {exercise.sets && (
                  <Text style={styles.exerciseDetail}>
                    Sets: {exercise.sets} • Reps: {exercise.reps}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {selectedExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No exercises selected</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your preferences to get more exercise options
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Pressable
            onPress={handleStartWorkout}
            style={[
              styles.startButton,
              selectedExercises.length === 0 && styles.disabledButton
            ]}
            disabled={selectedExercises.length === 0}
          >
            <Text style={styles.buttonText}>Start Workout</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
  },
  summary: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  exercisesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 12,
    minWidth: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  removeButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    marginLeft: 36,
  },
  exerciseDetail: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
