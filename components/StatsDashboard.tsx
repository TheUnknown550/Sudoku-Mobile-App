import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface GameStats {
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  completionRate: number;
  totalTimePlayed: number;
  averageCompletionTime: number;
  bestTimes: {
    easy: number | null;
    medium: number | null;
    hard: number | null;
  };
  difficultyStats: {
    easy: { played: number; completed: number; averageTime: number };
    medium: { played: number; completed: number; averageTime: number };
    hard: { played: number; completed: number; averageTime: number };
  };
  streaks: {
    current: number;
    longest: number;
  };
  achievements: {
    total: number;
    unlocked: number;
  };
  weeklyProgress: number[];
}

interface StatsDashboardProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function StatsDashboard({ visible, onClose }: StatsDashboardProps) {
  const { theme } = useTheme();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'achievements'>('overview');

  useEffect(() => {
    if (visible) {
      loadStats();
    }
  }, [visible]);

  const loadStats = () => {
    // Mock data - in real app this would come from storage
    const mockStats: GameStats = {
      totalGamesPlayed: 47,
      totalGamesCompleted: 34,
      completionRate: 72.3,
      totalTimePlayed: 12450, // seconds
      averageCompletionTime: 366, // seconds
      bestTimes: {
        easy: 182,
        medium: 456,
        hard: 1234,
      },
      difficultyStats: {
        easy: { played: 20, completed: 18, averageTime: 245 },
        medium: { played: 18, completed: 12, averageTime: 487 },
        hard: { played: 9, completed: 4, averageTime: 1124 },
      },
      streaks: {
        current: 5,
        longest: 12,
      },
      achievements: {
        total: 24,
        unlocked: 8,
      },
      weeklyProgress: [2, 4, 1, 6, 3, 5, 4], // games completed per day
    };
    setStats(mockStats);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color = theme.colors.primary 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color?: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.statHeader}>
        <Text style={[styles.statIcon, { color }]}>{icon}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={[styles.statTitle, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );

  const DifficultyBreakdown = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📊 Difficulty Breakdown</Text>
      
      {Object.entries(stats!.difficultyStats).map(([difficulty, data]) => {
        const completionRate = data.played > 0 ? (data.completed / data.played) * 100 : 0;
        const difficultyColors = {
          easy: theme.colors.success,
          medium: theme.colors.warning,
          hard: theme.colors.error,
        };
        
        return (
          <View key={difficulty} style={styles.difficultyRow}>
            <View style={styles.difficultyInfo}>
              <Text style={[styles.difficultyName, { color: theme.colors.text }]}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
              <Text style={[styles.difficultyStats, { color: theme.colors.textSecondary }]}>
                {data.completed}/{data.played} completed
              </Text>
            </View>
            
            <View style={styles.difficultyMetrics}>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: difficultyColors[difficulty as keyof typeof difficultyColors],
                      width: `${completionRate}%`,
                    }
                  ]}
                />
              </View>
              <Text style={[styles.completionRate, { color: theme.colors.text }]}>
                {Math.round(completionRate)}%
              </Text>
            </View>
            
            <Text style={[styles.averageTime, { color: theme.colors.textSecondary }]}>
              Avg: {formatTime(data.averageTime)}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const WeeklyChart = () => (
    <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📈 Weekly Progress</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {stats!.weeklyProgress.map((games, index) => {
            const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const maxGames = Math.max(...stats!.weeklyProgress);
            const height = maxGames > 0 ? (games / maxGames) * 60 : 0;
            
            return (
              <View key={index} style={styles.chartDay}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      backgroundColor: theme.colors.primary,
                      height: Math.max(height, 2),
                    }
                  ]}
                />
                <Text style={[styles.chartValue, { color: theme.colors.text }]}>
                  {games}
                </Text>
                <Text style={[styles.chartLabel, { color: theme.colors.textSecondary }]}>
                  {dayLabels[index]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );

  const TabButton = ({ 
    id, 
    label, 
    icon 
  }: { 
    id: 'overview' | 'performance' | 'achievements'; 
    label: string; 
    icon: string; 
  }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === id ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        }
      ]}
      onPress={() => setActiveTab(id)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[
        styles.tabLabel,
        {
          color: activeTab === id ? theme.colors.background : theme.colors.text
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (!stats) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              📊 Statistics
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: theme.colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TabButton id="overview" label="Overview" icon="📈" />
            <TabButton id="performance" label="Performance" icon="🎯" />
            <TabButton id="achievements" label="Achievements" icon="🏆" />
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'overview' && (
              <>
                {/* Overview Stats */}
                <View style={styles.statsGrid}>
                  <StatCard
                    title="Games Played"
                    value={stats.totalGamesPlayed}
                    icon="🎮"
                  />
                  <StatCard
                    title="Completed"
                    value={stats.totalGamesCompleted}
                    subtitle={`${stats.completionRate.toFixed(1)}% rate`}
                    icon="✅"
                    color={theme.colors.success}
                  />
                  <StatCard
                    title="Time Played"
                    value={formatTime(stats.totalTimePlayed)}
                    icon="⏱️"
                  />
                  <StatCard
                    title="Current Streak"
                    value={stats.streaks.current}
                    subtitle={`Best: ${stats.streaks.longest}`}
                    icon="🔥"
                    color={theme.colors.warning}
                  />
                </View>

                <WeeklyChart />
              </>
            )}

            {activeTab === 'performance' && (
              <>
                {/* Best Times */}
                <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🏃‍♂️ Best Times</Text>
                  
                  {Object.entries(stats.bestTimes).map(([difficulty, time]) => (
                    <View key={difficulty} style={styles.bestTimeRow}>
                      <Text style={[styles.bestTimeLabel, { color: theme.colors.text }]}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </Text>
                      <Text style={[styles.bestTimeValue, { color: theme.colors.primary }]}>
                        {time ? formatTime(time) : '--:--'}
                      </Text>
                    </View>
                  ))}
                </View>

                <DifficultyBreakdown />
              </>
            )}

            {activeTab === 'achievements' && (
              <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🏆 Achievement Progress</Text>
                
                <View style={styles.achievementOverview}>
                  <View style={styles.achievementCircle}>
                    <Text style={[styles.achievementProgress, { color: theme.colors.primary }]}>
                      {stats.achievements.unlocked}/{stats.achievements.total}
                    </Text>
                    <Text style={[styles.achievementLabel, { color: theme.colors.textSecondary }]}>
                      Unlocked
                    </Text>
                  </View>
                  
                  <View style={[styles.achievementBar, { backgroundColor: theme.colors.border }]}>
                    <View
                      style={[
                        styles.achievementBarFill,
                        {
                          backgroundColor: theme.colors.primary,
                          width: `${(stats.achievements.unlocked / stats.achievements.total) * 100}%`,
                        }
                      ]}
                    />
                  </View>
                </View>
                
                <Text style={[styles.achievementText, { color: theme.colors.textSecondary }]}>
                  Keep playing to unlock more achievements! 
                  {stats.achievements.total - stats.achievements.unlocked} remaining.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    maxHeight: '90%',
    borderRadius: 20,
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginLeft: 16,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 56) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyName: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyStats: {
    fontSize: 12,
  },
  difficultyMetrics: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  completionRate: {
    fontSize: 12,
    fontWeight: '600',
    width: 30,
  },
  averageTime: {
    fontSize: 12,
    width: 60,
    textAlign: 'right',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 8,
  },
  chartDay: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: '80%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 10,
  },
  bestTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bestTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  bestTimeValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  achievementOverview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementCircle: {
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementProgress: {
    fontSize: 32,
    fontWeight: '700',
  },
  achievementLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  achievementBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
  },
  achievementBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
