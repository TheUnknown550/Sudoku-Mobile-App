import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';
import AchievementSystem, { Achievement } from './AchievementSystem';
import DailyChallenges from './DailyChallenges';
import GameAnalytics from './GameAnalytics';
import Leaderboard from './Leaderboard';
import { MusicPlayer } from './MusicPlayer';
import StatsDashboard from './StatsDashboard';
import ThemeSelector from './ThemeSelector';

// Get screen dimensions and calculate responsive values
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;
const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { theme, isDark, toggleTheme, currentTheme } = useTheme();
  const { isPlaying, volume, isMusicEnabled, soundEffectsEnabled, toggleMusic, setVolume, toggleMusicEnabled, toggleSoundEffects } = useAudio();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStatsDashboard, setShowStatsDashboard] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showGameAnalytics, setShowGameAnalytics] = useState(false);
  const [showDailyChallenges, setShowDailyChallenges] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [highlightConflicts, setHighlightConflicts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoCheckMode, setAutoCheckMode] = useState(false);
  const [smartHints, setSmartHints] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkModeAuto, setDarkModeAuto] = useState(false);

  // Handler functions
  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete:\n• All saved games\n• Game history\n• Statistics\n• Achievement progress\n\nThis action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would clear AsyncStorage
            Alert.alert('Success', 'All data has been reset. The app will restart.');
            // Here you would call: AsyncStorage.clear() and restart the app
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your game data will be exported to a file that you can share or backup.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            Alert.alert('Success', 'Game data exported successfully!');
            // In a real app, this would generate and share a backup file
          }
        }
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Select a backup file to restore your game data. This will overwrite current data.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Import', 
          onPress: () => {
            Alert.alert('Success', 'Game data imported successfully!');
            // In a real app, this would open file picker and restore data
          }
        }
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'We love hearing from our players! How can we improve?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rate App', onPress: () => Alert.alert('Thanks!', 'Redirecting to app store...') },
        { text: 'Report Bug', onPress: () => Alert.alert('Thanks!', 'Opening bug report form...') },
        { text: 'Suggest Feature', onPress: () => Alert.alert('Thanks!', 'Opening suggestion form...') }
      ]
    );
  };

  // Sample achievements data
  const sampleAchievements: Achievement[] = [
    {
      id: 'first-win',
      title: 'First Victory',
      description: 'Complete your first Sudoku puzzle',
      icon: '🏆',
      unlocked: true,
      unlockedAt: Date.now() - 86400000,
      category: 'completion'
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete an easy puzzle in under 3 minutes',
      icon: '⚡',
      unlocked: false,
      progress: 2,
      maxProgress: 1,
      category: 'speed'
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Complete a puzzle without making any mistakes',
      icon: '💎',
      unlocked: false,
      category: 'accuracy'
    },
    {
      id: 'daily-grind',
      title: 'Daily Grind',
      description: 'Complete 7 daily challenges in a row',
      icon: '📅',
      unlocked: false,
      progress: 3,
      maxProgress: 7,
      category: 'streak'
    }
  ];

  const SettingItem = ({
    title,
    subtitle,
    rightComponent,
  }: {
    title: string;
    subtitle?: string;
    rightComponent: React.ReactNode;
  }) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.tabletScrollContent
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Create responsive grid layout for tablets */}
        <View style={isTablet ? styles.tabletGrid : styles.mobileLayout}>
          {/* Left Column for Tablets, Single Column for Mobile */}
          <View style={isTablet ? styles.leftColumn : styles.fullWidth}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <SettingItem
              title="Dark Theme"
              subtitle="Switch between light and dark themes"
              rightComponent={
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
                />
              }
            />
            <SettingItem
              title="Auto Dark Mode"
              subtitle="Follow system theme automatically"
              rightComponent={
                <Switch
                  value={darkModeAuto}
                  onValueChange={(value) => {
                    setDarkModeAuto(value);
                    Alert.alert('Auto Theme', value ? 'Theme will follow system settings' : 'Manual theme control enabled');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowThemeSelector(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🎨 Theme Gallery</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Current: {theme.name} • Choose from beautiful themes
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Browse ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Font Size Options', 'Select text size:\n🔸 Small\n🔹 Medium (Current)\n🔸 Large\n🔸 Extra Large', [
                { text: 'Small', onPress: () => Alert.alert('Applied', 'Small font size applied') },
                { text: 'Medium', onPress: () => Alert.alert('Applied', 'Medium font size applied') },
                { text: 'Large', onPress: () => Alert.alert('Applied', 'Large font size applied') },
                { text: 'Cancel', style: 'cancel' }
              ])}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>📝 Font Size</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Adjust text size for better readability
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Medium ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Game Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Game Settings</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <SettingItem
              title="Auto-save Game"
              subtitle="Automatically save your progress"
              rightComponent={
                <Switch
                  value={autoSave}
                  onValueChange={setAutoSave}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              title="Show Timer"
              subtitle="Display game timer while playing"
              rightComponent={
                <Switch
                  value={showTimer}
                  onValueChange={setShowTimer}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              title="Highlight Conflicts"
              subtitle="Highlight invalid number placements"
              rightComponent={
                <Switch
                  value={highlightConflicts}
                  onValueChange={setHighlightConflicts}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              title="Auto-Check Mode"
              subtitle="Automatically validate moves as you play"
              rightComponent={
                <Switch
                  value={autoCheckMode}
                  onValueChange={setAutoCheckMode}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              title="Smart Hints"
              subtitle="Provide learning-focused hints"
              rightComponent={
                <Switch
                  value={smartHints}
                  onValueChange={setSmartHints}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Difficulty Preference', 'Choose your preferred starting difficulty', [
                { text: 'Easy', onPress: () => Alert.alert('Set!', 'Default difficulty set to Easy') },
                { text: 'Medium', onPress: () => Alert.alert('Set!', 'Default difficulty set to Medium') },
                { text: 'Hard', onPress: () => Alert.alert('Set!', 'Default difficulty set to Hard') },
                { text: 'Cancel', style: 'cancel' }
              ])}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🎯 Default Difficulty</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Set preferred difficulty for new games
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Medium ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Audio & Haptics Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Audio & Haptics</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <SettingItem
              title="Background Music"
              subtitle="Play relaxing background music while playing"
              rightComponent={
                <Switch
                  value={isMusicEnabled}
                  onValueChange={async (value) => {
                    await toggleMusicEnabled();
                    Alert.alert('Background Music', value ? 'Background music enabled' : 'Background music disabled');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            {isMusicEnabled && (
              <TouchableOpacity 
                style={styles.aboutItem}
                onPress={async () => {
                  await toggleMusic();
                  Alert.alert('Music Control', isPlaying ? 'Music paused' : 'Music started playing');
                }}
              >
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                    🎵 Music Playback
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                    {isPlaying ? 'Currently playing' : 'Tap to play music'}
                  </Text>
                </View>
                <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>
                  {isPlaying ? 'Pause' : 'Play'} ›
                </Text>
              </TouchableOpacity>
            )}
            <SettingItem
              title="Sound Effects"
              subtitle="Play sounds for actions and achievements"
              rightComponent={
                <Switch
                  value={soundEffectsEnabled}
                  onValueChange={async (value) => {
                    await toggleSoundEffects();
                    Alert.alert('Sound Effects', value ? 'Sound effects enabled' : 'Sound effects disabled');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              title="Haptic Feedback"
              subtitle="Vibrate on interactions and feedback"
              rightComponent={
                <Switch
                  value={hapticFeedback}
                  onValueChange={(value) => {
                    setHapticFeedback(value);
                    Alert.alert('Haptic Feedback', value ? 'Vibration feedback enabled' : 'Vibration feedback disabled');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Volume Control', `Adjust sound levels:\n🔊 Master Volume: ${Math.round(volume * 100)}%\n🎵 Music: ${isMusicEnabled ? Math.round(volume * 100) + '%' : 'OFF'}\n🔔 Sound Effects: ${soundEffectsEnabled ? '100%' : 'OFF'}`, [
                { text: 'Low (30%)', onPress: async () => { await setVolume(0.3); Alert.alert('Applied', 'Volume set to Low'); } },
                { text: 'Medium (60%)', onPress: async () => { await setVolume(0.6); Alert.alert('Applied', 'Volume set to Medium'); } },
                { text: 'High (100%)', onPress: async () => { await setVolume(1.0); Alert.alert('Applied', 'Volume set to High'); } },
                { text: 'Cancel', style: 'cancel' }
              ])}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🔊 Volume Level</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Adjust music and sound effects volume
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>
                {Math.round(volume * 100)}% ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Music Player Component */}
        {isMusicEnabled && (
          <MusicPlayer visible={true} compact={false} />
        )}

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <SettingItem
              title="Push Notifications"
              subtitle="Receive daily challenges and achievements"
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={(value) => {
                    setNotifications(value);
                    Alert.alert('Notifications', value ? 'Notifications enabled' : 'Notifications disabled');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Notification Settings', 'Customize notification types:\n• Daily challenges: ON\n• Achievement unlocks: ON\n• Reminders: OFF\n• Updates: ON')}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🔔 Notification Types</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Choose which notifications to receive
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Customize ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Game Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Game Preferences</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <SettingItem
              title="Show Timer"
              subtitle="Display elapsed time during gameplay"
              rightComponent={
                <Switch
                  value={showTimer}
                  onValueChange={(value) => {
                    setShowTimer(value);
                    Alert.alert('Timer Setting', value ? 'Timer will be shown during games' : 'Timer will be hidden during games');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              title="Auto-Save Progress"
              subtitle="Automatically save game progress"
              rightComponent={
                <Switch
                  value={autoSave}
                  onValueChange={(value) => {
                    setAutoSave(value);
                    Alert.alert('Auto-Save', value ? 'Games will be saved automatically' : 'Manual save only');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              title="Highlight Conflicts"
              subtitle="Show conflicting numbers in red"
              rightComponent={
                <Switch
                  value={highlightConflicts}
                  onValueChange={(value) => {
                    setHighlightConflicts(value);
                    Alert.alert('Conflict Highlighting', value ? 'Conflicts will be highlighted' : 'No conflict highlighting');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <SettingItem
              title="Smart Hints"
              subtitle="Enable intelligent hint suggestions"
              rightComponent={
                <Switch
                  value={smartHints}
                  onValueChange={(value) => {
                    setSmartHints(value);
                    Alert.alert('Smart Hints', value ? 'Intelligent hints enabled' : 'Basic hints only');
                  }}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Highlight Options', 'Number highlighting settings:\n• Highlight same numbers: ON\n• Highlight row/column: ON\n• Highlight conflicts: ' + (highlightConflicts ? 'ON' : 'OFF'))}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>✨ Highlight Options</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Configure number highlighting behavior
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Configure ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Hint Settings', 'Hint system configuration:\n• Maximum hints per game: 3\n• Smart hints: ' + (smartHints ? 'ON' : 'OFF') + '\n• Progressive hints: Enabled')}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>💡 Hint Settings</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Customize hint system behavior
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>3 max ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress & Achievements Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Progress & Achievements</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowLeaderboard(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🌍 Global Leaderboard</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Compete with players worldwide
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Rank #12 ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowGameAnalytics(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>📊 Game Analytics</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Detailed statistics and performance insights
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>View ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowDailyChallenges(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🎯 Daily Challenges</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Complete daily tasks for rewards and XP
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>5 Active ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowAchievements(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🏆 Achievements</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  View unlocked achievements and progress
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>12/24 ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowStatsDashboard(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>� Statistics</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Game history and performance tracking
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>View ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data Management</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={handleExportData}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>📤 Export Data</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Export your game progress and statistics
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Backup ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={handleImportData}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>📥 Import Data</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Import previously exported game data
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Restore ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={handleResetData}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>� Reset All Data</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Clear all progress, statistics, and achievements
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.error }]}>Reset ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Feedback Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support & Feedback</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={handleFeedback}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>💬 Send Feedback</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Help us improve the app with your suggestions
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Send ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Help & Tutorial', 'Interactive tutorial and help guides coming soon!')}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>❓ Help & Tutorial</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Learn how to play and master Sudoku
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Learn ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Rate App', 'Thank you for your interest! App store ratings coming soon.')}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>⭐ Rate This App</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Share your experience with other players
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Rate ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.aboutItem}>
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>Version</Text>
              <Text style={[styles.aboutValue, { color: theme.colors.textSecondary }]}>1.0.0</Text>
            </View>
            <View style={styles.aboutItem}>
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>Made with</Text>
              <Text style={[styles.aboutValue, { color: theme.colors.textSecondary }]}>React Native & Expo</Text>
            </View>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Privacy Policy', 'We respect your privacy. All game data is stored locally on your device and is never shared with third parties.')}
            >
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>Privacy Policy</Text>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>View ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Terms of Service', 'Terms of service and usage guidelines coming soon.')}
            >
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>Terms of Service</Text>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>View ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Preview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Theme Preview</Text>
          <View style={[styles.themePreview, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.previewRow}>
              <View style={[styles.previewCell, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.previewCell, { backgroundColor: theme.colors.secondary }]} />
              <View style={[styles.previewCell, { backgroundColor: theme.colors.accent }]} />
            </View>
            <View style={styles.previewRow}>
              <View style={[styles.previewCell, { backgroundColor: theme.colors.success }]} />
              <View style={[styles.previewCell, { backgroundColor: theme.colors.warning }]} />
              <View style={[styles.previewCell, { backgroundColor: theme.colors.error }]} />
            </View>
            <Text style={[styles.previewText, { color: theme.colors.text }]}>
              Current theme: {isDark ? 'Dark' : 'Light'}
            </Text>
          </View>
        </View>
        
        {/* Close responsive layout containers */}
        </View>
        </View>
      </ScrollView>

      {/* Achievement System Modal */}
      <AchievementSystem
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
        achievements={sampleAchievements}
        newlyUnlocked={[]}
      />

      {/* Statistics Dashboard Modal */}
      <StatsDashboard
        visible={showStatsDashboard}
        onClose={() => setShowStatsDashboard(false)}
      />

      {/* Theme Selector Modal */}
      <ThemeSelector
        visible={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      {/* Game Analytics Modal */}
      <Modal
        visible={showGameAnalytics}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowGameAnalytics(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowGameAnalytics(false)}>
              <Text style={[styles.modalCloseButton, { color: theme.colors.primary }]}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <GameAnalytics />
        </View>
      </Modal>

      {/* Daily Challenges Modal */}
      <Modal
        visible={showDailyChallenges}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDailyChallenges(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDailyChallenges(false)}>
              <Text style={[styles.modalCloseButton, { color: theme.colors.primary }]}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <DailyChallenges 
            onChallengeSelect={(challenge) => {
              Alert.alert(
                'Challenge Selected', 
                `Starting: ${challenge.title}\n\n${challenge.description}`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Start Challenge', onPress: () => setShowDailyChallenges(false) }
                ]
              );
            }}
            onClaimReward={(challenge) => {
              Alert.alert(
                'Reward Claimed!', 
                `${challenge.reward.description}\n\nGreat job completing: ${challenge.title}`,
                [{ text: 'Awesome!', onPress: () => {} }]
              );
            }}
          />
        </View>
      </Modal>

      {/* Leaderboard Modal */}
      <Modal
        visible={showLeaderboard}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLeaderboard(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowLeaderboard(false)}>
              <Text style={[styles.modalCloseButton, { color: theme.colors.primary }]}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          <Leaderboard 
            onPlayerSelect={(player) => {
              Alert.alert(
                `${player.playerName}'s Profile`,
                `Rank: #${player.rank}\nScore: ${player.score.toLocaleString()}\nBest Time: ${Math.floor(player.time / 60)}:${(player.time % 60).toString().padStart(2, '0')}\nDifficulty: ${player.difficulty}\n${player.badge ? `Badge: ${player.badge} Elite Player` : ''}`,
                [{ text: 'Close', onPress: () => {} }]
              );
            }}
          />
        </View>
      </Modal>
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
    paddingHorizontal: isTablet ? 40 : 20,
    paddingTop: Platform.OS === 'ios' ? (isTablet ? 60 : 50) : 40,
    paddingBottom: isTablet ? 30 : 20,
  },
  backButton: {
    marginRight: isTablet ? 24 : 16,
  },
  backButtonText: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: '300',
  },
  title: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: isTablet ? 40 : 20,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  tabletScrollContent: {
    paddingHorizontal: isTablet ? 60 : 0,
    maxWidth: isTablet ? 1200 : '100%',
    alignSelf: 'center',
  },
  tabletGrid: {
    flexDirection: isTablet && isLandscape ? 'row' : 'column',
    gap: isTablet ? 40 : 0,
  },
  mobileLayout: {
    flexDirection: 'column',
  },
  leftColumn: {
    flex: 1,
    minWidth: isTablet ? 300 : '100%',
  },
  fullWidth: {
    width: '100%',
  },
  section: {
    marginBottom: isTablet ? 40 : 30,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : 18,
    fontWeight: '600',
    marginBottom: isTablet ? 16 : 12,
  },
  sectionContent: {
    borderRadius: isTablet ? 16 : 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 20 : 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingInfo: {
    flex: 1,
    marginRight: isTablet ? 24 : 16,
  },
  settingTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: isTablet ? 15 : 13,
    lineHeight: isTablet ? 20 : 18,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingVertical: isTablet ? 20 : 16,
  },
  aboutTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: isTablet ? 16 : 14,
  },
  themePreview: {
    padding: isTablet ? 30 : 20,
    borderRadius: isTablet ? 16 : 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  previewRow: {
    flexDirection: 'row',
    marginBottom: isTablet ? 16 : 12,
    gap: isTablet ? 12 : 8,
  },
  previewCell: {
    width: isTablet ? 40 : 30,
    height: isTablet ? 40 : 30,
    borderRadius: isTablet ? 8 : 6,
  },
  previewText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
    marginTop: isTablet ? 12 : 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: isTablet ? 24 : 16,
    paddingTop: isTablet ? 20 : 16,
    paddingBottom: isTablet ? 16 : 12,
  },
  modalCloseButton: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
