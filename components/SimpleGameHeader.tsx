import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SimpleGameHeaderProps {
  timeElapsed: number;
  onPause: () => void;
  onMenu: () => void;
  isPaused: boolean;
  wrongMoves: number;
}

export default function SimpleGameHeader({
  timeElapsed,
  onPause,
  onMenu,
  isPaused,
  wrongMoves,
}: SimpleGameHeaderProps) {
  const { theme } = useTheme();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
      {/* Menu Button */}
      <TouchableOpacity
        style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}
        onPress={onMenu}
      >
        <Text style={[styles.headerButtonText, { color: theme.colors.text }]}>⋯</Text>
      </TouchableOpacity>

      {/* Timer and Wrong Moves Counter */}
      <View style={styles.centerContainer}>
        <View style={[styles.timerContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.timerText, { color: theme.colors.text }]}>
            {formatTime(timeElapsed)}
          </Text>
        </View>
        
        {/* Wrong Moves Counter */}
        <View style={[
          styles.wrongMovesContainer, 
          { 
            backgroundColor: wrongMoves >= 2 ? '#ff4757' : wrongMoves >= 1 ? '#ffa502' : theme.colors.surface 
          }
        ]}>
          <Text style={[
            styles.wrongMovesText, 
            { 
              color: wrongMoves >= 1 ? 'white' : theme.colors.textSecondary 
            }
          ]}>
            ❌ {wrongMoves}/3
          </Text>
        </View>
      </View>

      {/* Pause Button */}
      <TouchableOpacity
        style={[styles.headerButton, { backgroundColor: theme.colors.primary }]}
        onPress={onPause}
      >
        <Text style={[styles.headerButtonText, { color: 'white' }]}>
          {isPaused ? '▶️' : '⏸️'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  timerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  centerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  wrongMovesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  wrongMovesText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
