import React, { useState } from 'react';
import {
    Dimensions,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { AchievementNotification, NotificationSystem, useNotifications } from './NotificationSystem';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

interface GameEvent {
  type: 'number_placed' | 'puzzle_completed' | 'hint_used' | 'mistake_made' | 'streak_updated' | 'time_milestone';
  data: {
    difficulty?: 'easy' | 'medium' | 'hard';
    time?: number;
    moves?: number;
    hintsUsed?: number;
    mistakes?: number;
    streakCount?: number;
    isNewRecord?: boolean;
    isPerfectGame?: boolean;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'speed' | 'accuracy' | 'completion' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (event: GameEvent, gameStats: any) => boolean;
  points: number;
  unlocked: boolean;
  unlockedAt?: number;
}

// Define achievement conditions
const achievements: Achievement[] = [
  {
    id: 'first_completion',
    title: 'First Victory',
    description: 'Complete your first Sudoku puzzle',
    icon: '🏆',
    category: 'completion',
    rarity: 'common',
    condition: (event) => event.type === 'puzzle_completed',
    points: 100,
    unlocked: false,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete an easy puzzle in under 3 minutes',
    icon: '⚡',
    category: 'speed',
    rarity: 'rare',
    condition: (event) => 
      event.type === 'puzzle_completed' && 
      event.data.difficulty === 'easy' && 
      event.data.time! < 180,
    points: 250,
    unlocked: false,
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete a puzzle without making any mistakes',
    icon: '💎',
    category: 'accuracy',
    rarity: 'epic',
    condition: (event) => 
      event.type === 'puzzle_completed' && 
      event.data.isPerfectGame === true,
    points: 500,
    unlocked: false,
  },
  {
    id: 'streak_master',
    title: 'Streak Master',
    description: 'Complete 10 puzzles in a row',
    icon: '🔥',
    category: 'streak',
    rarity: 'epic',
    condition: (event) => 
      event.type === 'streak_updated' && 
      event.data.streakCount! >= 10,
    points: 750,
    unlocked: false,
  },
  {
    id: 'hard_conqueror',
    title: 'Hard Mode Conqueror',
    description: 'Complete your first hard difficulty puzzle',
    icon: '🎯',
    category: 'completion',
    rarity: 'rare',
    condition: (event) => 
      event.type === 'puzzle_completed' && 
      event.data.difficulty === 'hard',
    points: 400,
    unlocked: false,
  },
  {
    id: 'lightning_fast',
    title: 'Lightning Fast',
    description: 'Complete any puzzle in under 2 minutes',
    icon: '⚡',
    category: 'speed',
    rarity: 'legendary',
    condition: (event) => 
      event.type === 'puzzle_completed' && 
      event.data.time! < 120,
    points: 1000,
    unlocked: false,
  },
  {
    id: 'no_hints_hero',
    title: 'No Hints Hero',
    description: 'Complete a medium puzzle without using any hints',
    icon: '🧠',
    category: 'accuracy',
    rarity: 'rare',
    condition: (event) => 
      event.type === 'puzzle_completed' && 
      event.data.difficulty === 'medium' && 
      event.data.hintsUsed === 0,
    points: 300,
    unlocked: false,
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a puzzle before 8 AM',
    icon: '🌅',
    category: 'special',
    rarity: 'common',
    condition: (event) => 
      event.type === 'puzzle_completed' && 
      new Date().getHours() < 8,
    points: 150,
    unlocked: false,
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a puzzle after 10 PM',
    icon: '🦉',
    category: 'special',
    rarity: 'common',
    condition: (event) => 
      event.type === 'puzzle_completed' && 
      new Date().getHours() >= 22,
    points: 150,
    unlocked: false,
  },
  {
    id: 'efficiency_expert',
    title: 'Efficiency Expert',
    description: 'Complete a puzzle with less than 100 moves',
    icon: '🎪',
    category: 'accuracy',
    rarity: 'rare',
    condition: (event) => 
      event.type === 'puzzle_completed' && 
      event.data.moves! < 100,
    points: 350,
    unlocked: false,
  },
];

interface GamestatsMonitorProps {
  children: React.ReactNode;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

export const GameStatsMonitor: React.FC<GamestatsMonitorProps> = ({ 
  children, 
  onAchievementUnlocked 
}) => {
  const { theme } = useTheme();
  const notifications = useNotifications();
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  
  // Mock game stats - in a real app this would come from a context/storage
  const [gameStats, setGameStats] = useState({
    totalGamesPlayed: 5,
    completedGames: 3,
    currentStreak: 2,
    bestTimes: { easy: 240, medium: 480, hard: 1200 },
    perfectGames: 1,
    totalPoints: 750,
  });

  const checkAchievements = (event: GameEvent) => {
    const newlyUnlocked: Achievement[] = [];
    
    const updatedAchievements = userAchievements.map(achievement => {
      if (!achievement.unlocked && achievement.condition(event, gameStats)) {
        const unlockedAchievement = {
          ...achievement,
          unlocked: true,
          unlockedAt: Date.now(),
        };
        newlyUnlocked.push(unlockedAchievement);
        return unlockedAchievement;
      }
      return achievement;
    });

    if (newlyUnlocked.length > 0) {
      setUserAchievements(updatedAchievements);
      
      // Show achievement notifications
      newlyUnlocked.forEach((achievement, index) => {
        setTimeout(() => {
          // Show notification
          notifications.showAchievement(
            'Achievement Unlocked!',
            `${achievement.title} - ${achievement.description}`,
            achievement.icon
          );

          // Show detailed modal for epic/legendary achievements
          if (achievement.rarity === 'epic' || achievement.rarity === 'legendary') {
            setTimeout(() => {
              setCurrentAchievement(achievement);
              setShowAchievementModal(true);
            }, 1000);
          }

          onAchievementUnlocked?.(achievement);
        }, index * 1500); // Stagger multiple achievements
      });

      // Update game stats with points
      const pointsEarned = newlyUnlocked.reduce((sum, ach) => sum + ach.points, 0);
      setGameStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + pointsEarned,
      }));

      // Show points notification
      if (pointsEarned > 0) {
        setTimeout(() => {
          notifications.addNotification({
            type: 'milestone',
            title: 'Points Earned!',
            message: `+${pointsEarned} XP from achievements`,
            icon: '✨',
            color: '#FFD700',
          });
        }, newlyUnlocked.length * 1500 + 500);
      }
    }
  };

  // Simulate game events for demo purposes
  const simulateGameEvents = () => {
    const demoEvents: GameEvent[] = [
      {
        type: 'puzzle_completed',
        data: {
          difficulty: 'easy',
          time: 150, // 2.5 minutes - triggers Speed Demon
          moves: 85,  // Under 100 - triggers Efficiency Expert
          hintsUsed: 0,
          mistakes: 0,
          isPerfectGame: true, // Triggers Perfectionist
        },
      },
      {
        type: 'streak_updated',
        data: {
          streakCount: 10, // Triggers Streak Master
        },
      },
      {
        type: 'puzzle_completed',
        data: {
          difficulty: 'hard',
          time: 900,
          moves: 150,
          hintsUsed: 2,
          mistakes: 1,
        },
      },
    ];

    // Process events with delays for demo
    demoEvents.forEach((event, index) => {
      setTimeout(() => {
        checkAchievements(event);
      }, index * 3000);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {children}
      
      {/* Notification System */}
      <NotificationSystem
        notifications={notifications.notifications}
        onDismiss={notifications.dismissNotification}
      />

      {/* Achievement Modal */}
      {currentAchievement && (
        <AchievementNotification
          visible={showAchievementModal}
          achievement={currentAchievement}
          onClose={() => {
            setShowAchievementModal(false);
            setCurrentAchievement(null);
          }}
        />
      )}

      {/* Demo Button - Remove in production */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          backgroundColor: theme.colors.primary,
          padding: 12,
          borderRadius: 25,
          zIndex: 999,
        }}
        onPress={simulateGameEvents}
      >
        <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
          🏆 Demo Achievements
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Hook to use achievements in components
export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  const getUnlockedAchievements = () => achievements.filter(a => a.unlocked);
  const getLockedAchievements = () => achievements.filter(a => !a.unlocked);
  const getTotalPoints = () => achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const getCompletionPercentage = () => {
    const unlocked = getUnlockedAchievements().length;
    return Math.round((unlocked / achievements.length) * 100);
  };

  const triggerGameEvent = (event: GameEvent) => {
    // This would integrate with the GameStatsMonitor
    console.log('Game event triggered:', event);
  };

  return {
    achievements,
    unlockedAchievements: getUnlockedAchievements(),
    lockedAchievements: getLockedAchievements(),
    totalPoints: getTotalPoints(),
    completionPercentage: getCompletionPercentage(),
    triggerGameEvent,
  };
};

export default GameStatsMonitor;
