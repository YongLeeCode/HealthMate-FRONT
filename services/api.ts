import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  WorkoutSession, 
  UserPreferences, 
  WorkoutRecommendation,
  MuscleGroup,
  DifficultyLevel,
  WorkoutLocation 
} from '@/types/workout';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// Local storage keys
const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  WORKOUT_SESSIONS: 'workout_sessions',
  USER_ID: 'user_id',
  IS_FIRST_TIME: 'is_first_time',
} as const;

// API endpoints
const ENDPOINTS = {
  WORKOUTS: '/workouts',
  SESSIONS: '/sessions',
  USERS: '/users',
  RECOMMENDATIONS: '/recommendations',
} as const;

// Local storage utilities
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
};

// API utilities
const api = {
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  },

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  },
};

// Workout session management
export const workoutService = {
  // Save workout session locally and to backend
  async saveSession(session: WorkoutSession): Promise<void> {
    // Save locally first
    const sessions = await this.getSessions();
    sessions.push(session);
    await storage.set(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);

    // Try to save to backend if user is logged in
    if (session.userId) {
      try {
        await api.post(ENDPOINTS.SESSIONS, session);
      } catch (error) {
        console.warn('Failed to save session to backend:', error);
      }
    }
  },

  // Get all workout sessions
  async getSessions(): Promise<WorkoutSession[]> {
    const sessions = await storage.get<WorkoutSession[]>(STORAGE_KEYS.WORKOUT_SESSIONS);
    return sessions || [];
  },

  // Get sessions for a specific user
  async getUserSessions(userId: string): Promise<WorkoutSession[]> {
    try {
      const sessions = await api.get<WorkoutSession[]>(`${ENDPOINTS.SESSIONS}?userId=${userId}`);
      return sessions;
    } catch (error) {
      console.warn('Failed to fetch user sessions from backend:', error);
      // Fallback to local storage
      const localSessions = await this.getSessions();
      return localSessions.filter(session => session.userId === userId);
    }
  },

  // Update session (e.g., mark exercises as completed)
  async updateSession(sessionId: string, updates: Partial<WorkoutSession>): Promise<void> {
    const sessions = await this.getSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      await storage.set(STORAGE_KEYS.WORKOUT_SESSIONS, sessions);
    }
  },
};

// User preferences management
export const userService = {
  // Save user preferences
  async savePreferences(preferences: UserPreferences): Promise<void> {
    await storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences);
    
    if (preferences.userId) {
      try {
        await api.put(`${ENDPOINTS.USERS}/${preferences.userId}/preferences`, preferences);
      } catch (error) {
        console.warn('Failed to save preferences to backend:', error);
      }
    }
  },

  // Get user preferences
  async getPreferences(): Promise<UserPreferences | null> {
    return await storage.get<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES);
  },

  // Check if user is first time
  async isFirstTime(): Promise<boolean> {
    const isFirst = await storage.get<boolean>(STORAGE_KEYS.IS_FIRST_TIME);
    return isFirst === null;
  },

  // Mark user as not first time
  async markNotFirstTime(): Promise<void> {
    await storage.set(STORAGE_KEYS.IS_FIRST_TIME, false);
  },

  // Get user ID
  async getUserId(): Promise<string | null> {
    return await storage.get<string>(STORAGE_KEYS.USER_ID);
  },

  // Set user ID
  async setUserId(userId: string): Promise<void> {
    await storage.set(STORAGE_KEYS.USER_ID, userId);
  },
};

// Workout recommendation service
export const recommendationService = {
  // Get workout recommendations for user
  async getRecommendations(
    muscleGroups: MuscleGroup[],
    difficulty: DifficultyLevel,
    location: WorkoutLocation
  ): Promise<WorkoutRecommendation[]> {
    try {
      const recommendations = await api.post<WorkoutRecommendation[]>(
        ENDPOINTS.RECOMMENDATIONS,
        { muscleGroups, difficulty, location }
      );
      return recommendations;
    } catch (error) {
      console.warn('Failed to get recommendations from backend:', error);
      // Return mock recommendations for now
      return this.getMockRecommendations(muscleGroups, difficulty);
    }
  },

  // Mock recommendations for offline use
  getMockRecommendations(
    muscleGroups: MuscleGroup[],
    difficulty: DifficultyLevel
  ): WorkoutRecommendation[] {
    // This would be replaced with actual recommendation logic
    return [{
      muscleGroups,
      difficulty,
      estimatedDuration: 30 * 60, // 30 minutes
      exercises: [],
      reason: 'Based on your preferences and workout history',
    }];
  },
};

// Export everything
export { api, STORAGE_KEYS, ENDPOINTS };
