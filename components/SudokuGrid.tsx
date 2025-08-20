import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SudokuGridProps {
  grid: (number | null)[][];
  originalGrid: (number | null)[][];
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
  notes?: {[key: string]: number[]};
  wrongCells?: {[key: string]: boolean};
}

export default function SudokuGrid({ grid, originalGrid, selectedCell, onCellPress, notes = {}, wrongCells = {} }: SudokuGridProps) {
  const { theme } = useTheme();

  const renderCell = (value: number | null, row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isOriginal = originalGrid[row] && originalGrid[row][col] !== null;
    const isEditable = !isOriginal;
    const cellKey = `${row}-${col}`;
    const isWrong = wrongCells[cellKey];
    const cellNotes = notes[cellKey] || [];

    // Calculate if this cell is in the same row, column, or 3x3 box as selected cell
    const isHighlighted = selectedCell && (
      selectedCell.row === row ||
      selectedCell.col === col ||
      (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && 
       Math.floor(selectedCell.col / 3) === Math.floor(col / 3))
    );

    // Determine cell background color with modern styling
    let backgroundColor = theme.colors.surface;
    let borderColor = theme.colors.border;
    
    if (isWrong) {
      backgroundColor = theme.mode === 'dark' ? '#7f1d1d' : '#dc2626';
      borderColor = '#dc2626';
    } else if (isSelected) {
      backgroundColor = theme.mode === 'dark' ? '#1e40af' : '#3b82f6';
      borderColor = '#2563eb';
    } else if (isHighlighted) {
      backgroundColor = theme.mode === 'dark' ? '#312e81' : '#e0e7ff';
    }

    // Calculate thick borders for 3x3 boxes
    const thickBorderTop = row % 3 === 0;
    const thickBorderLeft = col % 3 === 0;
    const thickBorderRight = col % 3 === 2;
    const thickBorderBottom = row % 3 === 2;

    const cellStyle = [
      styles.cell,
      {
        backgroundColor,
        borderColor,
        borderTopWidth: thickBorderTop ? 3 : 1,
        borderLeftWidth: thickBorderLeft ? 3 : 1,
        borderRightWidth: thickBorderRight ? 3 : 1,
        borderBottomWidth: thickBorderBottom ? 3 : 1,
        elevation: isSelected ? 8 : 2,
        shadowColor: theme.colors.shadow,
        shadowOffset: {
          width: 0,
          height: isSelected ? 4 : 1,
        },
        shadowOpacity: isSelected ? 0.3 : 0.1,
        shadowRadius: isSelected ? 8 : 2,
      },
      isSelected && {
        borderColor: theme.colors.primary,
        borderWidth: 3,
        transform: [{ scale: 1.05 }],
      },
    ];

    const textStyle = [
      styles.cellText,
      {
        color: isOriginal ? theme.colors.text : theme.colors.primary,
        fontWeight: isOriginal ? '700' as const : '600' as const,
        fontSize: 20,
      },
    ];

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={cellStyle}
        onPress={() => onCellPress(row, col)}
        disabled={!isEditable}
        activeOpacity={0.7}
      >
        {value ? (
          <Text style={textStyle}>
            {value.toString()}
          </Text>
        ) : cellNotes.length > 0 ? (
          <View style={styles.notesContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <Text
                key={num}
                style={[
                  styles.noteText,
                  {
                    color: cellNotes.includes(num) ? theme.colors.textSecondary : 'transparent',
                  }
                ]}
              >
                {num}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={textStyle}></Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderRow = (row: (number | null)[], rowIndex: number) => {
    return (
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { 
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background,
      shadowColor: theme.colors.shadow,
    }]}>
      {grid.map((row, rowIndex) => renderRow(row, rowIndex))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    margin: 0.5,
  },
  cellText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  noteText: {
    fontSize: 8,
    width: '33.33%',
    textAlign: 'center',
    lineHeight: 10,
    fontWeight: '500',
  },
});
