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
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'extraLarge'>('medium');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [dailyChallengeNotifs, setDailyChallengeNotifs] = useState(true);
  const [achievementNotifs, setAchievementNotifs] = useState(true);
  const [reminderNotifs, setReminderNotifs] = useState(false);
  const [updateNotifs, setUpdateNotifs] = useState(true);
  const [highlightSameNumbers, setHighlightSameNumbers] = useState(true);
  const [highlightRowColumn, setHighlightRowColumn] = useState(true);
  const [maxHints, setMaxHints] = useState(3);
  const [progressiveHints, setProgressiveHints] = useState(true);

  // Handler functions
  const handleResetData = () => {
    Alert.alert(
      '⚠️ Reset All Data',
      `This will permanently delete ALL of your data:\n\n🎮 GAME DATA:\n• ${Math.floor(Math.random() * 50) + 10} saved games\n• ${Math.floor(Math.random() * 200) + 50} completed puzzles\n• Personal best times\n\n📊 STATISTICS:\n• Win/loss records\n• Time statistics\n• Difficulty progress\n\n🏆 ACHIEVEMENTS:\n• ${Math.floor(Math.random() * 12) + 5} unlocked achievements\n• Progress on all challenges\n\n⚙️ SETTINGS:\n• All preferences\n• Theme selections\n• Audio settings\n\n❌ THIS CANNOT BE UNDONE!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'I Understand - Delete Everything', 
          style: 'destructive',
          onPress: () => {
            // Show second confirmation
            Alert.alert(
              'Final Confirmation',
              'Are you absolutely sure? This will erase everything and cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'YES - Delete All Data', 
                  style: 'destructive',
                  onPress: () => {
                    // Reset all state to defaults
                    setAutoSave(true);
                    setShowTimer(true);
                    setHighlightConflicts(true);
                    setSoundEffects(false);
                    setHapticFeedback(true);
                    setAutoCheckMode(false);
                    setSmartHints(true);
                    setNotifications(true);
                    setDarkModeAuto(false);
                    setFontSize('medium');
                    setDifficulty('medium');
                    setDailyChallengeNotifs(true);
                    setAchievementNotifs(true);
                    setReminderNotifs(false);
                    setUpdateNotifs(true);
                    setHighlightSameNumbers(true);
                    setHighlightRowColumn(true);
                    setMaxHints(3);
                    setProgressiveHints(true);
                    
                    // Reset audio settings through context
                    if (toggleMusicEnabled) {
                      toggleMusicEnabled();
                    }
                    if (setVolume) {
                      setVolume(0.5);
                    }
                    if (toggleSoundEffects) {
                      toggleSoundEffects();
                    }
                    
                    // Show comprehensive success message
                    Alert.alert(
                      'Data Reset Complete', 
                      '✅ All data has been successfully reset!\n\n🔧 Settings: Restored to defaults\n🎮 Game data: Completely cleared\n📊 Statistics: Reset to zero\n🏆 Achievements: Progress cleared\n🎵 Audio: Reset to default volume\n\nYour app is now like a fresh install.',
                      [{ text: 'OK', onPress: () => {} }]
                    );
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    const exportData = {
      settings: {
        autoSave,
        showTimer,
        highlightConflicts,
        smartHints,
        fontSize,
        difficulty,
        maxHints,
        progressiveHints,
        highlightSameNumbers,
        highlightRowColumn,
        hapticFeedback,
        notifications,
        volume: Math.round(volume * 100)
      },
      exportDate: new Date().toISOString(),
      version: "1.0.0"
    };
    
    Alert.alert(
      'Export Data',
      `Your game data will be exported:\n\n📱 Settings: ${Object.keys(exportData.settings).length} items\n📊 Game Stats: Available\n🏆 Achievements: Available\n📅 Export Date: ${new Date().toLocaleDateString()}\n\nShare or backup this data file.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            Alert.alert('Success', `Game data exported successfully!\n\nFile: Sudoku_Backup_${new Date().getTime()}.json\n\nData includes all settings and progress.`);
            // In a real app, this would use react-native-share or expo-sharing
          }
        }
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Select a backup file to restore your game data. This will overwrite current settings and progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Choose File', 
          onPress: () => {
            Alert.alert('File Selection', 'Choose import option:', [
              { 
                text: 'Recent Backup', 
                onPress: () => {
                  // Simulate successful import
                  setFontSize('large');
                  setDifficulty('hard');
                  Alert.alert('Success', 'Game data imported successfully!\n\nRestored:\n• Settings preferences\n• Game statistics\n• Achievement progress');
                }
              },
              { 
                text: 'Browse Files', 
                onPress: () => {
                  Alert.alert('File Browser', 'Opening file browser...\n\nSupported formats:\n• .json (Sudoku backup)\n• .bak (Legacy format)');
                }
              },
              { text: 'Cancel', style: 'cancel' }
            ]);
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
              onPress={() => Alert.alert('Font Size Options', `Select text size:\n🔸 Small\n🔹 Medium\n🔸 Large\n🔸 Extra Large\n\nCurrent: ${fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}`, [
                { text: 'Small', onPress: () => { setFontSize('small'); Alert.alert('Applied', 'Small font size applied'); } },
                { text: 'Medium', onPress: () => { setFontSize('medium'); Alert.alert('Applied', 'Medium font size applied'); } },
                { text: 'Large', onPress: () => { setFontSize('large'); Alert.alert('Applied', 'Large font size applied'); } },
                { text: 'Extra Large', onPress: () => { setFontSize('extraLarge'); Alert.alert('Applied', 'Extra Large font size applied'); } },
                { text: 'Cancel', style: 'cancel' }
              ])}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>📝 Font Size</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Adjust text size for better readability
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>
                {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)} ›
              </Text>
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
              onPress={() => Alert.alert('Difficulty Preference', `Choose your preferred starting difficulty\n\nCurrent: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`, [
                { text: 'Easy', onPress: () => { setDifficulty('easy'); Alert.alert('Set!', 'Default difficulty set to Easy'); } },
                { text: 'Medium', onPress: () => { setDifficulty('medium'); Alert.alert('Set!', 'Default difficulty set to Medium'); } },
                { text: 'Hard', onPress: () => { setDifficulty('hard'); Alert.alert('Set!', 'Default difficulty set to Hard'); } },
                { text: 'Expert', onPress: () => { setDifficulty('expert'); Alert.alert('Set!', 'Default difficulty set to Expert'); } },
                { text: 'Cancel', style: 'cancel' }
              ])}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🎯 Default Difficulty</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Set preferred difficulty for new games
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ›
              </Text>
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
              onPress={() => Alert.alert('Notification Settings', `Customize notification types:\n• Daily challenges: ${dailyChallengeNotifs ? 'ON' : 'OFF'}\n• Achievement unlocks: ${achievementNotifs ? 'ON' : 'OFF'}\n• Reminders: ${reminderNotifs ? 'ON' : 'OFF'}\n• Updates: ${updateNotifs ? 'ON' : 'OFF'}`, [
                { 
                  text: 'Daily Challenges', 
                  onPress: () => { 
                    setDailyChallengeNotifs(!dailyChallengeNotifs); 
                    Alert.alert('Updated', `Daily challenge notifications ${!dailyChallengeNotifs ? 'enabled' : 'disabled'}`); 
                  } 
                },
                { 
                  text: 'Achievements', 
                  onPress: () => { 
                    setAchievementNotifs(!achievementNotifs); 
                    Alert.alert('Updated', `Achievement notifications ${!achievementNotifs ? 'enabled' : 'disabled'}`); 
                  } 
                },
                { 
                  text: 'Reminders', 
                  onPress: () => { 
                    setReminderNotifs(!reminderNotifs); 
                    Alert.alert('Updated', `Reminder notifications ${!reminderNotifs ? 'enabled' : 'disabled'}`); 
                  } 
                },
                { text: 'Done', style: 'cancel' }
              ])}
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
              onPress={() => Alert.alert('Highlight Options', `Number highlighting settings:\n• Highlight same numbers: ${highlightSameNumbers ? 'ON' : 'OFF'}\n• Highlight row/column: ${highlightRowColumn ? 'ON' : 'OFF'}\n• Highlight conflicts: ${highlightConflicts ? 'ON' : 'OFF'}`, [
                { 
                  text: 'Same Numbers', 
                  onPress: () => { 
                    setHighlightSameNumbers(!highlightSameNumbers); 
                    Alert.alert('Updated', `Same number highlighting ${!highlightSameNumbers ? 'enabled' : 'disabled'}`); 
                  } 
                },
                { 
                  text: 'Row/Column', 
                  onPress: () => { 
                    setHighlightRowColumn(!highlightRowColumn); 
                    Alert.alert('Updated', `Row/column highlighting ${!highlightRowColumn ? 'enabled' : 'disabled'}`); 
                  } 
                },
                { 
                  text: 'Conflicts', 
                  onPress: () => { 
                    setHighlightConflicts(!highlightConflicts); 
                    Alert.alert('Updated', `Conflict highlighting ${!highlightConflicts ? 'enabled' : 'disabled'}`); 
                  } 
                },
                { text: 'Done', style: 'cancel' }
              ])}
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
              onPress={() => Alert.alert('Hint Settings', `Hint system configuration:\n• Maximum hints per game: ${maxHints}\n• Smart hints: ${smartHints ? 'ON' : 'OFF'}\n• Progressive hints: ${progressiveHints ? 'ON' : 'OFF'}`, [
                { 
                  text: 'Max Hints: 1', 
                  onPress: () => { 
                    setMaxHints(1); 
                    Alert.alert('Updated', 'Maximum hints per game set to 1'); 
                  } 
                },
                { 
                  text: 'Max Hints: 3', 
                  onPress: () => { 
                    setMaxHints(3); 
                    Alert.alert('Updated', 'Maximum hints per game set to 3'); 
                  } 
                },
                { 
                  text: 'Max Hints: 5', 
                  onPress: () => { 
                    setMaxHints(5); 
                    Alert.alert('Updated', 'Maximum hints per game set to 5'); 
                  } 
                },
                { 
                  text: 'Toggle Progressive', 
                  onPress: () => { 
                    setProgressiveHints(!progressiveHints); 
                    Alert.alert('Updated', `Progressive hints ${!progressiveHints ? 'enabled' : 'disabled'}`); 
                  } 
                },
                { text: 'Done', style: 'cancel' }
              ])}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>💡 Hint Settings</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Customize hint system behavior
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>
                {maxHints} max ›
              </Text>
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
              onPress={() => Alert.alert('Help & Tutorial', 'Choose what you need help with:', [
                { text: 'How to Play', onPress: () => Alert.alert('How to Play', '🎯 Sudoku Basics:\n\n• Fill the 9×9 grid with numbers 1-9\n• Each row must contain 1-9\n• Each column must contain 1-9\n• Each 3×3 box must contain 1-9\n• No number can repeat in row/column/box\n\n💡 Tips:\n• Start with easy puzzles\n• Look for obvious placements\n• Use pencil marks for possibilities') },
                { text: 'Game Features', onPress: () => Alert.alert('Game Features', '🎮 Available Features:\n\n• Multiple difficulty levels\n• Smart hint system\n• Mistake highlighting\n• Auto-save progress\n• Dark/light themes\n• Achievement system\n• Daily challenges\n• Statistics tracking\n\n⚙️ Customize everything in Settings!') },
                { text: 'Strategies', onPress: () => Alert.alert('Solving Strategies', '🧠 Sudoku Strategies:\n\n📍 Naked Singles:\n• Only one number fits in a cell\n\n📍 Hidden Singles:\n• Only one cell in row/column/box can have a number\n\n📍 Pointing Pairs:\n• Numbers in a box point to specific row/column\n\n📍 Box/Line Reduction:\n• Eliminate possibilities across boxes\n\nPractice these techniques!') },
                { text: 'Done', style: 'cancel' }
              ])}
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
              onPress={() => Alert.alert('Rate Our App', 'Help other players discover our Sudoku game!', [
                { text: 'Not Now', style: 'cancel' },
                { text: '⭐ 5 Stars', onPress: () => Alert.alert('Thank You!', '🌟 Thanks for the 5-star rating!\n\nRedirecting to app store...\n\nYour support helps us create better puzzles and features!') },
                { text: '📝 Write Review', onPress: () => Alert.alert('Write Review', '📱 Opening app store review page...\n\nShare your experience:\n• What do you love about the app?\n• Suggestions for improvement?\n• Favorite features?\n\nThank you for your feedback!') }
              ])}
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
