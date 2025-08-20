import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { GameRecord, formatDuration, getGameStats, loadGameRecords } from '../utils/gameStorage';
import { Difficulty } from '../utils/sudokuLogic';

const { width } = Dimensions.get('window');

interface HistoryRecordsProps {
  onBack: () => void;
}

export default function HistoryRecords({ onBack }: HistoryRecordsProps) {
  const { theme } = useTheme();
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [stats, setStats] = useState<any>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const gameRecords = await loadGameRecords();
    const gameStats = await getGameStats();
    setRecords(gameRecords);
    setStats(gameStats);
  };

  const filteredRecords = records.filter(record => 
    selectedDifficulty === 'all' || record.difficulty === selectedDifficulty
  ).sort((a, b) => b.timeStarted - a.timeStarted);

  const DifficultyTab = ({ difficulty, label }: { difficulty: Difficulty | 'all'; label: string }) => {
    const isSelected = selectedDifficulty === difficulty;
    return (
      <TouchableOpacity
        style={[
          styles.difficultyTab,
          {
            backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => setSelectedDifficulty(difficulty)}
      >
        <Text
          style={[
            styles.difficultyTabText,
            { color: isSelected ? '#FFFFFF' : theme.colors.text },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    color 
  }: { 
    title: string; 
    value: string; 
    subtitle?: string; 
    color: string;
  }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.colors.text }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
      )}
    </View>
  );

  const RecordItem = ({ record }: { record: GameRecord }) => {
    const date = new Date(record.timeStarted);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <View style={[styles.recordItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <View style={styles.recordHeader}>
          <View style={styles.recordInfo}>
            <Text style={[styles.recordDifficulty, { color: getDifficultyColor(record.difficulty) }]}>
              {record.difficulty.toUpperCase()}
            </Text>
            <Text style={[styles.recordDate, { color: theme.colors.textSecondary }]}>
              {formattedDate} at {formattedTime}
            </Text>
          </View>
          <View style={styles.recordStatus}>
            <Text style={[styles.statusIcon, { color: record.completed ? theme.colors.success : theme.colors.warning }]}>
              {record.completed ? '✅' : '⏱️'}
            </Text>
          </View>
        </View>
        
        <View style={styles.recordStats}>
          <View style={styles.recordStat}>
            <Text style={[styles.recordStatLabel, { color: theme.colors.textSecondary }]}>Duration</Text>
            <Text style={[styles.recordStatValue, { color: theme.colors.text }]}>
              {record.completed && record.duration ? formatDuration(record.duration) : 'Incomplete'}
            </Text>
          </View>
          <View style={styles.recordStat}>
            <Text style={[styles.recordStatLabel, { color: theme.colors.textSecondary }]}>Moves</Text>
            <Text style={[styles.recordStatValue, { color: theme.colors.text }]}>
              {record.moves}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      case 'hard': return theme.colors.error;
      default: return theme.colors.text;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>History & Records</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Statistics Overview */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Games"
              value={stats.totalGamesPlayed?.toString() || '0'}
              color={theme.colors.primary}
            />
            <StatCard
              title="Completed"
              value={stats.totalGamesCompleted?.toString() || '0'}
              color={theme.colors.success}
            />
            <StatCard
              title="Success Rate"
              value={`${Math.round(stats.completionRate || 0)}%`}
              color={theme.colors.accent}
            />
          </View>
        </View>

        {/* Best Times */}
        {Object.keys(stats.bestTimes || {}).length > 0 && (
          <View style={styles.bestTimesSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Best Times</Text>
            <View style={styles.bestTimesGrid}>
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(difficulty => {
                const bestTime = stats.bestTimes?.[difficulty];
                if (!bestTime) return null;
                
                return (
                  <View key={difficulty} style={[styles.bestTimeCard, { backgroundColor: theme.colors.surface, borderColor: getDifficultyColor(difficulty) }]}>
                    <Text style={[styles.bestTimeDifficulty, { color: getDifficultyColor(difficulty) }]}>
                      {difficulty.toUpperCase()}
                    </Text>
                    <Text style={[styles.bestTimeValue, { color: theme.colors.text }]}>
                      {formatDuration(bestTime)}
                    </Text>
                    <Text style={[styles.bestTimeLabel, { color: theme.colors.textSecondary }]}>
                      Best Time
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Game History */}
        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Game History</Text>
          
          {/* Difficulty Filter */}
          <View style={styles.difficultyTabs}>
            <DifficultyTab difficulty="all" label="All" />
            <DifficultyTab difficulty="easy" label="Easy" />
            <DifficultyTab difficulty="medium" label="Medium" />
            <DifficultyTab difficulty="hard" label="Hard" />
          </View>

          {/* Records List */}
          {filteredRecords.length > 0 ? (
            <View style={styles.recordsList}>
              {filteredRecords.slice(0, 20).map((record) => (
                <RecordItem key={record.id} record={record} />
              ))}
              {filteredRecords.length > 20 && (
                <Text style={[styles.moreRecordsText, { color: theme.colors.textSecondary }]}>
                  And {filteredRecords.length - 20} more games...
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                No games found for {selectedDifficulty === 'all' ? 'any difficulty' : selectedDifficulty}.
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
                Start playing to see your records here!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  bestTimesSection: {
    marginBottom: 30,
  },
  bestTimesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  bestTimeCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  bestTimeDifficulty: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bestTimeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bestTimeLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  historySection: {
    marginBottom: 30,
  },
  difficultyTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  difficultyTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  difficultyTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recordsList: {
    gap: 12,
  },
  recordItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordDifficulty: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 12,
  },
  recordStatus: {
    marginLeft: 12,
  },
  statusIcon: {
    fontSize: 16,
  },
  recordStats: {
    flexDirection: 'row',
    gap: 24,
  },
  recordStat: {
    flex: 1,
  },
  recordStatLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  recordStatValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  moreRecordsText: {
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 16,
  },
});
