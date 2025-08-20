import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useHints } from '../contexts/HintContext';
import { useTheme } from '../contexts/ThemeContext';
import { GameRecord, SavedGame, clearCurrentGame, formatTime, saveGameRecord } from '../utils/gameStorage';
import { isPuzzleComplete, isValidMove, isValidSudoku } from '../utils/sudokuLogic';
import AnimatedCelebration from './AnimatedCelebration';
import { FloatingMusicControl } from './FloatingMusicControl';
import { AdBreakTrigger, adBreakController } from './InterstitialAdManager';
import NumberPad from './NumberPad';
import SimpleGameControls from './SimpleGameControls';
import SimpleGameHeader from './SimpleGameHeader';
import SimpleGameMenu from './SimpleGameMenu';
import SudokuGrid from './SudokuGrid';

// Get screen dimensions and calculate responsive values
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;

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
  const { hintsRemaining, useHint, getHintStatus } = useHints();
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
  const [showWinModal, setShowWinModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showRestartConfirmModal, setShowRestartConfirmModal] = useState(false);
  const [winTime, setWinTime] = useState(0);
  
  // New enhanced features state
  const [hintsUsed, setHintsUsed] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [highlightedNumbers, setHighlightedNumbers] = useState<Set<number>>(new Set());
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Array<{row: number, col: number, oldValue: number | null, newValue: number | null}>>([]);
  const [celebration, setCelebration] = useState<{visible: boolean, type: 'number-placed' | 'row-complete' | 'column-complete' | 'box-complete' | 'game-complete'}>({
    visible: false, 
    type: 'number-placed'
  });
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      setWinTime(finalDuration);
      setShowWinModal(true);
      
      // Show ad break for puzzle completion
      adBreakController.showAdBreak(AdBreakTrigger.PUZZLE_COMPLETED);
      
      // Don't call onGameComplete immediately - let the modal handle it
      // Save completed game for later
      const completedGame: SavedGame = {
        ...savedGame,
        currentGrid: grid,
        timeElapsed: finalDuration,
        moves,
        lastPlayed: Date.now(),
      };
      
      // Store completed game data but don't call onGameComplete yet
      // onGameComplete(completedGame, finalDuration);
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
              setShowGameOverModal(true);
              // Show ad break for game over
              adBreakController.showAdBreak(AdBreakTrigger.PUZZLE_FAILED);
            }
            return newCount;
          });
          
          // Count this as a move (including invalid moves)
          setMoves(prev => prev + 1);
          
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
        
        // Add to move history for undo functionality
        setMoveHistory(prev => [...prev, { 
          row: selectedCell.row, 
          col: selectedCell.col, 
          oldValue, 
          newValue: number 
        }]);
        
        // Check for completions and trigger celebrations
        checkForCompletions(newGrid, selectedCell.row, selectedCell.col);
        
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
        const oldValue = newGrid[selectedCell.row][selectedCell.col];
        if (oldValue !== null) {
          newGrid[selectedCell.row][selectedCell.col] = null;
          setGrid(newGrid);
          setMoves(prev => prev + 1);
          
          // Add to move history for undo functionality
          setMoveHistory(prev => [...prev, { 
            row: selectedCell.row, 
            col: selectedCell.col, 
            oldValue, 
            newValue: null 
          }]);
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
    // Show ad break before going back to menu
    adBreakController.showAdBreak(AdBreakTrigger.BACK_TO_MENU, () => {
      onBackToMenu();
    });
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
            // Show ad break before restarting
            adBreakController.showAdBreak(AdBreakTrigger.GAME_RESTART, () => {
              onRestart();
            });
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

  // New enhanced feature functions
  const handleHintUsed = async (row: number, col: number, number: number) => {
    const success = await useHint();
    if (success) {
      const newGrid = [...grid];
      newGrid[row][col] = number;
      setGrid(newGrid);
      setHintsUsed(prev => prev + 1);
      setMoves(prev => prev + 1);
      
      // Add to move history
      setMoveHistory(prev => [...prev, { row, col, oldValue: null, newValue: number }]);
      
      // Trigger celebration
      setCelebration({ visible: true, type: 'number-placed' });
      setTimeout(() => setCelebration({ visible: false, type: 'number-placed' }), 1000);
    }
  };

  const handleShowHint = async () => {
    const success = await useHint();
    if (success) {
      setHintsUsed(prev => prev + 1);
      
      // Generate a helpful hint
      const hints = [
        'Look for cells that can only contain one number.',
        'Check if any row, column, or 3×3 box is missing just one number.',
        'Focus on the most filled rows, columns, and boxes first.',
        'Look for numbers that can only go in one place in a row, column, or box.',
        'Check for pairs - when two cells can only contain the same two numbers.',
        'Start with the numbers that appear most frequently on the board.',
        'Look for empty cells in rows/columns that are almost complete.',
        'Focus on 3×3 boxes that have the most numbers filled in.',
      ];
      
      const randomHint = hints[Math.floor(Math.random() * hints.length)];
      
      Alert.alert(
        '💡 Hint',
        randomHint,
        [{ text: 'Got it!', style: 'default' }]
      );
      
      // Trigger celebration for using hint
      setCelebration({ visible: true, type: 'number-placed' });
      setTimeout(() => setCelebration({ visible: false, type: 'number-placed' }), 1000);
    }
  };

  const handleUndo = () => {
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];
      const newGrid = [...grid];
      newGrid[lastMove.row][lastMove.col] = lastMove.oldValue;
      setGrid(newGrid);
      setMoveHistory(prev => prev.slice(0, -1));
      setMoves(prev => Math.max(0, prev - 1));
    }
  };

  const toggleAutoCheck = () => {
    setAutoCheckEnabled(prev => !prev);
  };

  const getCompletionPercentage = (): number => {
    let filledCells = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== null) {
          filledCells++;
        }
      }
    }
    return (filledCells / 81) * 100;
  };

  const updateHighlightedNumbers = () => {
    if (selectedCell && grid[selectedCell.row][selectedCell.col] !== null) {
      const selectedNum = grid[selectedCell.row][selectedCell.col]!;
      setSelectedNumber(selectedNum);
      setHighlightedNumbers(new Set([selectedNum]));
    } else {
      setSelectedNumber(null);
      setHighlightedNumbers(new Set());
    }
  };

  const checkForCompletions = (newGrid: (number | null)[][], row: number, col: number) => {
    // Check if row is complete
    if (newGrid[row].every(cell => cell !== null)) {
      setCelebration({ visible: true, type: 'row-complete' });
      setTimeout(() => setCelebration({ visible: false, type: 'row-complete' }), 1500);
      return;
    }

    // Check if column is complete
    if (newGrid.every(gridRow => gridRow[col] !== null)) {
      setCelebration({ visible: true, type: 'column-complete' });
      setTimeout(() => setCelebration({ visible: false, type: 'column-complete' }), 1500);
      return;
    }

    // Check if 3x3 box is complete
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    let boxComplete = true;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (newGrid[r][c] === null) {
          boxComplete = false;
          break;
        }
      }
      if (!boxComplete) break;
    }
    
    if (boxComplete) {
      setCelebration({ visible: true, type: 'box-complete' });
      setTimeout(() => setCelebration({ visible: false, type: 'box-complete' }), 1500);
    }
  };

  // Update existing handleNumberPress to include new features
  React.useEffect(() => {
    updateHighlightedNumbers();
  }, [selectedCell, grid]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Simplified Header */}
      <SimpleGameHeader
        timeElapsed={timeElapsed}
        onPause={handlePauseResume}
        onMenu={() => setShowPauseMenu(true)}
        isPaused={isPaused}
        wrongMoves={wrongMoves}
      />

      {/* Main Game Content */}
      <View style={styles.gameContent}>
        {!isPaused && (
          <>
            {/* Game Controls */}
            <SimpleGameControls
              onHint={handleShowHint}
              onUndo={handleUndo}
              hintsRemaining={hintsRemaining}
              canUndo={moveHistory.length > 0}
              editMode={editMode}
              onToggleEditMode={() => setEditMode(!editMode)}
            />

            {/* Sudoku Grid */}
            <SudokuGrid
              grid={grid}
              originalGrid={originalGrid}
              selectedCell={selectedCell}
              onCellPress={handleCellPress}
              notes={notes}
              wrongCells={wrongCells}
            />

            {/* Number Pad */}
            <NumberPad
              onNumberPress={handleNumberPress}
              onClearPress={handleClearPress}
              disabled={!selectedCell || isComplete}
              currentGrid={grid}
            />
          </>
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
      </View>

      {/* Game Menu */}
      <SimpleGameMenu
        visible={showPauseMenu}
        onClose={() => setShowPauseMenu(false)}
        onContinue={() => {
          setShowPauseMenu(false);
          setIsPaused(false);
        }}
        onRestart={() => {
          setShowPauseMenu(false);
          setShowRestartConfirmModal(true);
        }}
        onSettings={() => {
          setShowPauseMenu(false);
          if (onSettings) onSettings();
        }}
        onMainMenu={() => {
          setShowPauseMenu(false);
          // Show ad break before going back to menu
          adBreakController.showAdBreak(AdBreakTrigger.BACK_TO_MENU, () => {
            onBackToMenu();
          });
        }}
        timeElapsed={timeElapsed}
        moves={moves}
        wrongMoves={wrongMoves}
      />

      {/* Win Modal */}
      <Modal
        visible={showWinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>🎉 Congratulations!</Text>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              You solved the {savedGame.difficulty} puzzle!
            </Text>
            
            <View style={[styles.timeDisplay, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Completion Time</Text>
              <Text style={[styles.timeValue, { color: theme.colors.primary }]}>{formatTime(winTime)}</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  const completedGame: SavedGame = {
                    ...savedGame,
                    currentGrid: grid,
                    timeElapsed: winTime,
                    moves,
                    lastPlayed: Date.now(),
                  };
                  onGameComplete(completedGame, winTime);
                  setShowWinModal(false);
                  // Show ad break before starting new game
                  adBreakController.showAdBreak(AdBreakTrigger.NEW_GAME_START, () => {
                    onRestart();
                  });
                }}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>New Game</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary, { borderColor: theme.colors.border }]}
                onPress={() => {
                  const completedGame: SavedGame = {
                    ...savedGame,
                    currentGrid: grid,
                    timeElapsed: winTime,
                    moves,
                    lastPlayed: Date.now(),
                  };
                  onGameComplete(completedGame, winTime);
                  setShowWinModal(false);
                  // Show ad break before going back to menu
                  adBreakController.showAdBreak(AdBreakTrigger.BACK_TO_MENU, () => {
                    onBackToMenu();
                  });
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Main Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Game Over Modal */}
      <Modal
        visible={showGameOverModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGameOverModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: '#ff4757' }]}>💀 Game Over</Text>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              You made 3 wrong moves!{'\n'}Better luck next time.
            </Text>
            
            <View style={[styles.timeDisplay, { backgroundColor: '#ff4757' + '20' }]}>
              <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>Final Time</Text>
              <Text style={[styles.timeValue, { color: '#ff4757' }]}>{formatTime(timeElapsed)}</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={async () => {
                  // Save failed game record to history
                  const failedRecord: GameRecord = {
                    id: savedGame.id,
                    difficulty: savedGame.difficulty,
                    timeStarted: savedGame.timeStarted,
                    timeCompleted: Date.now(),
                    duration: timeElapsed,
                    completed: false,
                    failed: true,
                    moves: moves,
                  };
                  await saveGameRecord(failedRecord);
                  await clearCurrentGame();
                  setShowGameOverModal(false);
                  // Show ad break before starting new game
                  adBreakController.showAdBreak(AdBreakTrigger.NEW_GAME_START, () => {
                    onRestart();
                  });
                }}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary, { borderColor: theme.colors.border }]}
                onPress={async () => {
                  // Save failed game record to history
                  const failedRecord: GameRecord = {
                    id: savedGame.id,
                    difficulty: savedGame.difficulty,
                    timeStarted: savedGame.timeStarted,
                    timeCompleted: Date.now(),
                    duration: timeElapsed,
                    completed: false,
                    failed: true,
                    moves: moves,
                  };
                  await saveGameRecord(failedRecord);
                  await clearCurrentGame();
                  setShowGameOverModal(false);
                  // Show ad break before going back to menu
                  adBreakController.showAdBreak(AdBreakTrigger.BACK_TO_MENU, () => {
                    onBackToMenu();
                  });
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Main Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Restart Confirmation Modal */}
      <Modal
        visible={showRestartConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRestartConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Restart Game?</Text>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              Your current progress will be lost.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary, { borderColor: theme.colors.border }]}
                onPress={() => setShowRestartConfirmModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: '#ff4757' }]}
                onPress={() => {
                  setShowRestartConfirmModal(false);
                  // Show ad break before restarting
                  adBreakController.showAdBreak(AdBreakTrigger.GAME_RESTART, () => {
                    onRestart();
                  });
                }}
              >
                <Text style={[styles.modalButtonText, { color: 'white' }]}>Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Animated Celebration */}
      <AnimatedCelebration
        visible={celebration.visible}
        type={celebration.type}
        duration={1000}
      />
      
      {/* Floating Music Control */}
      <FloatingMusicControl 
        position="bottom-right"
        modalVisible={showPauseMenu || showWinModal || showGameOverModal || showRestartConfirmModal}
        hideWhenModalOpen={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isTablet ? 32 : 16,
  },
  gameContent: {
    flex: 1,
    paddingVertical: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    borderRadius: 20,
    padding: 30,
    minWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  timeDisplay: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 15,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
