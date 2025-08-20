import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface LeaderboardEntry {
  id: string;
  playerName: string;
  avatar: string;
  score: number;
  time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completedAt: number;
  rank: number;
  isCurrentUser?: boolean;
  country?: string;
  badge?: string;
}

interface LeaderboardProps {
  category?: 'speed' | 'score' | 'streak' | 'daily';
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  timeframe?: 'today' | 'week' | 'month' | 'all-time';
  onPlayerSelect?: (player: LeaderboardEntry) => void;
}

const mockLeaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    playerName: 'SpeedDemon',
    avatar: '🏆',
    score: 2840,
    time: 234,
    difficulty: 'hard',
    completedAt: Date.now() - 2 * 60 * 60 * 1000,
    rank: 1,
    country: '🇺🇸',
    badge: '👑',
  },
  {
    id: '2',
    playerName: 'PuzzleMaster',
    avatar: '🧠',
    score: 2650,
    time: 267,
    difficulty: 'hard',
    completedAt: Date.now() - 4 * 60 * 60 * 1000,
    rank: 2,
    country: '🇯🇵',
    badge: '💎',
  },
  {
    id: '3',
    playerName: 'LogicLord',
    avatar: '⚡',
    score: 2590,
    time: 289,
    difficulty: 'hard',
    completedAt: Date.now() - 6 * 60 * 60 * 1000,
    rank: 3,
    country: '🇩🇪',
    badge: '🔥',
  },
  {
    id: '4',
    playerName: 'QuickSolver',
    avatar: '🎯',
    score: 2450,
    time: 312,
    difficulty: 'medium',
    completedAt: Date.now() - 8 * 60 * 60 * 1000,
    rank: 4,
    country: '🇬🇧',
  },
  {
    id: '5',
    playerName: 'BrainBuster',
    avatar: '🧩',
    score: 2380,
    time: 356,
    difficulty: 'medium',
    completedAt: Date.now() - 12 * 60 * 60 * 1000,
    rank: 5,
    country: '🇫🇷',
  },
  {
    id: '6',
    playerName: 'You',
    avatar: '😊',
    score: 2200,
    time: 423,
    difficulty: 'medium',
    completedAt: Date.now() - 1 * 60 * 60 * 1000,
    rank: 12,
    isCurrentUser: true,
    country: '🌍',
    badge: '⭐',
  },
  {
    id: '7',
    playerName: 'NumberNinja',
    avatar: '🥷',
    score: 2150,
    time: 445,
    difficulty: 'medium',
    completedAt: Date.now() - 14 * 60 * 60 * 1000,
    rank: 15,
    country: '🇨🇦',
  },
  {
    id: '8',
    playerName: 'GridGuru',
    avatar: '🕉️',
    score: 2050,
    time: 498,
    difficulty: 'easy',
    completedAt: Date.now() - 18 * 60 * 60 * 1000,
    rank: 18,
    country: '🇮🇳',
  },
];

export default function Leaderboard({ 
  category = 'score',
  difficulty = 'all',
  timeframe = 'week',
  onPlayerSelect 
}: LeaderboardProps) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [slideAnim] = useState(new Animated.Value(0));
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData);

  useEffect(() => {
    // Animate leaderboard entries
    Animated.stagger(100, 
      leaderboardData.map((_, index) => 
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      )
    ).start();
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy':
        return theme.colors.success;
      case 'medium':
        return theme.colors.warning;
      case 'hard':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  };

  const CategoryTab = ({ 
    title, 
    isActive, 
    onPress 
  }: {
    title: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.categoryTab,
        {
          backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.categoryTabText,
          { color: isActive ? 'white' : theme.colors.text },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const LeaderboardEntry = ({ 
    entry, 
    index 
  }: { 
    entry: LeaderboardEntry; 
    index: number 
  }) => (
    <Animated.View
      style={[
        styles.entryContainer,
        {
          backgroundColor: entry.isCurrentUser ? theme.colors.primary + '20' : theme.colors.surface,
          borderColor: entry.isCurrentUser ? theme.colors.primary : theme.colors.border,
          borderWidth: entry.isCurrentUser ? 2 : 1,
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.entryContent}
        onPress={() => onPlayerSelect?.(entry)}
        activeOpacity={0.8}
      >
        {/* Rank */}
        <View style={styles.rankContainer}>
          <Text style={styles.rankMedal}>{getRankMedal(entry.rank)}</Text>
          <Text style={[styles.rankNumber, { color: theme.colors.text }]}>
            #{entry.rank}
          </Text>
        </View>

        {/* Player Info */}
        <View style={styles.playerInfo}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerAvatar}>{entry.avatar}</Text>
            <View style={styles.playerDetails}>
              <Text style={[styles.playerName, { color: theme.colors.text }]}>
                {entry.playerName} {entry.country}
              </Text>
              {entry.badge && (
                <Text style={styles.playerBadge}>{entry.badge} Elite Player</Text>
              )}
            </View>
          </View>
          
          <View style={styles.playerStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {entry.score.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Score
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: getDifficultyColor(entry.difficulty) }]}>
                {formatTime(entry.time)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Time
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor(entry.difficulty) }
              ]}>
                <Text style={styles.difficultyText}>
                  {entry.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trend Indicator */}
        <View style={styles.trendContainer}>
          <Text style={styles.trendIcon}>📈</Text>
          <Text style={[styles.completedTime, { color: theme.colors.textSecondary }]}>
            {new Date(entry.completedAt).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          🏆 Global Leaderboard
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Compete with players worldwide
        </Text>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        <CategoryTab
          title="🏆 Score"
          isActive={selectedCategory === 'score'}
          onPress={() => setSelectedCategory('score')}
        />
        <CategoryTab
          title="⚡ Speed"
          isActive={selectedCategory === 'speed'}
          onPress={() => setSelectedCategory('speed')}
        />
        <CategoryTab
          title="🔥 Streak"
          isActive={selectedCategory === 'streak'}
          onPress={() => setSelectedCategory('streak')}
        />
        <CategoryTab
          title="📅 Daily"
          isActive={selectedCategory === 'daily'}
          onPress={() => setSelectedCategory('daily')}
        />
      </ScrollView>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: theme.colors.textSecondary }]}>
            Difficulty:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'easy', 'medium', 'hard'].map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedDifficulty === diff ? getDifficultyColor(diff) : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedDifficulty(diff as any)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: selectedDifficulty === diff ? 'white' : theme.colors.text },
                  ]}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterGroup}>
          <Text style={[styles.filterLabel, { color: theme.colors.textSecondary }]}>
            Time:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['today', 'week', 'month', 'all-time'].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: selectedTimeframe === time ? theme.colors.primary : theme.colors.surface,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedTimeframe(time as any)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: selectedTimeframe === time ? 'white' : theme.colors.text },
                  ]}
                >
                  {time.charAt(0).toUpperCase() + time.slice(1).replace('-', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Leaderboard */}
      <ScrollView
        style={styles.leaderboardContainer}
        contentContainerStyle={styles.leaderboardContent}
        showsVerticalScrollIndicator={false}
      >
        {leaderboardData.map((entry, index) => (
          <LeaderboardEntry key={entry.id} entry={entry} index={index} />
        ))}

        {/* Load More Button */}
        <TouchableOpacity
          style={[styles.loadMoreButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            // Simulate loading more entries
            console.log('Loading more entries...');
          }}
        >
          <Text style={styles.loadMoreText}>Load More Players</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Current User Rank Indicator */}
      <View style={[styles.currentUserIndicator, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.currentUserText, { color: theme.colors.text }]}>
          Your Current Rank: <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>#12</Text>
        </Text>
        <TouchableOpacity
          style={[styles.viewProfileButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            const currentUser = leaderboardData.find(entry => entry.isCurrentUser);
            if (currentUser) onPlayerSelect?.(currentUser);
          }}
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: isTablet ? 24 : 16,
    alignItems: 'center',
  },
  title: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isTablet ? 16 : 14,
    textAlign: 'center',
  },
  categoryContainer: {
    flexGrow: 0,
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: isTablet ? 24 : 16,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 12 : 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryTabText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
  },
  filtersContainer: {
    paddingHorizontal: isTablet ? 24 : 16,
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: isTablet ? 16 : 12,
    paddingVertical: isTablet ? 8 : 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: '600',
  },
  leaderboardContainer: {
    flex: 1,
  },
  leaderboardContent: {
    paddingHorizontal: isTablet ? 24 : 16,
    paddingBottom: 100, // Space for current user indicator
  },
  entryContainer: {
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
  },
  rankContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: isTablet ? 60 : 50,
  },
  rankMedal: {
    fontSize: isTablet ? 24 : 20,
    marginBottom: 4,
  },
  rankNumber: {
    fontSize: isTablet ? 16 : 12,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  playerAvatar: {
    fontSize: isTablet ? 32 : 24,
    marginRight: 12,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: isTablet ? 18 : 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  playerBadge: {
    fontSize: isTablet ? 12 : 10,
    color: '#FFD700',
    fontWeight: '600',
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: isTablet ? 16 : 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: isTablet ? 12 : 10,
  },
  difficultyBadge: {
    paddingHorizontal: isTablet ? 8 : 6,
    paddingVertical: isTablet ? 4 : 2,
    borderRadius: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: isTablet ? 10 : 8,
    fontWeight: 'bold',
  },
  trendContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  trendIcon: {
    fontSize: isTablet ? 20 : 16,
    marginBottom: 4,
  },
  completedTime: {
    fontSize: isTablet ? 10 : 8,
    textAlign: 'center',
  },
  loadMoreButton: {
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 24 : 20,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 16,
  },
  loadMoreText: {
    color: 'white',
    fontSize: isTablet ? 16 : 14,
    fontWeight: 'bold',
  },
  currentUserIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isTablet ? 20 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  currentUserText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  viewProfileButton: {
    paddingHorizontal: isTablet ? 20 : 16,
    paddingVertical: isTablet ? 10 : 8,
    borderRadius: 20,
  },
  viewProfileText: {
    color: 'white',
    fontSize: isTablet ? 14 : 12,
    fontWeight: 'bold',
  },
});
