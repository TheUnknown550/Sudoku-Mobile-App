import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Difficulty } from '../utils/sudokuLogic';

interface NewGameScreenProps {
  onDifficultySelect: (difficulty: Difficulty) => void;
  onBackToMenu: () => void;
}

export default function NewGameScreen({ onDifficultySelect, onBackToMenu }: NewGameScreenProps) {
  const { theme } = useTheme();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const difficulties: { value: Difficulty; label: string; description: string; color: string }[] = [
    {
      value: 'easy',
      label: 'Easy',
      description: 'Perfect for beginners (45-50 numbers given)',
      color: '#4CAF50'
    },
    {
      value: 'medium',
      label: 'Medium', 
      description: 'A good challenge (35-40 numbers given)',
      color: '#FF9800'
    },
    {
      value: 'hard',
      label: 'Hard',
      description: 'For experts only (25-30 numbers given)',
      color: '#F44336'
    }
  ];

  const selectedDifficultyData = difficulties.find(d => d.value === selectedDifficulty)!;

  const handleStartGame = () => {
    onDifficultySelect(selectedDifficulty);
  };

  const renderDropdownItem = (difficulty: typeof difficulties[0]) => (
    <TouchableOpacity
      key={difficulty.value}
      style={[
        styles.dropdownItem,
        {
          backgroundColor: selectedDifficulty === difficulty.value 
            ? theme.colors.primary + '20' 
            : theme.colors.surface,
          borderBottomColor: theme.colors.border,
        }
      ]}
      onPress={() => {
        setSelectedDifficulty(difficulty.value);
        setDropdownOpen(false);
      }}
    >
      <View style={styles.dropdownItemContent}>
        <View style={[styles.difficultyColorIndicator, { backgroundColor: difficulty.color }]} />
        <View style={styles.difficultyInfo}>
          <Text style={[styles.difficultyLabel, { color: theme.colors.text }]}>
            {difficulty.label}
          </Text>
          <Text style={[styles.difficultyDescription, { color: theme.colors.textSecondary }]}>
            {difficulty.description}
          </Text>
        </View>
        {selectedDifficulty === difficulty.value && (
          <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
          onPress={onBackToMenu}
        >
          <Text style={[styles.backButtonText, { color: theme.colors.text }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>New Game</Text>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Choose your difficulty level
        </Text>

        {/* Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={[
              styles.dropdownTrigger,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <View style={styles.dropdownTriggerContent}>
              <View style={[styles.difficultyColorIndicator, { backgroundColor: selectedDifficultyData.color }]} />
              <View style={styles.difficultyInfo}>
                <Text style={[styles.difficultyLabel, { color: theme.colors.text }]}>
                  {selectedDifficultyData.label}
                </Text>
                <Text style={[styles.difficultyDescription, { color: theme.colors.textSecondary }]}>
                  {selectedDifficultyData.description}
                </Text>
              </View>
              <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>
                {dropdownOpen ? '▲' : '▼'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Dropdown options */}
          {dropdownOpen && (
            <View style={[
              styles.dropdownOptions,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}>
              {difficulties.map(renderDropdownItem)}
            </View>
          )}
        </View>

        {/* Start Game Button */}
        <TouchableOpacity
          style={[
            styles.startButton,
            {
              backgroundColor: theme.colors.primary,
            }
          ]}
          onPress={handleStartGame}
        >
          <Text style={styles.startButtonText}>🎮 Start Game</Text>
        </TouchableOpacity>

        {/* Info */}
        <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
          Each game is randomly generated with a unique solution
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  spacer: {
    width: 70,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  dropdownContainer: {
    marginBottom: 40,
    zIndex: 1000,
  },
  dropdownTrigger: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  dropdownTriggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  dropdownArrow: {
    fontSize: 16,
    marginLeft: 10,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
