import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
  category: 'speed' | 'completion' | 'accuracy' | 'streak' | 'special';
}

interface AchievementSystemProps {
  visible: boolean;
  onClose: () => void;
  achievements: Achievement[];
  newlyUnlocked?: Achievement[];
}

export default function AchievementSystem({ 
  visible, 
  onClose, 
  achievements,
  newlyUnlocked = []
}: AchievementSystemProps) {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All', icon: '🏆' },
    { key: 'speed', label: 'Speed', icon: '⚡' },
    { key: 'completion', label: 'Completion', icon: '✅' },
    { key: 'accuracy', label: 'Accuracy', icon: '🎯' },
    { key: 'streak', label: 'Streak', icon: '🔥' },
    { key: 'special', label: 'Special', icon: '⭐' },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const renderAchievement = (achievement: Achievement) => {
    const isNewlyUnlocked = newlyUnlocked.some(a => a.id === achievement.id);
    
    return (
      <View
        key={achievement.id}
        style={[
          styles.achievementCard,
          {
            backgroundColor: achievement.unlocked 
              ? theme.colors.surface 
              : theme.colors.surface + '60',
            borderColor: isNewlyUnlocked 
              ? theme.colors.primary 
              : theme.colors.border,
            borderWidth: isNewlyUnlocked ? 2 : 1,
          }
        ]}
      >
        <View style={styles.achievementHeader}>
          <Text style={[
            styles.achievementIcon,
            { 
              opacity: achievement.unlocked ? 1 : 0.4,
              transform: [{ scale: isNewlyUnlocked ? 1.1 : 1 }]
            }
          ]}>
            {achievement.icon}
          </Text>
          <View style={styles.achievementInfo}>
            <Text style={[
              styles.achievementTitle,
              { 
                color: achievement.unlocked ? theme.colors.text : theme.colors.textSecondary,
                fontWeight: isNewlyUnlocked ? '700' : '600'
              }
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.achievementDescription,
              { color: theme.colors.textSecondary }
            ]}>
              {achievement.description}
            </Text>
          </View>
          {achievement.unlocked && (
            <View style={[styles.unlockedBadge, { backgroundColor: theme.colors.success }]}>
              <Text style={styles.unlockedText}>✓</Text>
            </View>
          )}
        </View>

        {/* Progress Bar for Partially Completed Achievements */}
        {achievement.maxProgress && achievement.progress !== undefined && (
          <View style={styles.progressSection}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: achievement.unlocked ? theme.colors.success : theme.colors.primary,
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              {achievement.progress}/{achievement.maxProgress}
            </Text>
          </View>
        )}

        {/* Unlock Date */}
        {achievement.unlocked && achievement.unlockedAt && (
          <Text style={[styles.unlockDate, { color: theme.colors.textSecondary }]}>
            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
          </Text>
        )}

        {/* New Badge */}
        {isNewlyUnlocked && (
          <View style={[styles.newBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.newBadgeText}>NEW!</Text>
          </View>
        )}
      </View>
    );
  };

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
              🏆 Achievements
            </Text>
            <Text style={[styles.progress, { color: theme.colors.textSecondary }]}>
              {unlockedCount}/{totalCount} Unlocked
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: theme.colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter */}
          <ScrollView 
            horizontal 
            style={styles.categoryContainer}
            showsHorizontalScrollIndicator={false}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: selectedCategory === category.key 
                      ? theme.colors.primary 
                      : theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryLabel,
                  {
                    color: selectedCategory === category.key 
                      ? theme.colors.background 
                      : theme.colors.text
                  }
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Achievement List */}
          <ScrollView style={styles.achievementsList}>
            {filteredAchievements.map(renderAchievement)}
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
    width: '90%',
    maxHeight: '80%',
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
  progress: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
    marginLeft: 16,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  categoryContainer: {
    padding: 16,
    maxHeight: 60,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementsList: {
    flex: 1,
    padding: 16,
  },
  achievementCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    position: 'relative',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  unlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  progressSection: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
  },
  unlockDate: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    elevation: 3,
  },
  newBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
});
