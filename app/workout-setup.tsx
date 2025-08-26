import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { userService, workoutService, recommendationService } from '@/services/api';
import { UserPreferences, WorkoutRecommendation, MuscleGroup, DifficultyLevel, WorkoutLocation } from '@/types/workout';

export default function WorkoutSetupScreen() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<WorkoutRecommendation[]>([]);
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('intermediate');
  const [selectedLocation, setSelectedLocation] = useState<WorkoutLocation>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const preferences = await userService.getPreferences();
      setUserPreferences(preferences);
      
      if (preferences) {
        setSelectedMuscles(preferences.preferredMuscleGroups || ['full-body']);
        setSelectedDifficulty(preferences.preferredDifficulty);
        setSelectedLocation(preferences.preferredLocation);
      }
      
      // Load recommendations
      const recs = await recommendationService.getRecommendations(
        selectedMuscles,
        selectedDifficulty,
        selectedLocation
      );
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRecommended = () => {
    if (recommendations.length > 0) {
      const recommendation = recommendations[0];
      router.push({
        pathname: '/workout-curriculum',
        params: {
          muscles: recommendation.muscleGroups.join(','),
          difficulty: recommendation.difficulty,
          duration: '30',
          restTime: userPreferences?.defaultRestTime?.toString() || '45',
          location: selectedLocation
        }
      });
    }
  };

  const handleCustomWorkout = () => {
    router.push('/muscle-selection');
  };

  const handleQuickStart = () => {
    // Start with last used settings or defaults
    const muscles = selectedMuscles.length > 0 ? selectedMuscles : ['full-body'];
    const difficulty = selectedDifficulty;
    const location = selectedLocation;
    
    router.push({
      pathname: '/workout-curriculum',
      params: {
        muscles: muscles.join(','),
        difficulty,
        duration: '20',
        restTime: '30',
        location
      }
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading your preferences...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ready for your workout?</Text>
        <Text style={styles.subtitle}>
          Choose how you'd like to get started today
        </Text>

        {recommendations.length > 0 && (
          <View style={styles.recommendationSection}>
            <Text style={styles.sectionTitle}>Today's Recommendation</Text>
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>
                {recommendations[0].muscleGroups.join(', ')} Workout
              </Text>
              <Text style={styles.recommendationDescription}>
                {recommendations[0].reason}
              </Text>
              <Text style={styles.recommendationMeta}>
                {Math.round(recommendations[0].estimatedDuration / 60)} min • {recommendations[0].difficulty}
              </Text>
              <Pressable onPress={handleStartRecommended} style={styles.primaryButton}>
                <Text style={styles.buttonText}>Start Recommended</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Quick Options</Text>
          
          <Pressable onPress={handleQuickStart} style={styles.optionCard}>
            <Text style={styles.optionIcon}>⚡</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Quick Start</Text>
              <Text style={styles.optionDescription}>
                20-minute workout with your preferred settings
              </Text>
            </View>
          </Pressable>

          <Pressable onPress={handleCustomWorkout} style={styles.optionCard}>
            <Text style={styles.optionIcon}>🎯</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Custom Workout</Text>
              <Text style={styles.optionDescription}>
                Choose muscles, difficulty, and duration
              </Text>
            </View>
          </Pressable>
        </View>

        {userPreferences && (
          <View style={styles.preferencesSection}>
            <Text style={styles.sectionTitle}>Your Preferences</Text>
            <View style={styles.preferencesCard}>
              <Text style={styles.preferenceItem}>
                Preferred Difficulty: {userPreferences.preferredDifficulty}
              </Text>
              <Text style={styles.preferenceItem}>
                Default Rest Time: {userPreferences.defaultRestTime}s
              </Text>
              <Text style={styles.preferenceItem}>
                Preferred Location: {userPreferences.preferredLocation}
              </Text>
              <Text style={styles.preferenceItem}>
                Workouts Completed: {userPreferences.workoutHistory.length}
              </Text>
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
    marginBottom: 32,
  },
  recommendationSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  recommendationDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  recommendationMeta: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  optionsSection: {
    marginBottom: 32,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  preferencesSection: {
    marginBottom: 32,
  },
  preferencesCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  preferenceItem: {
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
