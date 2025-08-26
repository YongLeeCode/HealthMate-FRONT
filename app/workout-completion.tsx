import { StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { workoutService, userService } from '@/services/api';
import { WorkoutSession } from '@/types/workout';

const DIFFICULTY_RATINGS = [
  { value: 1, label: 'Too Easy', emoji: '😴' },
  { value: 2, label: 'Easy', emoji: '😊' },
  { value: 3, label: 'Just Right', emoji: '👍' },
  { value: 4, label: 'Challenging', emoji: '😰' },
  { value: 5, label: 'Too Hard', emoji: '😵' },
];

export default function WorkoutCompletionScreen() {
  const { sessionId, completedExercises } = useLocalSearchParams<{
    sessionId?: string;
    completedExercises?: string;
  }>();
  
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [difficultyRating, setDifficultyRating] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const router = useRouter();

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    if (!sessionId) return;
    
    try {
      const sessions = await workoutService.getSessions();
      const foundSession = sessions.find(s => s.id === sessionId);
      if (foundSession) {
        setSession(foundSession);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const handleSaveWorkout = async () => {
    if (!session || difficultyRating === null) return;

    setIsSaving(true);
    
    try {
      // Update session with user feedback
      const updatedSession = {
        ...session,
        userDifficultyRating: difficultyRating,
        notes: notes.trim() || undefined,
        completedExercises: completedExercises?.split(',') || [],
      };

      await workoutService.saveSession(updatedSession);
      
      // Mark user as not first time if they haven't been marked yet
      const isFirstTime = await userService.isFirstTime();
      if (isFirstTime) {
        await userService.markNotFirstTime();
      }

      // Navigate to success screen or back to home
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Failed to save workout:', error);
      // Still navigate back even if save fails
      router.push('/(tabs)/home');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    router.push('/(tabs)/home');
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const completedCount = completedExercises?.split(',').length || 0;
  const totalCount = session.exercises.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Workout Complete! 🎉</Text>
          <Text style={styles.subtitle}>
            Great job finishing your workout!
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Exercises Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.round(session.totalDuration / 60)}
            </Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was the difficulty?</Text>
          <Text style={styles.sectionSubtitle}>
            Rate your workout to help us personalize future recommendations
          </Text>
          
          <View style={styles.ratingContainer}>
            {DIFFICULTY_RATINGS.map((rating) => (
              <Pressable
                key={rating.value}
                onPress={() => setDifficultyRating(rating.value)}
                style={[
                  styles.ratingButton,
                  difficultyRating === rating.value && styles.selectedRating
                ]}
              >
                <Text style={styles.ratingEmoji}>{rating.emoji}</Text>
                <Text style={styles.ratingLabel}>{rating.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How did you feel? Any notes about the workout?"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleSaveWorkout}
            style={[
              styles.saveButton,
              (difficultyRating === null || isSaving) && styles.disabledButton
            ]}
            disabled={difficultyRating === null || isSaving}
          >
            <Text style={styles.buttonText}>
              {isSaving ? 'Saving...' : 'Save Workout'}
            </Text>
          </Pressable>
          
          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRating: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  ratingEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 100,
  },
  actions: {
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
