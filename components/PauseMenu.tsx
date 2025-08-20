import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface PauseMenuProps {
  onContinue: () => void;
  onMainMenu: () => void;
  onRestart: () => void;
  onClose: () => void;
}

export default function PauseMenu({ onContinue, onMainMenu, onRestart, onClose }: PauseMenuProps) {
  const { theme } = useTheme();

  const MenuButton = ({ 
    title, 
    onPress, 
    icon, 
    color = theme.colors.primary 
  }: { 
    title: string; 
    onPress: () => void; 
    icon: string; 
    color?: string; 
  }) => (
    <TouchableOpacity
      style={[styles.menuButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
      onPress={onPress}
    >
      <Text style={[styles.menuIcon, { color }]}>{icon}</Text>
      <Text style={[styles.menuButtonText, { color: theme.colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onContinue}
      />
      
      <View style={[styles.menuContainer, { backgroundColor: theme.colors.surface }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Game Paused</Text>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: theme.colors.background }]} 
            onPress={onContinue}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <View style={styles.menuOptions}>
          <MenuButton
            title="Continue Game"
            onPress={onContinue}
            icon="▶️"
            color={theme.colors.primary}
          />
          
          <MenuButton
            title="Main Menu"
            onPress={onMainMenu}
            icon="🏠"
            color={theme.colors.textSecondary}
          />
          
          <MenuButton
            title="Restart Game"
            onPress={onRestart}
            icon="🔄"
            color={theme.colors.warning}
          />
        </View>

        {/* Footer */}
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          Your progress is automatically saved
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    width: '80%',
    maxWidth: 320,
    borderRadius: 20,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuOptions: {
    gap: 16,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
