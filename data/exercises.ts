import { Exercise, MuscleGroup, DifficultyLevel } from '@/types/workout';

export const EXERCISES: Exercise[] = [
  // Chest exercises
  {
    id: 'push-ups',
    name: 'Push-ups',
    muscleGroups: ['chest', 'arms'],
    difficulty: 'beginner',
    description: 'Classic bodyweight exercise for chest and triceps',
    instructions: [
      'Start in a plank position with hands shoulder-width apart',
      'Lower your body until chest nearly touches the ground',
      'Push back up to starting position',
      'Keep your body in a straight line throughout'
    ],
    durationSeconds: 60,
    restSeconds: 30,
    sets: 3,
    reps: 10,
    equipment: [],
  },
  {
    id: 'diamond-push-ups',
    name: 'Diamond Push-ups',
    muscleGroups: ['chest', 'arms'],
    difficulty: 'intermediate',
    description: 'Advanced push-up variation targeting triceps',
    instructions: [
      'Form a diamond shape with your hands under your chest',
      'Lower your body while keeping elbows close to body',
      'Push back up to starting position'
    ],
    durationSeconds: 45,
    restSeconds: 45,
    sets: 3,
    reps: 8,
    equipment: [],
  },
  
  // Back exercises
  {
    id: 'superman',
    name: 'Superman',
    muscleGroups: ['back'],
    difficulty: 'beginner',
    description: 'Isometric exercise for lower back strength',
    instructions: [
      'Lie face down on the floor',
      'Lift your arms and legs off the ground',
      'Hold for 3-5 seconds',
      'Lower back down and repeat'
    ],
    durationSeconds: 60,
    restSeconds: 30,
    sets: 3,
    reps: 12,
    equipment: [],
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    muscleGroups: ['back', 'arms'],
    difficulty: 'advanced',
    description: 'Upper body pulling exercise',
    instructions: [
      'Hang from a pull-up bar with hands shoulder-width apart',
      'Pull your body up until chin is over the bar',
      'Lower back down with control'
    ],
    durationSeconds: 60,
    restSeconds: 60,
    sets: 3,
    reps: 5,
    equipment: ['pull-up bar'],
  },
  
  // Shoulder exercises
  {
    id: 'pike-push-ups',
    name: 'Pike Push-ups',
    muscleGroups: ['shoulders', 'arms'],
    difficulty: 'intermediate',
    description: 'Bodyweight shoulder press variation',
    instructions: [
      'Start in a downward dog position',
      'Lower your head toward the ground',
      'Push back up to starting position'
    ],
    durationSeconds: 45,
    restSeconds: 45,
    sets: 3,
    reps: 8,
    equipment: [],
  },
  
  // Arm exercises
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    muscleGroups: ['arms'],
    difficulty: 'beginner',
    description: 'Bodyweight exercise for triceps',
    instructions: [
      'Sit on the edge of a chair or bench',
      'Place hands on the edge beside your hips',
      'Slide off and lower your body',
      'Push back up using your triceps'
    ],
    durationSeconds: 60,
    restSeconds: 45,
    sets: 3,
    reps: 12,
    equipment: ['chair', 'bench'],
  },
  
  // Leg exercises
  {
    id: 'squats',
    name: 'Bodyweight Squats',
    muscleGroups: ['legs'],
    difficulty: 'beginner',
    description: 'Fundamental lower body exercise',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower your body as if sitting back into a chair',
      'Keep your chest up and knees behind toes',
      'Return to standing position'
    ],
    durationSeconds: 60,
    restSeconds: 30,
    sets: 3,
    reps: 15,
    equipment: [],
  },
  {
    id: 'lunges',
    name: 'Walking Lunges',
    muscleGroups: ['legs'],
    difficulty: 'intermediate',
    description: 'Dynamic leg exercise for balance and strength',
    instructions: [
      'Step forward with one leg',
      'Lower your body until both knees are bent',
      'Push back up and step forward with the other leg',
      'Continue alternating legs'
    ],
    durationSeconds: 60,
    restSeconds: 45,
    sets: 3,
    reps: 10,
    equipment: [],
  },
  
  // Core exercises
  {
    id: 'plank',
    name: 'Plank',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    description: 'Isometric core exercise',
    instructions: [
      'Hold a push-up position with arms straight',
      'Keep your body in a straight line',
      'Engage your core muscles',
      'Hold for the specified time'
    ],
    durationSeconds: 45,
    restSeconds: 30,
    sets: 3,
    reps: 1,
    equipment: [],
  },
  {
    id: 'crunches',
    name: 'Crunches',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    description: 'Basic abdominal exercise',
    instructions: [
      'Lie on your back with knees bent',
      'Place hands behind your head',
      'Lift your shoulders off the ground',
      'Lower back down with control'
    ],
    durationSeconds: 60,
    restSeconds: 30,
    sets: 3,
    reps: 15,
    equipment: [],
  },
  
  // Full body exercises
  {
    id: 'burpees',
    name: 'Burpees',
    muscleGroups: ['full-body'],
    difficulty: 'advanced',
    description: 'High-intensity full body exercise',
    instructions: [
      'Start standing, then squat down',
      'Place hands on ground and jump feet back',
      'Do a push-up',
      'Jump feet back to squat position',
      'Jump up with arms overhead'
    ],
    durationSeconds: 60,
    restSeconds: 60,
    sets: 3,
    reps: 8,
    equipment: [],
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    muscleGroups: ['full-body', 'core'],
    difficulty: 'intermediate',
    description: 'Dynamic cardio exercise',
    instructions: [
      'Start in a plank position',
      'Alternately bring knees toward chest',
      'Keep your core engaged throughout'
    ],
    durationSeconds: 45,
    restSeconds: 30,
    sets: 3,
    reps: 20,
    equipment: [],
  },
];

export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  return EXERCISES.filter(exercise => 
    exercise.muscleGroups.includes(muscleGroup)
  );
}

export function getExercisesByDifficulty(difficulty: DifficultyLevel): Exercise[] {
  return EXERCISES.filter(exercise => exercise.difficulty === difficulty);
}

export function getExerciseById(id: string): Exercise | undefined {
  return EXERCISES.find(exercise => exercise.id === id);
}
