import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { theme, isDark, toggleTheme } = useTheme();

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
                  value={true}
                  onValueChange={() => {}}
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
                  value={true}
                  onValueChange={() => {}}
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
                  value={true}
                  onValueChange={() => {}}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              }
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>
          <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity style={styles.aboutItem}>
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>Version</Text>
              <Text style={[styles.aboutValue, { color: theme.colors.textSecondary }]}>1.0.0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aboutItem}>
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>Made with</Text>
              <Text style={[styles.aboutValue, { color: theme.colors.textSecondary }]}>React Native & Expo</Text>
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
