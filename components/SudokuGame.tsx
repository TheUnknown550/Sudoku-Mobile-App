import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SavedGame, formatTime } from '../utils/gameStorage';
import { isPuzzleComplete, isValidMove, isValidSudoku } from '../utils/sudokuLogic';
import NumberPad from './NumberPad';
import PauseMenu from './PauseMenu';
import SudokuGrid from './SudokuGrid';

interface SudokuGameProps {
  savedGame: SavedGame;
  onGameComplete: (game: SavedGame, duration: number) => void;
  onGameSave: (game: SavedGame) => void;
  onBackToMenu: () => void;
  onRestart: () => void;
  onSettings?: () => void;
}

export default function SudokuGame({ 
  savedGame, 
  onGameComplete, 
  onGameSave, 
  onBackToMenu, 
  onRestart,
  onSettings 
}: SudokuGameProps) {
  const { theme } = useTheme();
  const [grid, setGrid] = useState<(number | null)[][]>(savedGame.currentGrid);
  const [originalGrid] = useState<(number | null)[][]>(savedGame.originalGrid);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(savedGame.timeElapsed);
  const [moves, setMoves] = useState(savedGame.moves);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [wrongCells, setWrongCells] = useState<{[key: string]: boolean}>({});
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState<{[key: string]: number[]}>({});
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    // Start timer
    startTimer();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Check if puzzle is complete
    if (grid.length > 0 && isPuzzleComplete(grid) && isValidSudoku(grid)) {
      setIsComplete(true);
      stopTimer();
      const finalDuration = timeElapsed;
      
      Alert.alert(
        '🎉 Congratulations!',
        `You solved the ${savedGame.difficulty} puzzle in ${formatTime(finalDuration)}!`,
        [
          { text: 'New Game', onPress: onRestart },
          { text: 'Main Menu', onPress: onBackToMenu },
        ]
      );
      
      // Save completed game
      const completedGame: SavedGame = {
        ...savedGame,
        currentGrid: grid,
        timeElapsed: finalDuration,
        moves,
        lastPlayed: Date.now(),
      };
      
      onGameComplete(completedGame, finalDuration);
    }
  }, [grid]);

  useEffect(() => {
    // Auto-save game progress every 10 seconds
    const autoSaveInterval = setInterval(() => {
      if (!isComplete && !isPaused) {
        saveGameProgress();
      }
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [grid, timeElapsed, moves, isComplete, isPaused]);

  const startTimer = () => {
    lastUpdateRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (!isPaused && !isComplete) {
        const now = Date.now();
        const deltaSeconds = Math.floor((now - lastUpdateRef.current) / 1000);
        if (deltaSeconds > 0) {
          setTimeElapsed(prev => prev + deltaSeconds);
          lastUpdateRef.current = now;
        }
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const pauseTimer = () => {
    setIsPaused(true);
    stopTimer();
  };

  const resumeTimer = () => {
    setIsPaused(false);
    startTimer();
  };

  const saveGameProgress = () => {
    const updatedGame: SavedGame = {
      ...savedGame,
      currentGrid: grid,
      timeElapsed,
      moves,
      lastPlayed: Date.now(),
    };
    onGameSave(updatedGame);
  };

  const handleCellPress = (row: number, col: number) => {
    if (originalGrid[row] && originalGrid[row][col] === null && !isComplete) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberPress = (number: number) => {
    if (selectedCell && !isComplete) {
      const cellKey = `${selectedCell.row}-${selectedCell.col}`;
      
      if (editMode) {
        // Handle notes mode
        const currentNotes = notes[cellKey] || [];
        const updatedNotes = currentNotes.includes(number)
          ? currentNotes.filter(n => n !== number)
          : [...currentNotes, number].sort();
        
        const newNotes = { ...notes };
        if (updatedNotes.length === 0) {
          delete newNotes[cellKey];
        } else {
          newNotes[cellKey] = updatedNotes;
        }
        setNotes(newNotes);
      } else {
        // Handle regular number placement
        const newGrid = [...grid];
        const oldValue = newGrid[selectedCell.row][selectedCell.col];
        
        // Check if the move is valid
        const isValid = isValidMove(grid, selectedCell.row, selectedCell.col, number);
        
        if (!isValid) {
          // Invalid move - increment wrong counter and mark cell
          setWrongMoves(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              Alert.alert(
                'Game Over',
                'You have made 3 wrong moves. Game ended.',
                [
                  { text: 'Restart', onPress: onRestart },
                  { text: 'Main Menu', onPress: onBackToMenu }
                ]
              );
            }
            return newCount;
          });
          
          // Mark this cell as wrong temporarily
          const newWrongCells = { ...wrongCells };
          newWrongCells[cellKey] = true;
          setWrongCells(newWrongCells);
          
          // Remove wrong highlighting after 1 second
          setTimeout(() => {
            setWrongCells(prev => {
              const updated = { ...prev };
              delete updated[cellKey];
              return updated;
            });
          }, 1000);
          
          return; // Don't place the number
        }
        
        // Valid move - place the number
        newGrid[selectedCell.row][selectedCell.col] = number;
        setGrid(newGrid);
        
        // Clear notes for this cell
        const newNotes = { ...notes };
        delete newNotes[cellKey];
        setNotes(newNotes);
        
        if (oldValue !== number) {
          setMoves(prev => prev + 1);
        }
      }
    }
  };

  const handleClearPress = () => {
    if (selectedCell && !isComplete) {
      const cellKey = `${selectedCell.row}-${selectedCell.col}`;
      
      if (editMode) {
        // Clear notes for this cell
        const newNotes = { ...notes };
        delete newNotes[cellKey];
        setNotes(newNotes);
      } else {
        // Clear the number
        const newGrid = [...grid];
        if (newGrid[selectedCell.row][selectedCell.col] !== null) {
          newGrid[selectedCell.row][selectedCell.col] = null;
          setGrid(newGrid);
          setMoves(prev => prev + 1);
        }
        
        // Also clear notes for this cell
        const newNotes = { ...notes };
        delete newNotes[cellKey];
        setNotes(newNotes);
      }
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
      saveGameProgress();
    }
  };

  const handlePauseMenuOpen = () => {
    if (!isPaused) {
      pauseTimer();
      saveGameProgress();
    }
    setShowPauseMenu(true);
  };

  const handlePauseMenuClose = () => {
    setShowPauseMenu(false);
  };

  const handlePauseMenuContinue = () => {
    setShowPauseMenu(false);
    if (isPaused) {
      resumeTimer();
    }
  };

  const handlePauseMenuMainMenu = () => {
    setShowPauseMenu(false);
    onBackToMenu();
  };

  const handlePauseMenuRestart = () => {
    Alert.alert(
      'Restart Game',
      'Are you sure you want to restart? Your current progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restart', 
          style: 'destructive',
          onPress: () => {
            setShowPauseMenu(false);
            onRestart();
          }
        }
      ]
    );
  };

  const getDifficultyColor = () => {
    switch (savedGame.difficulty) {
      case 'easy': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      case 'hard': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: theme.colors.surface,
        shadowColor: theme.colors.shadow,
      }]}>
        <TouchableOpacity 
          style={[styles.headerButton, { 
            backgroundColor: theme.colors.background,
            shadowColor: theme.colors.shadow,
          }]} 
          onPress={onSettings || (() => {})}
          disabled={!onSettings}
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.textSecondary }]}>⚙️</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.difficulty, { color: getDifficultyColor() }]}>
            {savedGame.difficulty.toUpperCase()}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.headerButton, { 
            backgroundColor: theme.colors.background,
            shadowColor: theme.colors.shadow,
          }]} 
          onPress={handlePauseMenuOpen}
        >
          <Text style={[styles.headerButtonText, { color: theme.colors.textSecondary }]}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Game Stats */}
        <View style={[styles.stats, {
        backgroundColor: theme.colors.surface,
        shadowColor: theme.colors.shadow,
      }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {formatTime(timeElapsed)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Time</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.pauseButton, { 
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.shadow,
          }]}
          onPress={handlePauseResume}
        >
          <Text style={styles.pauseButtonText}>
            {isPaused ? '▶️' : '⏸️'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {moves}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Moves</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: wrongMoves >= 2 ? theme.colors.error : theme.colors.text }]}>
            {wrongMoves}/3
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Wrong</Text>
        </View>
      </View>

      {/* Edit Mode Toggle */}
      {!isPaused && (
        <View style={styles.editModeContainer}>
          <TouchableOpacity
            style={[
              styles.editModeButton,
              {
                backgroundColor: editMode ? theme.colors.primary : theme.colors.surface,
                borderColor: editMode ? theme.colors.primary : theme.colors.border,
                borderWidth: 2,
                shadowColor: theme.colors.shadow,
                elevation: editMode ? 8 : 4,
                shadowOffset: {
                  width: 0,
                  height: editMode ? 6 : 3,
                },
                shadowOpacity: 0.15,
                shadowRadius: editMode ? 12 : 6,
              }
            ]}
            onPress={() => setEditMode(!editMode)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.editModeIcon,
              { color: editMode ? 'white' : theme.colors.text }
            ]}>
              ✏️
            </Text>
            <Text style={[
              styles.editModeText,
              { 
                color: editMode ? 'white' : theme.colors.text,
                fontWeight: '700',
                letterSpacing: 0.5,
              }
            ]}>
              {editMode ? 'Notes Mode' : 'Number Mode'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      {!isPaused && (
        <Text style={[styles.instructions, { color: theme.colors.textSecondary }]}>
          Tap an empty cell, then select a number below
        </Text>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <TouchableOpacity 
          style={[styles.pauseOverlay, { backgroundColor: theme.colors.overlay }]}
          activeOpacity={1}
          onPress={handlePauseResume}
        >
          <View style={[styles.pauseCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.pauseTitle, { color: theme.colors.text }]}>Game Paused</Text>
            <Text style={[styles.pauseSubtitle, { color: theme.colors.textSecondary }]}>
              Tap anywhere to resume
            </Text>
            <TouchableOpacity 
              style={[styles.resumeButton, { backgroundColor: theme.colors.primary }]}
              onPress={handlePauseResume}
            >
              <Text style={styles.resumeButtonText}>▶️ Resume Game</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Sudoku Grid */}
      {!isPaused && (
        <SudokuGrid
          grid={grid}
          originalGrid={originalGrid}
          selectedCell={selectedCell}
          onCellPress={handleCellPress}
          notes={notes}
          wrongCells={wrongCells}
        />
      )}

      {/* Number Pad */}
      {!isPaused && (
        <NumberPad
          onNumberPress={handleNumberPress}
          onClearPress={handleClearPress}
          disabled={!selectedCell || isComplete}
        />
      )}

      {/* Selected Cell Info */}
      {selectedCell && !isPaused && (
        <Text style={[styles.selectedInfo, { color: theme.colors.textSecondary }]}>
          Selected: Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
        </Text>
      )}
      </ScrollView>

      {/* Pause Overlay */}
      {isPaused && (
        <TouchableOpacity 
          style={[styles.pauseOverlay, { backgroundColor: theme.colors.overlay }]}
          activeOpacity={1}
          onPress={handlePauseResume}
        >
          <View style={[styles.pauseCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.pauseTitle, { color: theme.colors.text }]}>Game Paused</Text>
            <Text style={[styles.pauseSubtitle, { color: theme.colors.textSecondary }]}>
              Tap anywhere to resume
            </Text>
            <TouchableOpacity 
              style={[styles.resumeButton, { backgroundColor: theme.colors.primary }]}
              onPress={handlePauseResume}
            >
              <Text style={styles.resumeButtonText}>▶️ Resume Game</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Pause Menu */}
      {showPauseMenu && (
        <PauseMenu
          onContinue={handlePauseMenuContinue}
          onMainMenu={handlePauseMenuMainMenu}
          onRestart={handlePauseMenuRestart}
          onClose={handlePauseMenuClose}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 8,
    marginHorizontal: -8,
    borderRadius: 16,
    marginBottom: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  backButton: {
    width: 60,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '500',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  difficulty: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  restartButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerButtonText: {
    fontSize: 18,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginHorizontal: -8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 32,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  pauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  pauseButtonText: {
    fontSize: 20,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 13,
    paddingHorizontal: 16,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  pauseCard: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  pauseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pauseSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  resumeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedInfo: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
    fontSize: 12,
    paddingHorizontal: 16,
  },
  editModeContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  editModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
  },
  editModeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  editModeText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
