import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SimpleGameControlsProps {
  onHint: () => void;
  onUndo: () => void;
  hintsRemaining: number;
  canUndo: boolean;
  editMode: boolean;
  onToggleEditMode: () => void;
}

export default function SimpleGameControls({
  onHint,
  onUndo,
  hintsRemaining,
  canUndo,
  editMode,
  onToggleEditMode,
}: SimpleGameControlsProps) {
  const { theme } = useTheme();

  const ActionButton = ({ 
    icon, 
    label, 
    onPress, 
    disabled = false, 
    active = false,
    variant = 'default'
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    disabled?: boolean;
    active?: boolean;
    variant?: 'default' | 'primary';
  }) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        {
          backgroundColor: active 
            ? theme.colors.primary
            : variant === 'primary'
              ? theme.colors.primary
              : theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.actionIcon, 
        { 
          color: active || variant === 'primary'
            ? 'white'
            : theme.colors.text
        }
      ]}>
        {icon}
      </Text>
      <Text style={[
        styles.actionLabel, 
        { 
          color: active || variant === 'primary'
            ? 'white'
            : theme.colors.textSecondary
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.controlRow}>
        {/* Edit Mode Toggle */}
        <ActionButton
          icon={editMode ? "📝" : "🔢"}
          label={editMode ? "Notes" : "Numbers"}
          onPress={onToggleEditMode}
          active={editMode}
        />
        
        {/* Hint Button */}
        <ActionButton
          icon="💡"
          label={hintsRemaining > 0 ? `Hint (${hintsRemaining})` : "Watch Ad"}
          onPress={onHint}
          variant="primary"
        />
        
        {/* Undo Button */}
        <ActionButton
          icon="↶"
          label="Undo"
          onPress={onUndo}
          disabled={!canUndo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    minWidth: 90,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
