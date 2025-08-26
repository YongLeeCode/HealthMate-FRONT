import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { Text, View } from '@/components/Themed';
import { getWorkoutById, formatDuration } from '@/utils/workouts';

export default function TimerScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const workout = useMemo(() => (id ? getWorkoutById(String(id)) : undefined), [id]);

  const defaultSeconds = workout?.durationSeconds ?? 10 * 60;
  const [remaining, setRemaining] = useState<number>(defaultSeconds);
  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
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
  }, [running]);

  const onStartPause = () => setRunning(r => !r);
  const onReset = () => {
    setRunning(false);
    setRemaining(defaultSeconds);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>{workout ? workout.name : 'Custom Timer'}</Text>
      <Text style={styles.timer}>{formatDuration(remaining)}</Text>
      <Text style={styles.meta}>{workout ? `Intensity: ${workout.intensity}` : ''}</Text>

      <View style={styles.row}>
        <Pressable onPress={onStartPause} style={styles.button}>
          <Text style={styles.buttonText}>{running ? 'Pause' : 'Start'}</Text>
        </Pressable>
        <Pressable onPress={onReset} style={styles.buttonSecondary}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>

      <Pressable onPress={() => router.back()} style={styles.linkBack}>
        <Text style={styles.linkBackText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  kicker: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 8,
  },
  timer: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  meta: {
    marginTop: 8,
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    opacity: 0.9,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  linkBack: {
    marginTop: 24,
  },
  linkBackText: {
    textDecorationLine: 'underline',
  },
});
