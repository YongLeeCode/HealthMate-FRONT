export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'arms' 
  | 'legs' 
  | 'core' 
  | 'full-body';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutLocation = 'home' | 'gym' | 'outdoor' | 'office';

export type Exercise = {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  difficulty: DifficultyLevel;
  description: string;
  instructions: string[];
  durationSeconds: number;
  restSeconds: number;
  sets?: number;
  reps?: number;
  equipment?: string[];
  imageUrl?: string;
};

export type WorkoutSession = {
  id: string;
  userId?: string;
  date: string;
  muscleGroups: MuscleGroup[];
  difficulty: DifficultyLevel;
  location: WorkoutLocation;
  totalDuration: number;
  exercises: WorkoutExercise[];
  completedExercises: string[];
  userDifficultyRating?: number; // 1-5
  notes?: string;
  createdAt: string;
};

export type WorkoutExercise = {
  exerciseId: string;
  order: number;
  durationSeconds: number;
  restSeconds: number;
  sets?: number;
  reps?: number;
  completed: boolean;
};

export type UserPreferences = {
  userId: string;
  defaultRestTime: number;
  preferredDifficulty: DifficultyLevel;
  preferredLocation: WorkoutLocation;
  preferredMuscleGroups?: MuscleGroup[];
  workoutHistory: string[]; // WorkoutSession IDs
  createdAt: string;
  updatedAt: string;
};

export type WorkoutRecommendation = {
  muscleGroups: MuscleGroup[];
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  exercises: Exercise[];
  reason: string;
};
