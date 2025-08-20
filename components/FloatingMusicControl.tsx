import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

interface FloatingMusicControlProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onPress?: () => void;
}

export const FloatingMusicControl: React.FC<FloatingMusicControlProps> = ({
  position = 'top-right',
  onPress,
}) => {
  const { theme } = useTheme();
  const { isPlaying, isMusicEnabled, toggleMusic } = useAudio();
  const [expanded, setExpanded] = useState(false);

  if (!isMusicEnabled) return null;

  const getPositionStyle = () => {
    const offset = isTablet ? 20 : 16;
    const topOffset = isTablet ? 60 : 50; // Account for status bar

    switch (position) {
      case 'top-left':
        return { top: topOffset, left: offset };
      case 'top-right':
        return { top: topOffset, right: offset };
      case 'bottom-left':
        return { bottom: offset, left: offset };
      case 'bottom-right':
        return { bottom: offset, right: offset };
      default:
        return { top: topOffset, right: offset };
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      toggleMusic();
    }
  };

  const handleLongPress = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, getPositionStyle()]}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.border,
          },
          expanded && styles.expandedButton,
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.icon, { color: theme.colors.surface }]}>
          {isPlaying ? '⏸️' : '🎵'}
        </Text>
        
        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.trackText, { color: theme.colors.surface }]}>
              Charm
            </Text>
            <Text style={[styles.statusText, { color: theme.colors.surface }]}>
              {isPlaying ? 'Playing' : 'Paused'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      {isPlaying && (
        <View style={styles.pulseContainer}>
          {[1, 2, 3].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.pulse,
                { backgroundColor: theme.colors.primary + '40' },
                {
                  transform: [
                    {
                      scale: new Animated.Value(1),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  button: {
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
  },
  expandedButton: {
    width: isTablet ? 140 : 120,
    height: isTablet ? 80 : 70,
    borderRadius: isTablet ? 16 : 12,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: isTablet ? 24 : 20,
  },
  expandedContent: {
    marginLeft: 8,
    flex: 1,
    justifyContent: 'center',
  },
  trackText: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusText: {
    fontSize: isTablet ? 12 : 10,
    opacity: 0.9,
  },
  pulseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  pulse: {
    position: 'absolute',
    width: isTablet ? 56 : 48,
    height: isTablet ? 56 : 48,
    borderRadius: isTablet ? 28 : 24,
    opacity: 0.6,
  },
});
