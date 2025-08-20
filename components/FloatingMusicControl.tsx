import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

interface FloatingMusicControlProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onPress?: () => void;
  hideWhenModalOpen?: boolean;
  modalVisible?: boolean;
}

export const FloatingMusicControl: React.FC<FloatingMusicControlProps> = ({
  position = 'top-right',
  onPress,
  hideWhenModalOpen = true,
  modalVisible = false,
}) => {
  const { theme } = useTheme();
  const { isPlaying, isMusicEnabled, toggleMusic } = useAudio();
  const [expanded, setExpanded] = useState(false);

  if (hideWhenModalOpen && modalVisible) return null;

  // Debug: Show the control even if music is disabled for testing
  // if (!isMusicEnabled || (hideWhenModalOpen && modalVisible)) return null;

  const getPositionStyle = () => {
    const offset = isTablet ? 20 : 16;
    const topOffset = isTablet ? 120 : 100; // Moved much lower to avoid header buttons

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
    console.log('FloatingMusicControl pressed');
    console.log('isPlaying:', isPlaying);
    console.log('isMusicEnabled:', isMusicEnabled);
    
    // Always call toggleMusic first
    console.log('Calling toggleMusic');
    toggleMusic();
    
    // Then call custom onPress if provided (for additional functionality)
    if (onPress) {
      console.log('Calling custom onPress');
      onPress();
    }
  };

  const handleLongPress = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, getPositionStyle()]}>
      {/* Status Indicator */}
      <View style={[styles.statusIndicator, { backgroundColor: isPlaying ? '#FF6B35' : '#4ECDC4' }]}>
        <Text style={styles.statusIndicatorText}>
          {isPlaying ? '🎵' : '⏸️'}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isPlaying ? '#FF6B35' : '#4ECDC4', // Orange when playing, teal when paused
            borderColor: isPlaying ? '#FF4500' : '#20B2AA',
            borderWidth: 3,
          },
          expanded && styles.expandedButton,
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.icon, { color: 'white' }]}>
          {isPlaying ? '⏸️' : '▶️'}
        </Text>
        
        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.trackText, { color: 'white' }]}>
              Charm
            </Text>
            <Text style={[styles.statusText, { color: 'white' }]}>
              {isPlaying ? '🎵 PLAYING' : '⏸️ PAUSED'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      {isPlaying && (
        <View style={styles.pulseContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.pulse,
                { 
                  backgroundColor: '#FFD700', // Gold color for pulse
                  animationDelay: `${index * 200}ms`,
                },
                {
                  transform: [
                    {
                      scale: new Animated.Value(1 + index * 0.2),
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
    zIndex: 500, // Lower than modals (1000) but higher than game content
  },
  button: {
    width: isTablet ? 70 : 60, // Made bigger
    height: isTablet ? 70 : 60, // Made bigger
    borderRadius: isTablet ? 35 : 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12, // Higher elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    borderWidth: 3,
  },
  expandedButton: {
    width: isTablet ? 140 : 120,
    height: isTablet ? 80 : 70,
    borderRadius: isTablet ? 16 : 12,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  icon: {
    fontSize: isTablet ? 30 : 24, // Bigger icon
    fontWeight: 'bold',
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
    width: isTablet ? 70 : 60,
    height: isTablet ? 70 : 60,
    borderRadius: isTablet ? 35 : 30,
    opacity: 0.6,
  },
  statusIndicator: {
    position: 'absolute',
    top: -10,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  statusIndicatorText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
