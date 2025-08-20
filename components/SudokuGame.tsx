import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { GameRecord, SavedGame, clearCurrentGame, formatTime, saveGameRecord } from '../utils/gameStorage';
import { isPuzzleComplete, isValidMove, isValidSudoku } from '../utils/sudokuLogic';
import AnimatedCelebration from './AnimatedCelebration';
import { FloatingMusicControl } from './FloatingMusicControl';
import GameControls from './GameControls';
import HintSystem from './HintSystem';
import NumberHighlight from './NumberHighlight';
import NumberPad from './NumberPad';
import PauseMenu from './PauseMenu';
import ProgressStats from './ProgressStats';
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
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [highlightedNumbers, setHighlightedNumbers] = useState<Set<number>>(new Set());
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Array<{row: number, col: number, oldValue: number | null, newValue: number | null}>>([]);
  const [celebration, setCelebration] = useState<{visible: boolean, type: 'number-placed' | 'row-complete' | 'column-complete' | 'box-complete' | 'game-complete'}>({
    visible: false, 
    type: 'number-placed'
  });
  
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
      setWinTime(finalDuration);
      setShowWinModal(true);
      
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

  // New enhanced feature functions
  const handleHintUsed = (row: number, col: number, number: number) => {
    if (hintsRemaining > 0) {
      const newGrid = [...grid];
      newGrid[row][col] = number;
      setGrid(newGrid);
      setHintsRemaining(prev => prev - 1);
      setHintsUsed(prev => prev + 1);
      setMoves(prev => prev + 1);
      
      // Add to move history
      setMoveHistory(prev => [...prev, { row, col, oldValue: null, newValue: number }]);
      
      // Trigger celebration
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

      {/* Responsive Content Layout */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.tabletScrollContent
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Responsive Grid Layout */}
        <View style={isTablet && isLandscape ? styles.tabletLandscapeLayout : styles.mobileLayout}>
          {/* Left side - Game Grid and Stats */}
          <View style={isTablet && isLandscape ? styles.gameSection : styles.fullWidth}>
            {/* Enhanced Progress Stats */}
            <ProgressStats
              timeElapsed={timeElapsed}
              moves={moves}
              hintsUsed={hintsUsed}
              completionPercentage={getCompletionPercentage()}
              wrongMoves={wrongMoves}
            />

            {/* Game Controls */}
            <GameControls
              onPause={handlePauseResume}
              onSettings={onSettings || (() => {})}
              onRestart={() => setShowRestartConfirmModal(true)}
              onUndo={handleUndo}
              onAutoCheck={toggleAutoCheck}
              isPaused={isPaused}
              canUndo={moveHistory.length > 0}
              autoCheckEnabled={autoCheckEnabled}
            />

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

      {/* Number Progress Highlight */}
      {!isPaused && (
        <NumberHighlight
          grid={grid}
          selectedNumber={selectedNumber}
          highlightedNumbers={highlightedNumbers}
        />
      )}

      {/* Hint System */}
      {!isPaused && (
        <HintSystem
          grid={grid}
          originalGrid={originalGrid}
          selectedCell={selectedCell}
          onHintUsed={handleHintUsed}
          hintsRemaining={hintsRemaining}
        />
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
          currentGrid={grid}
        />
      )}

      {/* Selected Cell Info */}
      {selectedCell && !isPaused && (
        <Text style={[styles.selectedInfo, { color: theme.colors.textSecondary }]}>
          Selected: Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
        </Text>
      )}
      
      {/* Close responsive layout containers */}
      </View>
      </View>
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

      {/* Win Modal - Copy of Game Over Modal Structure */}
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
            
            {/* Time Display */}
            <View style={{
              backgroundColor: theme.colors.primary + '20',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 20,
              marginVertical: 15,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
                marginBottom: 4,
              }}>Completion Time</Text>
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.colors.primary,
              }}>{formatTime(winTime)}</Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  // Save completed game
                  const completedGame: SavedGame = {
                    ...savedGame,
                    currentGrid: grid,
                    timeElapsed: winTime,
                    moves,
                    lastPlayed: Date.now(),
                  };
                  onGameComplete(completedGame, winTime);
                  setShowWinModal(false);
                  onRestart();
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.background }]}>New Game</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary, { borderColor: theme.colors.border }]}
                onPress={() => {
                  // Save completed game
                  const completedGame: SavedGame = {
                    ...savedGame,
                    currentGrid: grid,
                    timeElapsed: winTime,
                    moves,
                    lastPlayed: Date.now(),
                  };
                  onGameComplete(completedGame, winTime);
                  setShowWinModal(false);
                  onBackToMenu();
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
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Game Over</Text>
            <Text style={[styles.modalText, { color: theme.colors.text }]}>
              You have made 3 wrong moves. Game ended.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  // Save failed game record
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
                  saveGameRecord(failedRecord);
                  // Clear the current game since it's failed and can't be continued
                  clearCurrentGame();
                  setShowGameOverModal(false);
                  onRestart();
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.background }]}>New Game</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary, { borderColor: theme.colors.border }]}
                onPress={() => {
                  // Save failed game record
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
                  saveGameRecord(failedRecord);
                  // Clear the current game since it's failed and can't be continued
                  clearCurrentGame();
                  setShowGameOverModal(false);
                  onBackToMenu();
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Main Menu</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: isTablet ? 40 : 20,
  },
  tabletScrollContent: {
    paddingHorizontal: isTablet ? 40 : 0,
    maxWidth: isTablet ? 1400 : '100%',
    alignSelf: 'center',
  },
  tabletLandscapeLayout: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'flex-start',
  },
  mobileLayout: {
    flexDirection: 'column',
  },
  gameSection: {
    flex: 1.2,
    minWidth: 300,
  },
  fullWidth: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? (isTablet ? 60 : 50) : 40,
    paddingBottom: isTablet ? 20 : 16,
    paddingHorizontal: isTablet ? 16 : 8,
    marginHorizontal: isTablet ? -16 : -8,
    borderRadius: isTablet ? 20 : 16,
    marginBottom: isTablet ? 16 : 8,
    shadowOffset: {
      width: 0,
      height: isTablet ? 6 : 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: isTablet ? 12 : 8,
    elevation: isTablet ? 8 : 6,
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
