import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';

const DURATION_PRESETS = [
  { name: 'Quick', duration: 15, restTime: 30 },
  { name: 'Standard', duration: 30, restTime: 45 },
  { name: 'Extended', duration: 45, restTime: 60 },
  { name: 'Intensive', duration: 60, restTime: 30 },
];

export default function DurationConfigScreen() {
  const [selectedPreset, setSelectedPreset] = useState<number>(1); // Default to Standard
  const [customDuration, setCustomDuration] = useState<number>(30);
  const [customRestTime, setCustomRestTime] = useState<number>(45);
  const [useCustom, setUseCustom] = useState<boolean>(false);
  
  const router = useRouter();
  const { muscles, difficulty } = useLocalSearchParams<{ 
    muscles?: string; 
    difficulty?: string 
  }>();

  const handlePresetSelect = (index: number) => {
    setSelectedPreset(index);
    setUseCustom(false);
    setCustomDuration(DURATION_PRESETS[index].duration);
    setCustomRestTime(DURATION_PRESETS[index].restTime);
  };

  const handleCustomToggle = () => {
    setUseCustom(!useCustom);
  };

  const handleDurationChange = (increment: boolean) => {
    const newDuration = increment ? customDuration + 5 : customDuration - 5;
    if (newDuration >= 10 && newDuration <= 120) {
      setCustomDuration(newDuration);
    }
  };

  const handleRestTimeChange = (increment: boolean) => {
    const newRestTime = increment ? customRestTime + 15 : customRestTime - 15;
    if (newRestTime >= 15 && newRestTime <= 120) {
      setCustomRestTime(newRestTime);
    }
  };

  const handleContinue = () => {
    const duration = useCustom ? customDuration : DURATION_PRESETS[selectedPreset].duration;
    const restTime = useCustom ? customRestTime : DURATION_PRESETS[selectedPreset].restTime;
    
    if (muscles && difficulty) {
      router.push({
        pathname: '/location-selection',
        params: { 
          muscles,
          difficulty,
          duration: duration.toString(),
          restTime: restTime.toString()
        }
      });
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Configure your workout</Text>
        <Text style={styles.subtitle}>
          Choose how long you want to work out and rest between exercises
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Presets</Text>
          <View style={styles.presetGrid}>
            {DURATION_PRESETS.map((preset, index) => (
              <Pressable
                key={index}
                onPress={() => handlePresetSelect(index)}
                style={[
                  styles.presetCard,
                  selectedPreset === index && !useCustom && styles.selectedCard
                ]}
              >
                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetDuration}>{formatTime(preset.duration)}</Text>
                <Text style={styles.presetRest}>{preset.restTime}s rest</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Pressable onPress={handleCustomToggle} style={styles.customToggle}>
            <Text style={styles.sectionTitle}>Custom Settings</Text>
            <Text style={styles.toggleText}>{useCustom ? '✓' : '○'}</Text>
          </Pressable>
          
          {useCustom && (
            <View style={styles.customControls}>
              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>Workout Duration</Text>
                <View style={styles.controlRow}>
                  <Pressable 
                    onPress={() => handleDurationChange(false)}
                    style={styles.controlButton}
                  >
                    <Text style={styles.controlButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.controlValue}>{formatTime(customDuration)}</Text>
                  <Pressable 
                    onPress={() => handleDurationChange(true)}
                    style={styles.controlButton}
                  >
                    <Text style={styles.controlButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>Rest Time</Text>
                <View style={styles.controlRow}>
                  <Pressable 
                    onPress={() => handleRestTimeChange(false)}
                    style={styles.controlButton}
                  >
                    <Text style={styles.controlButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.controlValue}>{customRestTime}s</Text>
                  <Pressable 
                    onPress={() => handleRestTimeChange(true)}
                    style={styles.controlButton}
                  >
                    <Text style={styles.controlButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Your Workout Summary</Text>
          <Text style={styles.summaryText}>
            Duration: {formatTime(useCustom ? customDuration : DURATION_PRESETS[selectedPreset].duration)}
          </Text>
          <Text style={styles.summaryText}>
            Rest: {useCustom ? customRestTime : DURATION_PRESETS[selectedPreset].restTime} seconds
          </Text>
        </View>

        <View style={styles.footer}>
          <Pressable onPress={handleContinue} style={styles.continueButton}>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetCard: {
    width: '48%',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  presetName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  presetDuration: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  presetRest: {
    fontSize: 12,
    opacity: 0.7,
  },
  customToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleText: {
    fontSize: 20,
    color: '#007AFF',
  },
  customControls: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  controlGroup: {
    marginBottom: 20,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 60,
    textAlign: 'center',
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
