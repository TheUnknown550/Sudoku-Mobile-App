import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onClearPress: () => void;
  disabled: boolean;
}

export default function NumberPad({ onNumberPress, onClearPress, disabled }: NumberPadProps) {
  const { theme } = useTheme();

  const renderButton = (content: string | number, onPress: () => void, isSpecial = false) => {
    return (
      <TouchableOpacity
        key={content}
        style={[
          styles.button,
          {
            backgroundColor: disabled 
              ? theme.colors.surface + '60'
              : isSpecial 
                ? theme.colors.error
                : theme.colors.surface,
            borderColor: isSpecial ? theme.colors.error : theme.colors.primary,
            opacity: disabled ? 0.4 : 1,
            shadowColor: theme.colors.shadow,
            elevation: disabled ? 0 : 4,
          }
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: disabled 
                ? theme.colors.textSecondary 
                : isSpecial 
                  ? '#FFFFFF'
                  : theme.colors.text,
              fontWeight: isSpecial ? '700' : '600',
              fontSize: 18,
            }
          ]}
        >
          {content}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {disabled ? 'Select a cell first' : 'Choose a number'}
      </Text>
      
      {/* Single row: 1-9 + Clear */}
      <View style={styles.row}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => renderButton(num, () => onNumberPress(num)))}
        {renderButton('X', onClearPress, true)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  button: {
    width: 32,
    height: 36,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  spacer: {
    width: 32,
    height: 36,
  },
});
