import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { DifficultyLevel } from '@/types/workout';

const DIFFICULTY_LEVELS: {
  id: DifficultyLevel;
  name: string;
  description: string;
  icon: string;
  details: string[];
}[] = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Perfect for getting started',
    icon: '🌱',
    details: [
      'Basic exercises with proper form',
      'Longer rest periods',
      'Fewer repetitions',
      'Focus on building foundation'
    ],
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'For those with some experience',
    icon: '💪',
    details: [
      'More challenging variations',
      'Moderate rest periods',
      'Increased repetitions',
      'Better strength building'
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'For experienced fitness enthusiasts',
    icon: '🔥',
    details: [
      'Complex compound movements',
      'Shorter rest periods',
      'High intensity intervals',
      'Maximum challenge'
    ],
  },
];

export default function DifficultySelectionScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const router = useRouter();
  const { muscles } = useLocalSearchParams<{ muscles?: string }>();

  const handleContinue = () => {
    if (selectedDifficulty && muscles) {
      router.push({
        pathname: '/duration-config',
        params: { 
          muscles,
          difficulty: selectedDifficulty
        }
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose your difficulty level</Text>
        <Text style={styles.subtitle}>
          Select the intensity that matches your fitness level
        </Text>

        <View style={styles.difficultyContainer}>
          {DIFFICULTY_LEVELS.map((level) => (
            <Pressable
              key={level.id}
              onPress={() => setSelectedDifficulty(level.id)}
              style={[
                styles.difficultyCard,
                selectedDifficulty === level.id && styles.selectedCard
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.levelIcon}>{level.icon}</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelName}>{level.name}</Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                </View>
              </View>
              
              <View style={styles.detailsList}>
                {level.details.map((detail, index) => (
                  <Text key={index} style={styles.detailItem}>
                    • {detail}
                  </Text>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={handleContinue}
            style={[
              styles.continueButton,
              !selectedDifficulty && styles.disabledButton
            ]}
            disabled={!selectedDifficulty}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
  difficultyContainer: {
    marginBottom: 32,
  },
  difficultyCard: {
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
  levelIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
  detailsList: {
    marginLeft: 48,
  },
  detailItem: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
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
