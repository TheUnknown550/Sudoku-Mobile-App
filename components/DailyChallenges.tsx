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

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'speed' | 'accuracy' | 'completion' | 'special';
  target: number;
  progress: number;
  reward: {
    type: 'points' | 'achievement' | 'unlock';
    value: number | string;
    description: string;
  };
  timeLimit?: number; // in minutes
  isDaily?: boolean;
  isWeekly?: boolean;
  expiresAt?: number; // timestamp
  isCompleted: boolean;
  completedAt?: number;
}

interface DailyChallengesProps {
  challenges?: Challenge[];
  onChallengeSelect?: (challenge: Challenge) => void;
  onClaimReward?: (challenge: Challenge) => void;
}

const mockChallenges: Challenge[] = [
  {
    id: 'daily-speed-1',
    title: 'Speed Demon',
    description: 'Complete 3 easy puzzles in under 5 minutes each',
    icon: '⚡',
    difficulty: 'easy',
    category: 'speed',
    target: 3,
    progress: 1,
    reward: {
      type: 'points',
      value: 100,
      description: '+100 XP and Speed Achievement',
    },
    timeLimit: 15,
    isDaily: true,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    isCompleted: false,
  },
  {
    id: 'daily-accuracy-1',
    title: 'Perfect Precision',
    description: 'Complete a medium puzzle without any mistakes',
    icon: '🎯',
    difficulty: 'medium',
    category: 'accuracy',
    target: 1,
    progress: 0,
    reward: {
      type: 'achievement',
      value: 'perfectionist',
      description: 'Unlock Perfectionist Badge',
    },
    isDaily: true,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    isCompleted: false,
  },
  {
    id: 'daily-completion-1',
    title: 'Marathon Master',
    description: 'Complete 5 puzzles of any difficulty',
    icon: '🏃',
    difficulty: 'easy',
    category: 'completion',
    target: 5,
    progress: 2,
    reward: {
      type: 'points',
      value: 200,
      description: '+200 XP and Endurance Badge',
    },
    isDaily: true,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    isCompleted: false,
  },
  {
    id: 'weekly-special-1',
    title: 'Theme Explorer',
    description: 'Try all 6 different themes while playing',
    icon: '🎨',
    difficulty: 'easy',
    category: 'special',
    target: 6,
    progress: 3,
    reward: {
      type: 'unlock',
      value: 'golden_theme',
      description: 'Unlock Golden Theme',
    },
    isWeekly: true,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    isCompleted: false,
  },
  {
    id: 'daily-completed-1',
    title: 'Early Bird',
    description: 'Complete a puzzle before 9 AM',
    icon: '🌅',
    difficulty: 'easy',
    category: 'special',
    target: 1,
    progress: 1,
    reward: {
      type: 'points',
      value: 50,
      description: '+50 XP Bonus',
    },
    isDaily: true,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    isCompleted: true,
    completedAt: Date.now() - 2 * 60 * 60 * 1000,
  },
];

export default function DailyChallenges({ 
  challenges = mockChallenges,
  onChallengeSelect,
  onClaimReward 
}: DailyChallengesProps) {
  const { theme } = useTheme();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [refreshAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Refresh animation when component mounts
    Animated.spring(refreshAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  const formatTimeRemaining = (expiresAt: number): string => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'speed':
        return '#FF6B35';
      case 'accuracy':
        return '#4ECDC4';
      case 'completion':
        return '#95E1D3';
      case 'special':
        return '#C7A2DA';
      default:
        return theme.colors.primary;
    }
  };

  const ProgressBar = ({ progress, target, color }: { progress: number; target: number; color: string }) => {
    const percentage = Math.min(100, (progress / target) * 100);
    const [animatedWidth] = useState(new Animated.Value(0));

    useEffect(() => {
      Animated.timing(animatedWidth, {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, [percentage]);

    return (
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor: color + '20' }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: color,
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
          {progress}/{target}
        </Text>
      </View>
    );
  };

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => (
    <TouchableOpacity
      style={[
        styles.challengeCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: challenge.isCompleted ? theme.colors.success : getCategoryColor(challenge.category),
        },
        challenge.isCompleted && styles.completedCard,
      ]}
      onPress={() => {
        setSelectedChallenge(challenge);
        onChallengeSelect?.(challenge);
      }}
      activeOpacity={0.8}
    >
      <View style={styles.challengeHeader}>
        <View style={styles.challengeIconContainer}>
          <Text style={styles.challengeIcon}>{challenge.icon}</Text>
          {challenge.isDaily && (
            <View style={[styles.typeBadge, { backgroundColor: '#FF6B35' }]}>
              <Text style={styles.typeBadgeText}>DAILY</Text>
            </View>
          )}
          {challenge.isWeekly && (
            <View style={[styles.typeBadge, { backgroundColor: '#9B59B6' }]}>
              <Text style={styles.typeBadgeText}>WEEKLY</Text>
            </View>
          )}
        </View>
        
        <View style={styles.challengeInfo}>
          <Text style={[styles.challengeTitle, { color: theme.colors.text }]}>
            {challenge.title}
          </Text>
          <Text style={[styles.challengeDescription, { color: theme.colors.textSecondary }]}>
            {challenge.description}
          </Text>
        </View>

        {challenge.isCompleted ? (
          <View style={[styles.completedBadge, { backgroundColor: theme.colors.success }]}>
            <Text style={styles.completedText}>✓</Text>
          </View>
        ) : (
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
            <Text style={styles.difficultyText}>
              {challenge.difficulty.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.challengeProgress}>
        <ProgressBar
          progress={challenge.progress}
          target={challenge.target}
          color={getCategoryColor(challenge.category)}
        />
      </View>

      <View style={styles.challengeFooter}>
        <View style={styles.rewardInfo}>
          <Text style={[styles.rewardLabel, { color: theme.colors.textSecondary }]}>
            Reward:
          </Text>
          <Text style={[styles.rewardText, { color: getCategoryColor(challenge.category) }]}>
            {challenge.reward.description}
          </Text>
        </View>

        {challenge.expiresAt && (
          <Text style={[styles.timeRemaining, { color: theme.colors.warning }]}>
            {formatTimeRemaining(challenge.expiresAt)}
          </Text>
        )}
      </View>

      {challenge.isCompleted && (
        <TouchableOpacity
          style={[styles.claimButton, { backgroundColor: theme.colors.success }]}
          onPress={() => onClaimReward?.(challenge)}
        >
          <Text style={styles.claimButtonText}>Claim Reward</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const activeChallenges = challenges.filter(c => !c.isCompleted);
  const completedChallenges = challenges.filter(c => c.isCompleted);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          opacity: refreshAnimation,
          transform: [
            {
              translateY: refreshAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            📅 Daily Challenges
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Complete challenges to earn rewards and unlock achievements
          </Text>
        </View>

        {/* Challenge Stats */}
        <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              {activeChallenges.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Active
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.success }]}>
              {completedChallenges.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Completed
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
              {challenges.reduce((sum, c) => sum + (c.reward.type === 'points' ? c.reward.value as number : 0), 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Total XP
            </Text>
          </View>
        </View>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              🎯 Active Challenges
            </Text>
            {activeChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </View>
        )}

        {/* Completed Challenges */}
        {completedChallenges.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              ✅ Completed Challenges
            </Text>
            {completedChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </View>
        )}

        {/* Refresh Button */}
        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            Animated.sequence([
              Animated.timing(refreshAnimation, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
              }),
              Animated.spring(refreshAnimation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 6,
              }),
            ]).start();
          }}
        >
          <Text style={styles.refreshButtonText}>🔄 Refresh Challenges</Text>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
    fontSize: isTablet ? 16 : 14,
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: isTablet ? 20 : 16,
    borderRadius: 12,
    marginBottom: isTablet ? 32 : 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: isTablet ? 28 : 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
  },
  section: {
    marginBottom: isTablet ? 32 : 24,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  challengeCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: isTablet ? 20 : 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedCard: {
    opacity: 0.8,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  challengeIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  challengeIcon: {
    fontSize: isTablet ? 32 : 24,
    marginBottom: 4,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeBadgeText: {
    color: 'white',
    fontSize: isTablet ? 8 : 6,
    fontWeight: 'bold',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: isTablet ? 18 : 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: isTablet ? 14 : 12,
    lineHeight: isTablet ? 20 : 16,
  },
  completedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    color: 'white',
    fontSize: isTablet ? 10 : 8,
    fontWeight: 'bold',
  },
  challengeProgress: {
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardLabel: {
    fontSize: isTablet ? 12 : 10,
    marginBottom: 2,
  },
  rewardText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
  },
  timeRemaining: {
    fontSize: isTablet ? 12 : 10,
    fontWeight: '600',
  },
  claimButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: 'white',
    fontSize: isTablet ? 14 : 12,
    fontWeight: 'bold',
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'center',
    marginTop: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: isTablet ? 16 : 14,
    fontWeight: 'bold',
  },
});
