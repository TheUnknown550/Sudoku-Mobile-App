import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

interface NotificationProps {
  id: string;
  type: 'achievement' | 'milestone' | 'streak' | 'personal-best' | 'daily-challenge';
  title: string;
  message: string;
  icon: string;
  color?: string;
  duration?: number;
  onDismiss?: (id: string) => void;
  actionButton?: {
    text: string;
    onPress: () => void;
  };
}

interface NotificationSystemProps {
  notifications: NotificationProps[];
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  icon,
  color,
  duration = 4000,
  onDismiss,
  actionButton,
}) => {
  const { theme } = useTheme();
  const [slideAnim] = useState(new Animated.Value(-width));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(opacityAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      handleDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    // Exit animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.(id);
    });
  };

  const getTypeColor = () => {
    if (color) return color;
    
    switch (type) {
      case 'achievement':
        return '#FFD700'; // Gold
      case 'milestone':
        return theme.colors.primary;
      case 'streak':
        return '#FF6B35'; // Orange
      case 'personal-best':
        return '#4ECDC4'; // Teal
      case 'daily-challenge':
        return '#A8E6CF'; // Light green
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.notification,
        {
          backgroundColor: theme.colors.surface,
          borderLeftColor: getTypeColor(),
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
          ],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.notificationContent}
        onPress={handleDismiss}
        activeOpacity={0.9}
      >
        <View style={styles.iconContainer}>
          <Text style={[styles.notificationIcon, { color: getTypeColor() }]}>
            {icon}
          </Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
            {message}
          </Text>
        </View>

        {actionButton && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: getTypeColor() }]}
            onPress={actionButton.onPress}
          >
            <Text style={styles.actionButtonText}>{actionButton.text}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss,
}) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {notifications.map((notification, index) => (
        <View
          key={notification.id}
          style={[styles.notificationWrapper, { top: 60 + index * 90 }]}
        >
          <NotificationItem
            {...notification}
            onDismiss={onDismiss}
          />
        </View>
      ))}
    </View>
  );
};

// Achievement notification component
export const AchievementNotification: React.FC<{
  visible: boolean;
  achievement: {
    title: string;
    description: string;
    icon: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  };
  onClose: () => void;
}> = ({ visible, achievement, onClose }) => {
  const { theme } = useTheme();
  const [scaleAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [particles] = useState(
    Array.from({ length: 12 }, () => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1),
    }))
  );

  useEffect(() => {
    if (visible) {
      // Main achievement animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          tension: 100,
          friction: 6,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
      ]).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      // Particle explosion animation
      particles.forEach((particle, index) => {
        const angle = (index / particles.length) * Math.PI * 2;
        const distance = 100;
        
        Animated.parallel([
          Animated.timing(particle.translateX, {
            toValue: Math.cos(angle) * distance,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: Math.sin(angle) * distance,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 1.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: 1300,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      });

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'common':
        return '#95A5A6';
      case 'rare':
        return '#3498DB';
      case 'epic':
        return '#9B59B6';
      case 'legendary':
        return '#F39C12';
      default:
        return '#FFD700';
    }
  };

  const getRarityGlow = () => {
    const color = getRarityColor();
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 10,
    };
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.achievementModalContainer}>
        <TouchableOpacity
          style={styles.achievementModalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.achievementContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: getRarityColor(),
                transform: [
                  { scale: scaleAnim },
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
              getRarityGlow(),
            ]}
          >
            {/* Particle effects */}
            {particles.map((particle, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.particle,
                  {
                    backgroundColor: getRarityColor(),
                    transform: [
                      { translateX: particle.translateX },
                      { translateY: particle.translateY },
                      { scale: particle.scale },
                    ],
                    opacity: particle.opacity,
                  },
                ]}
              />
            ))}

            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <Text style={[styles.achievementLabel, { color: getRarityColor() }]}>
              ACHIEVEMENT UNLOCKED!
            </Text>
            <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
              {achievement.title}
            </Text>
            <Text style={[styles.achievementDesc, { color: theme.colors.textSecondary }]}>
              {achievement.description}
            </Text>
            
            {achievement.rarity && (
              <View style={[styles.rarityBadge, { backgroundColor: getRarityColor() }]}>
                <Text style={styles.rarityText}>
                  {achievement.rarity.toUpperCase()}
                </Text>
              </View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id' | 'onDismiss'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Pre-built notification types
  const showAchievement = (title: string, message: string, icon: string = '🏆') => {
    addNotification({
      type: 'achievement',
      title,
      message,
      icon,
      color: '#FFD700',
    });
  };

  const showMilestone = (title: string, message: string, icon: string = '🎯') => {
    addNotification({
      type: 'milestone',
      title,
      message,
      icon,
    });
  };

  const showStreak = (count: number, icon: string = '🔥') => {
    addNotification({
      type: 'streak',
      title: `${count} Game Streak!`,
      message: `You're on fire! Keep the momentum going.`,
      icon,
    });
  };

  const showPersonalBest = (time: string, difficulty: string) => {
    addNotification({
      type: 'personal-best',
      title: 'New Personal Best!',
      message: `${time} on ${difficulty} difficulty`,
      icon: '⚡',
    });
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    showAchievement,
    showMilestone,
    showStreak,
    showPersonalBest,
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000, // Higher than modals to ensure notifications appear above everything
  },
  notificationWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
  },
  notification: {
    borderRadius: 12,
    borderLeftWidth: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  notificationIcon: {
    fontSize: isTablet ? 32 : 24,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: isTablet ? 18 : 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: isTablet ? 14 : 12,
    lineHeight: isTablet ? 20 : 16,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: isTablet ? 12 : 10,
    fontWeight: 'bold',
  },
  // Achievement Modal Styles
  achievementModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  achievementContainer: {
    width: isTablet ? 400 : 300,
    padding: 32,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  achievementIcon: {
    fontSize: isTablet ? 80 : 60,
    marginBottom: 16,
  },
  achievementLabel: {
    fontSize: isTablet ? 16 : 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: isTablet ? 24 : 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementDesc: {
    fontSize: isTablet ? 16 : 12,
    textAlign: 'center',
    lineHeight: isTablet ? 24 : 18,
    marginBottom: 16,
  },
  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rarityText: {
    color: 'white',
    fontSize: isTablet ? 10 : 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
