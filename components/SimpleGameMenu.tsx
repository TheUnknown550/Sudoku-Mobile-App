import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SimpleGameMenuProps {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
  onRestart: () => void;
  onSettings: () => void;
  onMainMenu: () => void;
  timeElapsed: number;
  moves: number;
  wrongMoves: number;
}

export default function SimpleGameMenu({
  visible,
  onClose,
  onContinue,
  onRestart,
  onSettings,
  onMainMenu,
  timeElapsed,
  moves,
  wrongMoves,
}: SimpleGameMenuProps) {
  const { theme } = useTheme();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const MenuButton = ({ 
    icon, 
    label, 
    onPress, 
    variant = 'default' 
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    variant?: 'default' | 'primary' | 'danger';
  }) => (
    <TouchableOpacity
      style={[
        styles.menuButton,
        {
          backgroundColor: variant === 'primary' 
            ? theme.colors.primary
            : variant === 'danger'
              ? '#ff4757'
              : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.menuIcon, 
        { 
          color: variant === 'primary' || variant === 'danger'
            ? 'white'
            : theme.colors.text
        }
      ]}>
        {icon}
      </Text>
      <Text style={[
        styles.menuLabel, 
        { 
          color: variant === 'primary' || variant === 'danger'
            ? 'white'
            : theme.colors.text
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={[styles.menuContainer, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity activeOpacity={1}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text }]}>Game Menu</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={[styles.closeButton, { color: theme.colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Game Stats */}
            <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Time</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{formatTime(timeElapsed)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Moves</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{moves}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Wrong</Text>
                <Text style={[
                  styles.statValue, 
                  { 
                    color: wrongMoves >= 2 ? '#ff4757' : wrongMoves >= 1 ? '#ffa502' : theme.colors.text 
                  }
                ]}>
                  {wrongMoves}/3
                </Text>
              </View>
            </View>

            {/* Menu Options */}
            <View style={styles.menuOptions}>
              <MenuButton
                icon="▶️"
                label="Continue Game"
                onPress={onContinue}
                variant="primary"
              />
              
              <MenuButton
                icon="⚙️"
                label="Settings"
                onPress={onSettings}
              />
              
              <MenuButton
                icon="🔄"
                label="Restart Game"
                onPress={onRestart}
                variant="danger"
              />
              
              <MenuButton
                icon="🏠"
                label="Main Menu"
                onPress={onMainMenu}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 0,
    elevation: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: '600',
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  menuOptions: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});
