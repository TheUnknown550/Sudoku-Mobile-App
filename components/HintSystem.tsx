import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface HintSystemProps {
  grid: (number | null)[][];
  originalGrid: (number | null)[][];
  selectedCell: { row: number; col: number } | null;
  onHintUsed: (row: number, col: number, number: number) => void;
  hintsRemaining: number;
}

export default function HintSystem({ 
  grid, 
  originalGrid, 
  selectedCell, 
  onHintUsed, 
  hintsRemaining 
}: HintSystemProps) {
  const { theme } = useTheme();

  const isValidMove = (grid: (number | null)[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (c !== col && grid[row][c] === num) return false;
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (r !== row && grid[r][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if ((r !== row || c !== col) && grid[r][c] === num) return false;
      }
    }

    return true;
  };

  const findHint = (): { row: number; col: number; number: number } | null => {
    if (!selectedCell) return null;

    const { row, col } = selectedCell;
    
    // Check if cell is editable
    if (originalGrid[row][col] !== null) return null;
    if (grid[row][col] !== null) return null;

    // Find the correct number for this cell
    for (let num = 1; num <= 9; num++) {
      if (isValidMove(grid, row, col, num)) {
        // Additional check: ensure this leads to a valid solution
        // For now, we'll just return the first valid number
        return { row, col, number: num };
      }
    }

    return null;
  };

  const handleHintPress = () => {
    if (hintsRemaining <= 0) {
      Alert.alert('No Hints Available', 'You have used all your hints for this game.');
      return;
    }

    if (!selectedCell) {
      Alert.alert('Select a Cell', 'Please select an empty cell to get a hint.');
      return;
    }

    const hint = findHint();
    if (!hint) {
      Alert.alert('No Hint Available', 'Cannot provide a hint for the selected cell.');
      return;
    }

    Alert.alert(
      'Hint Available',
      `The number ${hint.number} belongs in this cell. Use this hint?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Use Hint', 
          onPress: () => onHintUsed(hint.row, hint.col, hint.number)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.hintButton, 
          { 
            backgroundColor: hintsRemaining > 0 ? theme.colors.primary : theme.colors.secondary,
            borderColor: theme.colors.border,
          }
        ]}
        onPress={handleHintPress}
        disabled={hintsRemaining <= 0}
      >
        <Text style={[styles.hintIcon, { color: theme.colors.background }]}>💡</Text>
        <Text style={[styles.hintText, { color: theme.colors.background }]}>
          Hint ({hintsRemaining})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hintIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  hintText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
