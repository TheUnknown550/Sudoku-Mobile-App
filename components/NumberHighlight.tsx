import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface NumberHighlightProps {
  grid: (number | null)[][];
  selectedNumber: number | null;
  highlightedNumbers: Set<number>;
}

export default function NumberHighlight({ 
  grid, 
  selectedNumber, 
  highlightedNumbers 
}: NumberHighlightProps) {
  const { theme } = useTheme();

  const getNumberCount = (num: number): number => {
    let count = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === num) {
          count++;
        }
      }
    }
    return count;
  };

  const isNumberComplete = (num: number): boolean => {
    return getNumberCount(num) === 9;
  };

  const renderNumberItem = (num: number) => {
    const count = getNumberCount(num);
    const isComplete = isNumberComplete(num);
    const isSelected = selectedNumber === num;
    const isHighlighted = highlightedNumbers.has(num);

    return (
      <View
        key={num}
        style={[
          styles.numberItem,
          {
            backgroundColor: isSelected 
              ? theme.colors.primary 
              : isHighlighted 
                ? theme.colors.accent + '20'
                : theme.colors.surface,
            borderColor: isComplete 
              ? theme.colors.success 
              : theme.colors.border,
          },
        ]}
      >
        <Text style={[
          styles.number,
          {
            color: isSelected 
              ? theme.colors.background 
              : isComplete 
                ? theme.colors.success 
                : theme.colors.text,
            fontWeight: isSelected || isComplete ? '700' : '600',
          }
        ]}>
          {num}
        </Text>
        <View style={[
          styles.progressBar,
          { backgroundColor: theme.colors.border }
        ]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: isComplete 
                  ? theme.colors.success 
                  : theme.colors.primary,
                width: `${(count / 9) * 100}%`,
              }
            ]}
          />
        </View>
        <Text style={[
          styles.count,
          {
            color: isSelected 
              ? theme.colors.background 
              : theme.colors.textSecondary,
          }
        ]}>
          {count}/9
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Number Progress
      </Text>
      <View style={styles.numbersGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(renderNumberItem)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numberItem: {
    width: '10%',
    alignItems: 'center',
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  number: {
    fontSize: 14,
    marginBottom: 2,
  },
  progressBar: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    marginBottom: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  count: {
    fontSize: 8,
    fontWeight: '500',
  },
});
