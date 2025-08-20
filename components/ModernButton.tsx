import React from 'react';
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'error' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function ModernButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}: ModernButtonProps) {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: size === 'small' ? 12 : size === 'large' ? 20 : 16,
      paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 32 : 24,
      paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
      elevation: disabled ? 0 : 6,
      shadowOffset: {
        width: 0,
        height: disabled ? 0 : 4,
      },
      shadowOpacity: disabled ? 0 : 0.15,
      shadowRadius: disabled ? 0 : 8,
    };

    let backgroundColor: string;
    let borderColor: string;

    switch (variant) {
      case 'primary':
        backgroundColor = disabled ? theme.colors.surface : theme.colors.primary;
        borderColor = theme.colors.primary;
        break;
      case 'secondary':
        backgroundColor = disabled ? theme.colors.surface : theme.colors.secondary;
        borderColor = theme.colors.secondary;
        break;
      case 'error':
        backgroundColor = disabled ? theme.colors.surface : theme.colors.error;
        borderColor = theme.colors.error;
        break;
      case 'success':
        backgroundColor = disabled ? theme.colors.surface : theme.colors.success;
        borderColor = theme.colors.success;
        break;
      default:
        backgroundColor = theme.colors.primary;
        borderColor = theme.colors.primary;
    }

    return {
      ...baseStyle,
      backgroundColor,
      borderColor,
      borderWidth: 2,
      opacity: disabled ? 0.6 : 1,
      shadowColor: theme.colors.shadow,
    };
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontSize: size === 'small' ? 14 : size === 'large' ? 20 : 16,
      fontWeight: '700' as const,
      textAlign: 'center' as const,
      letterSpacing: 0.5,
    };

    let color: string;
    if (disabled) {
      color = theme.colors.textSecondary;
    } else if (variant === 'secondary') {
      color = theme.colors.text;
    } else {
      color = '#FFFFFF';
    }

    return {
      ...baseTextStyle,
      color,
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
