import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { userService, workoutService } from '@/services/api';
import { UserPreferences, WorkoutSession } from '@/types/workout';
import { getTodayRecommendation, formatDuration } from '@/utils/workouts';

export default function HomeScreen() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);
  const router = useRouter();

  const workout = useMemo(() => getTodayRecommendation(), []);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const firstTime = await userService.isFirstTime();
    setIsFirstTime(firstTime);
    
    if (!firstTime) {
      const preferences = await userService.getPreferences();
      setUserPreferences(preferences);
      
      const sessions = await workoutService.getSessions();
      setRecentSessions(sessions.slice(-3)); // Last 3 sessions
    }
  };

  const handleStartNewWorkout = () => {
    if (isFirstTime) {
      // First time user flow
      router.push('/muscle-selection');
    } else {
      // Returning user flow
      router.push('/workout-setup');
    }
  };

  const handleContinueWorkout = (sessionId: string) => {
    router.push({ pathname: '/workout-timer', params: { sessionId } });
  };

  if (isFirstTime === null) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {isFirstTime ? (
          // First time user welcome
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to HealthMate!</Text>
            <Text style={styles.welcomeSubtitle}>
              Let's create your first personalized workout
            </Text>
            <Pressable onPress={handleStartNewWorkout} style={styles.primaryButton}>
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>
          </View>
        ) : (
          // Returning user dashboard
          <View style={styles.dashboardSection}>
            <Text style={styles.sectionTitle}>Today's Recommendation</Text>
            <View style={styles.recommendationCard}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDescription}>{workout.description}</Text>
              <Text style={styles.workoutMeta}>
                Duration: {formatDuration(workout.durationSeconds)} · Intensity: {workout.intensity}
              </Text>
              <Pressable onPress={handleStartNewWorkout} style={styles.primaryButton}>
                <Text style={styles.buttonText}>Start Workout</Text>
              </Pressable>
            </View>

            {recentSessions.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={styles.sectionTitle}>Recent Workouts</Text>
                {recentSessions.map((session) => (
                  <Pressable
                    key={session.id}
                    onPress={() => handleContinueWorkout(session.id)}
                    style={styles.recentCard}
                  >
                    <Text style={styles.recentDate}>
                      {new Date(session.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.recentMuscles}>
                      {session.muscleGroups.join(', ')}
                    </Text>
                    <Text style={styles.recentDuration}>
                      {formatDuration(session.totalDuration)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.quickActions}>
              <Pressable onPress={() => router.push('/workout-history')} style={styles.secondaryButton}>
                <Text style={styles.buttonText}>View History</Text>
              </Pressable>
              <Pressable onPress={() => router.push('/settings')} style={styles.secondaryButton}>
                <Text style={styles.buttonText}>Settings</Text>
              </Pressable>
            </View>
          </View>
        )}
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
  welcomeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  dashboardSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  workoutMeta: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 16,
  },
  recentSection: {
    marginBottom: 24,
  },
  recentCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentDate: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recentMuscles: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
  },
  recentDuration: {
    fontSize: 12,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


