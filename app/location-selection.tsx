import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { WorkoutLocation } from '@/types/workout';

const LOCATIONS: {
  id: WorkoutLocation;
  name: string;
  description: string;
  icon: string;
  benefits: string[];
}[] = [
  {
    id: 'home',
    name: 'Home',
    description: 'Workout in your living space',
    icon: '🏠',
    benefits: [
      'No commute time',
      'Privacy and comfort',
      'No equipment needed',
      'Flexible schedule'
    ],
  },
  {
    id: 'gym',
    name: 'Gym',
    description: 'Access to full equipment',
    icon: '🏋️',
    benefits: [
      'Full range of equipment',
      'Motivating environment',
      'Professional guidance',
      'Social workout atmosphere'
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    description: 'Fresh air and nature',
    icon: '🌳',
    benefits: [
      'Fresh air and vitamin D',
      'Natural terrain challenges',
      'Scenic workout environment',
      'No space limitations'
    ],
  },
  {
    id: 'office',
    name: 'Office',
    description: 'Quick workout at work',
    icon: '💼',
    benefits: [
      'Convenient during work hours',
      'No travel time',
      'Quick energy boost',
      'Stress relief'
    ],
  },
];

export default function LocationSelectionScreen() {
  const [selectedLocation, setSelectedLocation] = useState<WorkoutLocation | null>(null);
  const router = useRouter();
  const { muscles, difficulty, duration, restTime } = useLocalSearchParams<{
    muscles?: string;
    difficulty?: string;
    duration?: string;
    restTime?: string;
  }>();

  const handleContinue = () => {
    if (selectedLocation && muscles && difficulty && duration && restTime) {
      router.push({
        pathname: '/workout-curriculum',
        params: {
          muscles,
          difficulty,
          duration,
          restTime,
          location: selectedLocation
        }
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Where will you work out?</Text>
        <Text style={styles.subtitle}>
          Choose your workout environment to get personalized exercises
        </Text>

        <View style={styles.locationContainer}>
          {LOCATIONS.map((location) => (
            <Pressable
              key={location.id}
              onPress={() => setSelectedLocation(location.id)}
              style={[
                styles.locationCard,
                selectedLocation === location.id && styles.selectedCard
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.locationIcon}>{location.icon}</Text>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationDescription}>{location.description}</Text>
                </View>
              </View>
              
              <View style={styles.benefitsList}>
                {location.benefits.map((benefit, index) => (
                  <Text key={index} style={styles.benefitItem}>
                    ✓ {benefit}
                  </Text>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        {selectedLocation && (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Workout Summary</Text>
            <Text style={styles.summaryText}>
              Muscles: {muscles?.split(',').join(', ')}
            </Text>
            <Text style={styles.summaryText}>
              Difficulty: {difficulty}
            </Text>
            <Text style={styles.summaryText}>
              Duration: {duration} minutes
            </Text>
            <Text style={styles.summaryText}>
              Rest: {restTime} seconds
            </Text>
            <Text style={styles.summaryText}>
              Location: {LOCATIONS.find(l => l.id === selectedLocation)?.name}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Pressable
            onPress={handleContinue}
            style={[
              styles.continueButton,
              !selectedLocation && styles.disabledButton
            ]}
            disabled={!selectedLocation}
          >
            <Text style={styles.buttonText}>Create Workout</Text>
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
    marginBottom: 32,
  },
  locationContainer: {
    marginBottom: 32,
  },
  locationCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  benefitsList: {
    marginLeft: 48,
  },
  benefitItem: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  summary: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  footer: {
    alignItems: 'center',
  },
  continueButton: {
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
