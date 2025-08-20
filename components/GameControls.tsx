import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface GameControlsProps {
  onPause: () => void;
  onSettings: () => void;
  onRestart: () => void;
  onUndo?: () => void;
  onAutoCheck?: () => void;
  onHint?: () => void;
  isPaused: boolean;
  canUndo?: boolean;
  autoCheckEnabled?: boolean;
  hintsRemaining?: number;
}

export default function GameControls({
  onPause,
  onSettings,
  onRestart,
  onUndo,
  onAutoCheck,
  onHint,
  isPaused,
  canUndo = false,
  autoCheckEnabled = false,
  hintsRemaining = 0,
}: GameControlsProps) {
  const { theme } = useTheme();

  const ControlButton = ({ 
    icon, 
    label, 
    onPress, 
    disabled = false, 
    active = false 
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    disabled?: boolean;
    active?: boolean;
  }) => (
    <TouchableOpacity
      style={[
        styles.controlButton,
        {
          backgroundColor: active 
            ? theme.colors.primary 
            : disabled 
              ? theme.colors.secondary + '40'
              : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.controlIcon, 
        { 
          color: active 
            ? theme.colors.background 
            : disabled 
              ? theme.colors.textSecondary 
              : theme.colors.text 
        }
      ]}>
        {icon}
      </Text>
      <Text style={[
        styles.controlLabel, 
        { 
          color: active 
            ? theme.colors.background 
            : disabled 
              ? theme.colors.textSecondary 
              : theme.colors.textSecondary 
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ControlButton
          icon={isPaused ? "▶️" : "⏸️"}
          label={isPaused ? "Resume" : "Pause"}
          onPress={onPause}
        />
        
        <ControlButton
          icon="⚙️"
          label="Settings"
          onPress={onSettings}
        />
        
        <ControlButton
          icon="🔄"
          label="Restart"
          onPress={onRestart}
        />
        
        {onHint && (
          <ControlButton
            icon="💡"
            label={hintsRemaining > 0 ? `Hint (${hintsRemaining})` : "Watch Ad"}
            onPress={onHint}
          />
        )}
      </View>

      {(onUndo || onAutoCheck) && (
        <View style={styles.row}>
          {onUndo && (
            <ControlButton
              icon="↶"
              label="Undo"
              onPress={onUndo}
              disabled={!canUndo}
            />
          )}
          
          {onAutoCheck && (
            <ControlButton
              icon="✓"
              label="Auto Check"
              onPress={onAutoCheck}
              active={autoCheckEnabled}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  controlIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
