import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import AchievementSystem, { Achievement } from './AchievementSystem';
import StatsDashboard from './StatsDashboard';
import ThemeSelector from './ThemeSelector';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStatsDashboard, setShowStatsDashboard] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [highlightConflicts, setHighlightConflicts] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoCheckMode, setAutoCheckMode] = useState(false);
  const [smartHints, setSmartHints] = useState(true);

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

  const handleThemeSelect = (selectedTheme: any) => {
    // In a real app, this would apply the selected theme
    Alert.alert('Theme Applied', `${selectedTheme.name} theme has been applied!`);
    // Here you would update the theme context with the new theme
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowThemeSelector(true)}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🎨 Theme Gallery</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Choose from beautiful theme collections
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Browse ›</Text>
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
              title="Sound Effects"
              subtitle="Play sounds for actions and achievements"
              rightComponent={
                <Switch
                  value={soundEffects}
                  onValueChange={setSoundEffects}
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
                  onValueChange={setHapticFeedback}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Volume Control', 'Volume adjustment controls coming soon!')}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>🔊 Volume Level</Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                  Adjust sound effects volume
                </Text>
              </View>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>Medium ›</Text>
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
                  value={true}
                  onValueChange={() => Alert.alert('Timer Toggle', 'Timer display preference saved!')}
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
                  value={true}
                  onValueChange={() => Alert.alert('Auto-Save', 'Auto-save preference updated!')}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => Alert.alert('Highlight Options', 'Number highlighting settings:\n• Highlight same numbers\n• Highlight row/column\n• Highlight conflicts')}
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
              onPress={() => Alert.alert('Hint Settings', 'Hint system configuration:\n• Maximum hints per game: 3\n• Hint types: Valid moves only\n• Progressive hints: Enabled')}
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
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Progress</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowAchievements(true)}
            >
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>🏆 Achievements</Text>
              <Text style={[styles.aboutValue, { color: theme.colors.primary }]}>View ›</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => setShowStatsDashboard(true)}
            >
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>📊 Statistics</Text>
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
        onThemeSelect={handleThemeSelect}
      />
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 14,
  },
  themePreview: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  previewRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  previewCell: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
});
