import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Difficulty } from '../utils/sudokuLogic';

interface DailyChallenge {
  id: string;
  date: string;
  difficulty: Difficulty;
  completed: boolean;
  bestTime?: number;
  attempts: number;
  stars: number; // 1-3 stars based on performance
}

interface DailyChallengeCardProps {
  onStartChallenge: (difficulty: Difficulty) => void;
}

export default function DailyChallengeCard({ onStartChallenge }: DailyChallengeCardProps) {
  const { theme } = useTheme();
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');

  useEffect(() => {
    generateDailyChallenge();
    const interval = setInterval(updateTimeUntilNext, 1000);
    return () => clearInterval(interval);
  }, []);

  const generateDailyChallenge = () => {
    const today = new Date().toDateString();
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    
    // Use date as seed for consistent daily difficulty
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const difficulty = difficulties[dayOfYear % 3];

    // Check if challenge was completed (in real app, this would come from storage)
    const challenge: DailyChallenge = {
      id: `daily-${today}`,
      date: today,
      difficulty,
      completed: false, // This would be loaded from storage
      attempts: 0,
      stars: 0,
    };

    setDailyChallenge(challenge);
  };

  const updateTimeUntilNext = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    setTimeUntilNext(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const getDifficultyColor = () => {
    if (!dailyChallenge) return theme.colors.primary;
    switch (dailyChallenge.difficulty) {
      case 'easy': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      case 'hard': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const getDifficultyIcon = () => {
    if (!dailyChallenge) return '🎯';
    switch (dailyChallenge.difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '🎯';
    }
  };

  const getStarDisplay = () => {
    if (!dailyChallenge || !dailyChallenge.completed) return '';
    return '⭐'.repeat(dailyChallenge.stars) + '☆'.repeat(3 - dailyChallenge.stars);
  };

  const handleStartChallenge = () => {
    if (!dailyChallenge) return;

    if (dailyChallenge.completed) {
      Alert.alert(
        'Challenge Completed',
        `You've already completed today's challenge with ${dailyChallenge.stars} star(s)! Try again to improve your score?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Play Again', onPress: () => onStartChallenge(dailyChallenge.difficulty) }
        ]
      );
    } else {
      onStartChallenge(dailyChallenge.difficulty);
    }
  };

  if (!dailyChallenge) return null;

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface,
        borderColor: getDifficultyColor(),
        shadowColor: theme.colors.shadow,
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            📅 Daily Challenge
          </Text>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        
        <View style={styles.timerSection}>
          <Text style={[styles.timerLabel, { color: theme.colors.textSecondary }]}>
            Next Challenge
          </Text>
          <Text style={[styles.timer, { color: theme.colors.primary }]}>
            {timeUntilNext}
          </Text>
        </View>
      </View>

      {/* Challenge Info */}
      <View style={styles.challengeInfo}>
        <View style={styles.difficultySection}>
          <Text style={styles.difficultyIcon}>{getDifficultyIcon()}</Text>
          <View>
            <Text style={[styles.difficultyLabel, { color: theme.colors.textSecondary }]}>
              Difficulty
            </Text>
            <Text style={[
              styles.difficultyText, 
              { color: getDifficultyColor() }
            ]}>
              {dailyChallenge.difficulty.toUpperCase()}
            </Text>
          </View>
        </View>

        {dailyChallenge.completed && (
          <View style={styles.statusSection}>
            <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}>
              Status
            </Text>
            <View style={styles.completedInfo}>
              <Text style={[styles.completedText, { color: theme.colors.success }]}>
                ✓ Completed
              </Text>
              <Text style={styles.starsText}>{getStarDisplay()}</Text>
              {dailyChallenge.bestTime && (
                <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                  Best: {Math.floor(dailyChallenge.bestTime / 60)}:{(dailyChallenge.bestTime % 60).toString().padStart(2, '0')}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: dailyChallenge.completed 
              ? theme.colors.secondary 
              : theme.colors.primary,
          }
        ]}
        onPress={handleStartChallenge}
      >
        <Text style={styles.actionButtonText}>
          {dailyChallenge.completed ? '🔄 Play Again' : '🎯 Start Challenge'}
        </Text>
      </TouchableOpacity>

      {/* Rewards Info */}
      <View style={styles.rewardsInfo}>
        <Text style={[styles.rewardsText, { color: theme.colors.textSecondary }]}>
          💎 Complete for exclusive rewards and achievements!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  timerSection: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  timer: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  difficultySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  difficultyLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusSection: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  completedInfo: {
    alignItems: 'flex-end',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  starsText: {
    fontSize: 16,
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  rewardsInfo: {
    alignItems: 'center',
  },
  rewardsText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
