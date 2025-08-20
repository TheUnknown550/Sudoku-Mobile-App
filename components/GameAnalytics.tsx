import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface GameStats {
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  completionRate: number;
  averageTime: number;
  bestTime: number;
  totalPlayTime: number;
  hintsUsed: number;
  perfectGames: number;
  currentStreak: number;
  longestStreak: number;
  difficultyBreakdown: {
    easy: { played: number; completed: number; bestTime: number };
    medium: { played: number; completed: number; bestTime: number };
    hard: { played: number; completed: number; bestTime: number };
  };
  recentActivity: Array<{
    date: string;
    difficulty: string;
    completed: boolean;
    time?: number;
    moves: number;
  }>;
}

interface GameAnalyticsProps {
  visible?: boolean;
  stats?: GameStats;
}

const mockStats: GameStats = {
  totalGamesPlayed: 127,
  totalGamesCompleted: 89,
  completionRate: 70.1,
  averageTime: 847, // seconds
  bestTime: 289,
  totalPlayTime: 75423, // seconds  
  hintsUsed: 156,
  perfectGames: 12,
  currentStreak: 5,
  longestStreak: 23,
  difficultyBreakdown: {
    easy: { played: 67, completed: 58, bestTime: 289 },
    medium: { played: 41, completed: 26, bestTime: 512 },
    hard: { played: 19, completed: 5, bestTime: 1247 }
  },
  recentActivity: [
    { date: '2025-08-21', difficulty: 'medium', completed: true, time: 623, moves: 67 },
    { date: '2025-08-21', difficulty: 'easy', completed: true, time: 341, moves: 45 },
    { date: '2025-08-20', difficulty: 'hard', completed: false, time: 0, moves: 23 },
    { date: '2025-08-20', difficulty: 'medium', completed: true, time: 789, moves: 71 },
    { date: '2025-08-19', difficulty: 'easy', completed: true, time: 298, moves: 38 },
  ]
};

export default function GameAnalytics({ visible = true, stats = mockStats }: GameAnalyticsProps) {
  const { theme } = useTheme();
  const [animatedValues] = useState({
    completion: new Animated.Value(0),
    streak: new Animated.Value(0),
    perfect: new Animated.Value(0),
  });

  useEffect(() => {
    if (visible) {
      // Animate stats reveal
      Animated.stagger(200, [
        Animated.timing(animatedValues.completion, {
          toValue: stats.completionRate,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValues.streak, {
          toValue: stats.currentStreak,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValues.perfect, {
          toValue: stats.perfectGames,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatTimeShort = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = theme.colors.primary,
    animatedValue 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color?: string;
    animatedValue?: Animated.Value;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>
          {title}
        </Text>
      </View>
      <View style={styles.statContent}>
        {animatedValue ? (
          <Animated.Text style={[styles.statValue, { color }]}>
            {animatedValue}
          </Animated.Text>
        ) : (
          <Text style={[styles.statValue, { color }]}>{value}</Text>
        )}
        {subtitle && (
          <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  const ProgressBar = ({ 
    percentage, 
    color = theme.colors.primary,
    height = 6 
  }: {
    percentage: number;
    color?: string;
    height?: number;
  }) => (
    <View style={[styles.progressBarContainer, { height }]}>
      <View 
        style={[
          styles.progressBar, 
          { 
            backgroundColor: color,
            width: `${Math.min(100, Math.max(0, percentage))}%` 
          }
        ]} 
      />
    </View>
  );

  if (!visible) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            📊 Game Analytics
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Your Sudoku Journey
          </Text>
        </View>

        {/* Key Stats */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate}%`}
            subtitle={`${stats.totalGamesCompleted}/${stats.totalGamesPlayed} games`}
            icon="🎯"
            color={theme.colors.success}
          />
          <StatCard
            title="Current Streak"
            value={stats.currentStreak}
            subtitle={`Best: ${stats.longestStreak} games`}
            icon="🔥"
            color={theme.colors.warning}
          />
          <StatCard
            title="Perfect Games"
            value={stats.perfectGames}
            subtitle="No mistakes"
            icon="💎"
            color={theme.colors.primary}
          />
          <StatCard
            title="Best Time"
            value={formatTimeShort(stats.bestTime)}
            subtitle="Personal record"
            icon="⚡"
            color={theme.colors.error}
          />
        </View>

        {/* Time Analytics */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            ⏱️ Time Analytics
          </Text>
          <View style={styles.timeStats}>
            <View style={styles.timeStatItem}>
              <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>
                Total Play Time
              </Text>
              <Text style={[styles.timeValue, { color: theme.colors.text }]}>
                {formatTime(stats.totalPlayTime)}
              </Text>
            </View>
            <View style={styles.timeStatItem}>
              <Text style={[styles.timeLabel, { color: theme.colors.textSecondary }]}>
                Average Time
              </Text>
              <Text style={[styles.timeValue, { color: theme.colors.text }]}>
                {formatTimeShort(stats.averageTime)}
              </Text>
            </View>
          </View>
        </View>

        {/* Difficulty Breakdown */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🎲 Difficulty Breakdown
          </Text>
          {Object.entries(stats.difficultyBreakdown).map(([difficulty, data]) => {
            const completionRate = data.played > 0 ? (data.completed / data.played) * 100 : 0;
            const difficultyColors = {
              easy: theme.colors.success,
              medium: theme.colors.warning,
              hard: theme.colors.error
            };
            
            return (
              <View key={difficulty} style={styles.difficultyItem}>
                <View style={styles.difficultyHeader}>
                  <Text style={[styles.difficultyName, { color: theme.colors.text }]}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                  <Text style={[styles.difficultyRate, { color: difficultyColors[difficulty as keyof typeof difficultyColors] }]}>
                    {completionRate.toFixed(1)}%
                  </Text>
                </View>
                <ProgressBar 
                  percentage={completionRate} 
                  color={difficultyColors[difficulty as keyof typeof difficultyColors]} 
                />
                <View style={styles.difficultyStats}>
                  <Text style={[styles.difficultyDetail, { color: theme.colors.textSecondary }]}>
                    {data.completed}/{data.played} completed
                  </Text>
                  {data.bestTime > 0 && (
                    <Text style={[styles.difficultyDetail, { color: theme.colors.textSecondary }]}>
                      Best: {formatTimeShort(data.bestTime)}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📈 Recent Activity
          </Text>
          {stats.recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityLeft}>
                <Text style={[styles.activityDate, { color: theme.colors.textSecondary }]}>
                  {new Date(activity.date).toLocaleDateString()}
                </Text>
                <Text style={[styles.activityDifficulty, { color: theme.colors.text }]}>
                  {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
                </Text>
              </View>
              <View style={styles.activityRight}>
                <View style={[
                  styles.activityStatus,
                  { backgroundColor: activity.completed ? theme.colors.success : theme.colors.error }
                ]}>
                  <Text style={styles.activityStatusText}>
                    {activity.completed ? '✓' : '✗'}
                  </Text>
                </View>
                {activity.completed && activity.time && (
                  <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>
                    {formatTimeShort(activity.time)}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: isTablet ? 24 : 16,
  },
  header: {
    marginBottom: isTablet ? 32 : 24,
    alignItems: 'center',
  },
  title: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isTablet ? 18 : 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: isTablet ? 32 : 24,
  },
  statCard: {
    width: isTablet ? '48%' : '48%',
    padding: isTablet ? 20 : 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: isTablet ? 24 : 20,
    marginRight: 8,
  },
  statTitle: {
    fontSize: isTablet ? 16 : 12,
    fontWeight: '600',
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: isTablet ? 14 : 12,
  },
  section: {
    padding: isTablet ? 20 : 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeStatItem: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: isTablet ? 14 : 12,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: 'bold',
  },
  difficultyItem: {
    marginBottom: 20,
  },
  difficultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  difficultyName: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  difficultyRate: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  difficultyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyDetail: {
    fontSize: isTablet ? 12 : 10,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  activityLeft: {
    flex: 1,
  },
  activityDate: {
    fontSize: isTablet ? 12 : 10,
    marginBottom: 2,
  },
  activityDifficulty: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
  },
  activityRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  activityStatusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activityTime: {
    fontSize: isTablet ? 12 : 10,
    fontFamily: 'monospace',
  },
});
