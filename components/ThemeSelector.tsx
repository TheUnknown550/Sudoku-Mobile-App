import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
  onThemeSelect: (theme: ThemeOption) => void;
}

export default function ThemeSelector({ visible, onClose, onThemeSelect }: ThemeSelectorProps) {
  const { theme } = useTheme();

  const themes: ThemeOption[] = [
    {
      id: 'light',
      name: 'Classic Light',
      description: 'Clean and bright interface',
      colors: {
        background: '#FFFFFF',
        surface: '#F8F9FA',
        primary: '#2563EB',
        secondary: '#64748B',
        accent: '#7C3AED',
        text: '#1E293B',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
    {
      id: 'dark',
      name: 'Classic Dark',
      description: 'Easy on the eyes for night gaming',
      colors: {
        background: '#0F172A',
        surface: '#1E293B',
        primary: '#3B82F6',
        secondary: '#64748B',
        accent: '#8B5CF6',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        border: '#334155',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
      },
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      description: 'Calming blue tones',
      colors: {
        background: '#F0F9FF',
        surface: '#E0F2FE',
        primary: '#0284C7',
        secondary: '#0F766E',
        accent: '#0891B2',
        text: '#164E63',
        textSecondary: '#475569',
        border: '#BAE6FD',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
      },
    },
    {
      id: 'forest',
      name: 'Forest Green',
      description: 'Natural and relaxing',
      colors: {
        background: '#F0FDF4',
        surface: '#DCFCE7',
        primary: '#16A34A',
        secondary: '#15803D',
        accent: '#65A30D',
        text: '#14532D',
        textSecondary: '#374151',
        border: '#BBF7D0',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
      },
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      description: 'Warm and energetic',
      colors: {
        background: '#FFF7ED',
        surface: '#FFEDD5',
        primary: '#EA580C',
        secondary: '#DC2626',
        accent: '#F59E0B',
        text: '#9A3412',
        textSecondary: '#78716C',
        border: '#FED7AA',
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
      },
    },
    {
      id: 'midnight',
      name: 'Midnight Purple',
      description: 'Deep and mysterious',
      colors: {
        background: '#1E1B4B',
        surface: '#312E81',
        primary: '#8B5CF6',
        secondary: '#6D28D9',
        accent: '#A855F7',
        text: '#E0E7FF',
        textSecondary: '#A5B4FC',
        border: '#4338CA',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
      },
    },
  ];

  const renderThemePreview = (themeOption: ThemeOption) => (
    <TouchableOpacity
      key={themeOption.id}
      style={[
        styles.themeCard,
        {
          backgroundColor: themeOption.colors.surface,
          borderColor: themeOption.colors.border,
        },
      ]}
      onPress={() => {
        onThemeSelect(themeOption);
        onClose();
      }}
    >
      {/* Theme Preview */}
      <View style={[styles.preview, { backgroundColor: themeOption.colors.background }]}>
        <View style={styles.previewGrid}>
          {/* Header bar */}
          <View style={[styles.previewHeader, { backgroundColor: themeOption.colors.primary }]} />
          
          {/* Content areas */}
          <View style={styles.previewContent}>
            <View style={[styles.previewBox, { backgroundColor: themeOption.colors.surface }]} />
            <View style={[styles.previewBox, { backgroundColor: themeOption.colors.accent }]} />
          </View>
          
          {/* Grid simulation */}
          <View style={styles.previewMiniGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <View
                key={i}
                style={[
                  styles.previewCell,
                  {
                    backgroundColor: i % 2 === 0 ? themeOption.colors.surface : themeOption.colors.background,
                    borderColor: themeOption.colors.border,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Theme Info */}
      <View style={styles.themeInfo}>
        <Text style={[styles.themeName, { color: themeOption.colors.text }]}>
          {themeOption.name}
        </Text>
        <Text style={[styles.themeDescription, { color: themeOption.colors.textSecondary }]}>
          {themeOption.description}
        </Text>
      </View>

      {/* Color Palette */}
      <View style={styles.colorPalette}>
        <View style={[styles.colorDot, { backgroundColor: themeOption.colors.primary }]} />
        <View style={[styles.colorDot, { backgroundColor: themeOption.colors.secondary }]} />
        <View style={[styles.colorDot, { backgroundColor: themeOption.colors.accent }]} />
        <View style={[styles.colorDot, { backgroundColor: themeOption.colors.success }]} />
        <View style={[styles.colorDot, { backgroundColor: themeOption.colors.warning }]} />
        <View style={[styles.colorDot, { backgroundColor: themeOption.colors.error }]} />
      </View>
    </TouchableOpacity>
  );

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
              🎨 Choose Theme
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: theme.colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Theme List */}
          <ScrollView style={styles.themesList} showsVerticalScrollIndicator={false}>
            <View style={styles.themesGrid}>
              {themes.map(renderThemePreview)}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              💡 Themes change the entire app appearance
            </Text>
          </View>
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
  closeButton: {
    padding: 8,
    marginLeft: 16,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  themesList: {
    flex: 1,
    padding: 16,
  },
  themesGrid: {
    gap: 16,
  },
  themeCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  preview: {
    height: 80,
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  previewGrid: {
    flex: 1,
  },
  previewHeader: {
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  previewContent: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  previewBox: {
    flex: 1,
    height: 16,
    borderRadius: 4,
  },
  previewMiniGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  previewCell: {
    width: 8,
    height: 8,
    borderRadius: 2,
    borderWidth: 0.5,
  },
  themeInfo: {
    marginBottom: 12,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  colorPalette: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
