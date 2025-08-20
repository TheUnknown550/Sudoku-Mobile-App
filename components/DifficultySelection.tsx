import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectionProps {
  onDifficultySelect: (difficulty: Difficulty) => void;
}

export default function DifficultySelection({ onDifficultySelect }: DifficultySelectionProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'text');

  const difficulties = [
    {
      level: 'easy' as const,
      title: 'Easy',
      description: 'Perfect for beginners\n45-50 numbers given',
      color: '#4CAF50',
    },
    {
      level: 'medium' as const,
      title: 'Medium',
      description: 'A good challenge\n35-40 numbers given',
      color: '#FF9800',
    },
    {
      level: 'hard' as const,
      title: 'Hard',
      description: 'For experts only\n25-30 numbers given',
      color: '#F44336',
    },
  ];

  const renderDifficultyButton = (difficulty: typeof difficulties[0]) => {
    return (
      <TouchableOpacity
        key={difficulty.level}
        style={[
          styles.difficultyButton,
          {
            borderColor: difficulty.color,
            backgroundColor: backgroundColor,
          }
        ]}
        onPress={() => onDifficultySelect(difficulty.level)}
      >
        <ThemedText style={[styles.difficultyTitle, { color: difficulty.color }]}>
          {difficulty.title}
        </ThemedText>
        <ThemedText style={styles.difficultyDescription}>
          {difficulty.description}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          🧩 Sudoku
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose your difficulty level
        </ThemedText>
      </View>

      {/* Game Rules */}
      <View style={styles.rulesContainer}>
        <ThemedText style={styles.rulesTitle}>How to Play:</ThemedText>
        <ThemedText style={styles.rulesText}>
          • Fill the 9×9 grid with numbers 1-9
        </ThemedText>
        <ThemedText style={styles.rulesText}>
          • Each row, column, and 3×3 box must contain all digits 1-9
        </ThemedText>
        <ThemedText style={styles.rulesText}>
          • Tap an empty cell and select a number below
        </ThemedText>
      </View>

      {/* Difficulty Buttons */}
      <View style={styles.buttonContainer}>
        {difficulties.map(renderDifficultyButton)}
      </View>

      {/* Footer */}
      <ThemedText style={styles.footer}>
        Good luck and have fun! 🎯
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  rulesContainer: {
    marginBottom: 40,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rulesText: {
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  difficultyButton: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  difficultyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  difficultyDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 18,
  },
  footer: {
    marginTop: 30,
    fontSize: 16,
    opacity: 0.7,
  },
});
