import HistoryRecords from '@/components/HistoryRecords';
import MainMenu from '@/components/MainMenu';
import SettingsScreen from '@/components/SettingsScreen';
import SudokuGame from '@/components/SudokuGame';
import { useTheme } from '@/contexts/ThemeContext';
import {
  clearCurrentGame,
  GameRecord,
  generateGameId,
  loadCurrentGame,
  saveCurrentGame,
  SavedGame,
  saveGameRecord
} from '@/utils/gameStorage';
import { Difficulty, generateSudoku } from '@/utils/sudokuLogic';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type AppState = 'menu' | 'game' | 'history' | 'settings';

export default function HomeScreen() {
  const { theme } = useTheme();
  const [appState, setAppState] = useState<AppState>('menu');
  const [previousState, setPreviousState] = useState<AppState>('menu');
  const [currentGame, setCurrentGame] = useState<SavedGame | null>(null);
  const [gameKey, setGameKey] = useState(0);

  useEffect(() => {
    loadSavedGame();
  }, []);

  const loadSavedGame = async () => {
    const saved = await loadCurrentGame();
    setCurrentGame(saved);
  };

  const handleContinueGame = () => {
    setAppState('game');
  };

  const handleViewHistory = () => {
    setPreviousState(appState);
    setAppState('history');
  };

  const handleSettings = () => {
    setPreviousState(appState);
    setAppState('settings');
  };

  const handleNewGame = async (difficulty: Difficulty) => {
    // Generate new game directly
    const puzzle = generateSudoku(difficulty);
    const gameId = generateGameId();
    const now = Date.now();
    
    const newGame: SavedGame = {
      id: gameId,
      difficulty,
      currentGrid: puzzle,
      originalGrid: JSON.parse(JSON.stringify(puzzle)), // Deep copy
      timeStarted: now,
      timeElapsed: 0,
      moves: 0,
      lastPlayed: now,
    };

    setCurrentGame(newGame);
    await saveCurrentGame(newGame);
    setGameKey(prev => prev + 1);
    setAppState('game');
  };

  const handleGameComplete = async (game: SavedGame, duration: number) => {
    // Save completed game record
    const record: GameRecord = {
      id: game.id,
      difficulty: game.difficulty,
      timeStarted: game.timeStarted,
      timeCompleted: Date.now(),
      duration,
      completed: true,
      moves: game.moves,
    };

    await saveGameRecord(record);
    await clearCurrentGame();
    setCurrentGame(null);
  };

  const handleGameSave = async (game: SavedGame) => {
    setCurrentGame(game);
    await saveCurrentGame(game);
  };

  const handleBackToMenu = () => {
    setAppState('menu');
  };

  const handleBackToPrevious = () => {
    setAppState(previousState);
  };

  const handleRestartGame = () => {
    // This will be handled by the new pause menu
    setAppState('menu');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {appState === 'menu' && (
        <MainMenu
          onContinueGame={handleContinueGame}
          onNewGame={handleNewGame}
          onViewHistory={handleViewHistory}
          onSettings={handleSettings}
        />
      )}

      {appState === 'game' && currentGame && (
        <SudokuGame
          key={gameKey}
          savedGame={currentGame}
          onGameComplete={handleGameComplete}
          onGameSave={handleGameSave}
          onBackToMenu={handleBackToMenu}
          onRestart={handleRestartGame}
          onSettings={handleSettings}
        />
      )}

      {appState === 'history' && (
        <HistoryRecords onBack={handleBackToMenu} />
      )}

      {appState === 'settings' && (
        <SettingsScreen onBack={handleBackToPrevious} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
