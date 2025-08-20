import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ProgressStatsProps {
  timeElapsed: number;
  moves: number;
  hintsUsed: number;
  completionPercentage: number;
  wrongMoves: number;
}

export default function ProgressStats({ 
  timeElapsed, 
  moves, 
  hintsUsed, 
  completionPercentage,
  wrongMoves 
}: ProgressStatsProps) {
  const { theme } = useTheme();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracy = (): number => {
    if (moves === 0) return 100;
    return Math.round(((moves - wrongMoves) / moves) * 100);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <Text style={[styles.progressLabel, { color: theme.colors.textSecondary }]}>
          Progress: {Math.round(completionPercentage)}%
        </Text>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: theme.colors.primary,
                width: `${completionPercentage}%` 
              }
            ]} 
          />
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statIcon, { color: theme.colors.primary }]}>⏱️</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {formatTime(timeElapsed)}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Time
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statIcon, { color: theme.colors.primary }]}>🎯</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {moves}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Moves
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statIcon, { color: theme.colors.primary }]}>💡</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {hintsUsed}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Hints
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statIcon, { color: getAccuracy() >= 80 ? theme.colors.success : theme.colors.warning }]}>
            📊
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {getAccuracy()}%
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Accuracy
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
