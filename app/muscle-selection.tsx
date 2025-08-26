import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { MuscleGroup } from '@/types/workout';

const MUSCLE_GROUPS: { id: MuscleGroup; name: string; description: string; icon: string }[] = [
  {
    id: 'chest',
    name: 'Chest',
    description: 'Push-ups, chest presses',
    icon: '💪',
  },
  {
    id: 'back',
    name: 'Back',
    description: 'Rows, pull-ups, superman',
    icon: '🏋️',
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    description: 'Pike push-ups, shoulder presses',
    icon: '🏃',
  },
  {
    id: 'arms',
    name: 'Arms',
    description: 'Dips, curls, tricep exercises',
    icon: '💪',
  },
  {
    id: 'legs',
    name: 'Legs',
    description: 'Squats, lunges, calf raises',
    icon: '🦵',
  },
  {
    id: 'core',
    name: 'Core',
    description: 'Planks, crunches, mountain climbers',
    icon: '🎯',
  },
  {
    id: 'full-body',
    name: 'Full Body',
    description: 'Burpees, compound movements',
    icon: '🔥',
  },
];

export default function MuscleSelectionScreen() {
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const router = useRouter();

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    setSelectedMuscles(prev => {
      if (prev.includes(muscleGroup)) {
        return prev.filter(m => m !== muscleGroup);
      } else {
        return [...prev, muscleGroup];
      }
    });
  };

  const handleContinue = () => {
    if (selectedMuscles.length > 0) {
      router.push({
        pathname: '/difficulty-selection',
        params: { muscles: selectedMuscles.join(',') }
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Which muscles would you like to work?</Text>
        <Text style={styles.subtitle}>
          Select the body parts you want to focus on today
        </Text>

        <View style={styles.muscleGrid}>
          {MUSCLE_GROUPS.map((muscle) => (
            <Pressable
              key={muscle.id}
              onPress={() => toggleMuscleGroup(muscle.id)}
              style={[
                styles.muscleCard,
                selectedMuscles.includes(muscle.id) && styles.selectedCard
              ]}
            >
              <Text style={styles.muscleIcon}>{muscle.icon}</Text>
              <Text style={styles.muscleName}>{muscle.name}</Text>
              <Text style={styles.muscleDescription}>{muscle.description}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.selectionText}>
            {selectedMuscles.length} muscle group{selectedMuscles.length !== 1 ? 's' : ''} selected
          </Text>
          
          <Pressable
            onPress={handleContinue}
            style={[
              styles.continueButton,
              selectedMuscles.length === 0 && styles.disabledButton
            ]}
            disabled={selectedMuscles.length === 0}
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
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  muscleCard: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  muscleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  muscleName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  muscleDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
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
