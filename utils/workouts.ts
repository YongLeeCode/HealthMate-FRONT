export type Workout = {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  intensity: 'low' | 'medium' | 'high';
};

const WORKOUTS: Workout[] = [
  {
    id: 'full-body-quick',
    name: 'Full Body Quick',
    description: 'A quick full-body circuit to get your heart rate up.',
    durationSeconds: 10 * 60,
    intensity: 'medium',
  },
  {
    id: 'yoga-stretch',
    name: 'Yoga Stretch',
    description: 'Gentle yoga flow focused on mobility and breath.',
    durationSeconds: 15 * 60,
    intensity: 'low',
  },
  {
    id: 'hiit-burn',
    name: 'HIIT Burn',
    description: 'High-intensity intervals for a powerful calorie burn.',
    durationSeconds: 12 * 60,
    intensity: 'high',
  },
  {
    id: 'core-focus',
    name: 'Core Focus',
    description: 'Targeted core routine for strength and stability.',
    durationSeconds: 8 * 60,
    intensity: 'medium',
  },
  {
    id: 'walk-refresh',
    name: 'Walk & Refresh',
    description: 'Light-paced indoor walk with light mobility.',
    durationSeconds: 10 * 60,
    intensity: 'low',
  },
];

function getDayOfWeekIndex(date: Date): number {
  return date.getDay(); // 0..6 (Sun..Sat)
}

export function getTodayRecommendation(now: Date = new Date()): Workout {
  const dayIndex = getDayOfWeekIndex(now);
  // Simple rotation logic by weekday + time-based tweak
  const base = WORKOUTS[dayIndex % WORKOUTS.length];

  // If evening, suggest slightly lower intensity for wind-down
  const hour = now.getHours();
  if (hour >= 19 && base.intensity === 'high') {
    const alt = WORKOUTS.find(w => w.intensity !== 'high');
    return alt ?? base;
  }
  return base;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function listWorkouts(): Workout[] {
  return WORKOUTS.slice();
}

export function getWorkoutById(id: string): Workout | undefined {
  return WORKOUTS.find(w => w.id === id);
}


