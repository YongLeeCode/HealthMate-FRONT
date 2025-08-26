import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { getExerciseById } from '@/data/exercises';
import { WorkoutSession, WorkoutExercise } from '@/types/workout';
import { workoutService } from '@/services/api';

type TimerState = 'exercise' | 'rest' | 'completed';

export default function WorkoutTimerScreen() {
  const { sessionId, sessionData } = useLocalSearchParams<{ 
    sessionId?: string; 
    sessionData?: string 
  }>();
  
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerState>('exercise');
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  const intervalRef = useRef<number | null>(null);
  const router = useRouter();

  // Parse session data
  useEffect(() => {
    if (sessionData) {
      try {
        const parsedSession = JSON.parse(sessionData) as WorkoutSession;
        setSession(parsedSession);
        setRemainingTime(parsedSession.exercises[0]?.durationSeconds || 0);
      } catch (error) {
        console.error('Failed to parse session data:', error);
      }
    }
  }, [sessionData]);

  const currentExercise = useMemo(() => {
    if (!session || currentExerciseIndex >= session.exercises.length) return null;
    const workoutExercise = session.exercises[currentExerciseIndex];
    return getExerciseById(workoutExercise.exerciseId);
  }, [session, currentExerciseIndex]);

  const workoutExercise = useMemo(() => {
    if (!session || currentExerciseIndex >= session.exercises.length) return null;
    return session.exercises[currentExerciseIndex];
  }, [session, currentExerciseIndex]);

  const progress = useMemo(() => {
    if (!session) return 0;
    return (currentExerciseIndex / session.exercises.length) * 100;
  }, [session, currentExerciseIndex]);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          // Timer finished
          if (timerState === 'exercise') {
            // Move to rest period
            if (workoutExercise) {
              setTimerState('rest');
              return workoutExercise.restSeconds;
            }
          } else if (timerState === 'rest') {
            // Move to next exercise
            moveToNextExercise();
            return 0;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timerState, workoutExercise]);

  const moveToNextExercise = () => {
    if (!session) return;

    const nextIndex = currentExerciseIndex + 1;
    if (nextIndex < session.exercises.length) {
      setCurrentExerciseIndex(nextIndex);
      setTimerState('exercise');
      setRemainingTime(session.exercises[nextIndex].durationSeconds);
    } else {
      // Workout completed
      setTimerState('completed');
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleSkipExercise = () => {
    if (!currentExercise) return;

    Alert.alert(
      'Skip Exercise',
      `Are you sure you want to skip ${currentExercise.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          style: 'destructive',
          onPress: () => {
            moveToNextExercise();
          }
        }
      ]
    );
  };

  const handleCompleteExercise = () => {
    if (!currentExercise) return;
    
    setCompletedExercises(prev => [...prev, currentExercise.id]);
    moveToNextExercise();
  };

  const handleFinishWorkout = () => {
    if (!session) return;

    // Save completed session
    const updatedSession = {
      ...session,
      completedExercises,
      totalDuration: session.totalDuration - remainingTime,
    };

    workoutService.saveSession(updatedSession);
    
    // Navigate to completion screen
    router.push({
      pathname: '/workout-completion',
      params: { 
        sessionId: session.id,
        completedExercises: completedExercises.join(',')
      }
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session || !currentExercise || !workoutExercise) {
    return (
      <View style={styles.container}>
        <Text>Loading workout...</Text>
      </View>
    );
  }

  if (timerState === 'completed') {
    return (
      <View style={styles.container}>
        <View style={styles.completedContainer}>
          <Text style={styles.completedTitle}>Workout Complete! 🎉</Text>
          <Text style={styles.completedSubtitle}>
            Great job! You've finished your workout.
          </Text>
          <Pressable onPress={handleFinishWorkout} style={styles.finishButton}>
            <Text style={styles.buttonText}>Finish & Save</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          Exercise {currentExerciseIndex + 1} of {session.exercises.length}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.phaseText}>
          {timerState === 'exercise' ? 'Exercise' : 'Rest'}
        </Text>
        <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
        <Text style={styles.exerciseDescription}>{currentExercise.description}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={handleStartPause} style={styles.controlButton}>
          <Text style={styles.controlButtonText}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </Pressable>
        
        <Pressable onPress={handleSkipExercise} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </Pressable>
        
        <Pressable onPress={handleCompleteExercise} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Complete</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.exercisesList}>
        <Text style={styles.exercisesTitle}>Upcoming Exercises</Text>
        {session.exercises.slice(currentExerciseIndex + 1).map((exercise, index) => {
          const exerciseData = getExerciseById(exercise.exerciseId);
          if (!exerciseData) return null;
          
          return (
            <View key={exercise.exerciseId} style={styles.upcomingExercise}>
              <Text style={styles.upcomingNumber}>
                {currentExerciseIndex + index + 2}
              </Text>
              <Text style={styles.upcomingName}>{exerciseData.name}</Text>
              <Text style={styles.upcomingDuration}>
                {formatTime(exercise.durationSeconds)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  progressText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  phaseText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  controlButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FF9500',
    fontWeight: 'bold',
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#34C759',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exercisesList: {
    flex: 1,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  upcomingExercise: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  upcomingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 16,
    minWidth: 24,
  },
  upcomingName: {
    fontSize: 16,
    flex: 1,
  },
  upcomingDuration: {
    fontSize: 14,
    opacity: 0.7,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  completedTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  completedSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 32,
  },
  finishButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
