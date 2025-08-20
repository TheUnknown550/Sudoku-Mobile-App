import AsyncStorage from '@react-native-async-storage/async-storage';
import { Difficulty, SudokuGrid } from './sudokuLogic';

export interface GameRecord {
  id: string;
  difficulty: Difficulty;
  timeStarted: number;
  timeCompleted?: number;
  duration?: number; // in seconds
  completed: boolean;
  failed?: boolean; // true if game ended due to 3 wrong moves
  moves: number;
}

export interface SavedGame {
  id: string;
  difficulty: Difficulty;
  currentGrid: SudokuGrid;
  originalGrid: SudokuGrid;
  timeStarted: number;
  timeElapsed: number; // in seconds
  moves: number;
  lastPlayed: number;
}

const STORAGE_KEYS = {
  CURRENT_GAME: 'sudoku_current_game',
  GAME_RECORDS: 'sudoku_game_records',
  SETTINGS: 'sudoku_settings',
};

// Current Game Management
export async function saveCurrentGame(game: SavedGame): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(game));
  } catch (error) {
    console.error('Error saving current game:', error);
  }
}

export async function loadCurrentGame(): Promise<SavedGame | null> {
  try {
    const gameData = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    return gameData ? JSON.parse(gameData) : null;
  } catch (error) {
    console.error('Error loading current game:', error);
    return null;
  }
}

export async function clearCurrentGame(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_GAME);
  } catch (error) {
    console.error('Error clearing current game:', error);
  }
}

// Game Records Management
export async function saveGameRecord(record: GameRecord): Promise<void> {
  try {
    const records = await loadGameRecords();
    records.push(record);
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving game record:', error);
  }
}

export async function loadGameRecords(): Promise<GameRecord[]> {
  try {
    const recordsData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_RECORDS);
    return recordsData ? JSON.parse(recordsData) : [];
  } catch (error) {
    console.error('Error loading game records:', error);
    return [];
  }
}

// Statistics helpers
export async function getGameStats(): Promise<{
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  completionRate: number;
  bestTimes: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
  averageTimes: {
    easy?: number;
    medium?: number;
    hard?: number;
  };
}> {
  try {
    const records = await loadGameRecords();
    const completedGames = records.filter(r => r.completed);
    
    const totalGamesPlayed = records.length;
    const totalGamesCompleted = completedGames.length;
    const completionRate = totalGamesPlayed > 0 ? (totalGamesCompleted / totalGamesPlayed) * 100 : 0;
    
    const bestTimes: any = {};
    const averageTimes: any = {};
    
    ['easy', 'medium', 'hard'].forEach(difficulty => {
      const difficultyGames = completedGames.filter(r => r.difficulty === difficulty);
      if (difficultyGames.length > 0) {
        const times = difficultyGames.map(r => r.duration!);
        bestTimes[difficulty] = Math.min(...times);
        averageTimes[difficulty] = times.reduce((sum, time) => sum + time, 0) / times.length;
      }
    });
    
    return {
      totalGamesPlayed,
      totalGamesCompleted,
      completionRate,
      bestTimes,
      averageTimes,
    };
  } catch (error) {
    console.error('Error getting game stats:', error);
    return {
      totalGamesPlayed: 0,
      totalGamesCompleted: 0,
      completionRate: 0,
      bestTimes: {},
      averageTimes: {},
    };
  }
}

// Generate unique ID
export function generateGameId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format time helpers
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}
