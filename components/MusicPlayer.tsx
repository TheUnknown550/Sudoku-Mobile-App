import React, { useEffect, useState } from 'react';
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

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface MusicPlayerProps {
  visible?: boolean;
  compact?: boolean;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  visible = true, 
  compact = false 
}) => {
  const { theme } = useTheme();
  const { isPlaying, volume, isMusicEnabled, toggleMusic, setVolume } = useAudio();
  
  // Animation for music visualization
  const [pulseAnim] = useState(new Animated.Value(1));
  const [waveAnims] = useState([
    new Animated.Value(0.3),
    new Animated.Value(0.5),
    new Animated.Value(0.7),
    new Animated.Value(0.4),
    new Animated.Value(0.6),
  ]);

  useEffect(() => {
    if (isPlaying && isMusicEnabled) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start wave animations
      waveAnims.forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500 + index * 100,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0.3 + index * 0.1,
              duration: 500 + index * 100,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      pulseAnim.stopAnimation();
      waveAnims.forEach(anim => anim.stopAnimation());
    }
  }, [isPlaying, isMusicEnabled]);

  if (!visible || !isMusicEnabled) return null;

  const VolumeControl = () => (
    <View style={styles.volumeContainer}>
      <Text style={[styles.volumeLabel, { color: theme.colors.textSecondary }]}>
        🔊 {Math.round(volume * 100)}%
      </Text>
      <View style={styles.volumeButtons}>
        <TouchableOpacity
          style={[styles.volumeBtn, { backgroundColor: theme.colors.surface }]}
          onPress={() => setVolume(Math.max(0, volume - 0.1))}
        >
          <Text style={[styles.volumeBtnText, { color: theme.colors.text }]}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.volumeBtn, { backgroundColor: theme.colors.surface }]}
          onPress={() => setVolume(Math.min(1, volume + 0.1))}
        >
          <Text style={[styles.volumeBtnText, { color: theme.colors.text }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const MusicVisualizer = () => (
    <View style={styles.visualizer}>
      {waveAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.wave,
            {
              backgroundColor: theme.colors.primary,
              transform: [{ scaleY: anim }],
              opacity: isPlaying ? 0.8 : 0.3,
            },
          ]}
        />
      ))}
    </View>
  );

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: theme.colors.surface }]}>
        <MusicVisualizer />
        <TouchableOpacity onPress={toggleMusic} style={styles.compactButton}>
          <Text style={[styles.compactButtonText, { color: theme.colors.primary }]}>
            {isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Animated.View style={[styles.musicIcon, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.musicEmoji}>🎵</Text>
        </Animated.View>
        <View style={styles.trackInfo}>
          <Text style={[styles.trackTitle, { color: theme.colors.text }]}>
            Charm
          </Text>
          <Text style={[styles.trackArtist, { color: theme.colors.textSecondary }]}>
            Anno Domini Beats
          </Text>
        </View>
      </View>

      <MusicVisualizer />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
          onPress={toggleMusic}
        >
          <Text style={[styles.playButtonText, { color: theme.colors.surface }]}>
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </Text>
        </TouchableOpacity>
      </View>

      <VolumeControl />

      <View style={styles.footer}>
        <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
          {isPlaying ? '🎵 Playing background music' : '⏸️ Music paused'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: isTablet ? 20 : 16,
    margin: isTablet ? 16 : 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  musicIcon: {
    marginRight: 12,
  },
  musicEmoji: {
    fontSize: isTablet ? 32 : 24,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: isTablet ? 16 : 14,
  },
  visualizer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 40,
    marginVertical: 16,
    gap: 4,
  },
  wave: {
    width: isTablet ? 6 : 4,
    height: 30,
    borderRadius: 2,
  },
  controls: {
    alignItems: 'center',
    marginVertical: 16,
  },
  playButton: {
    paddingHorizontal: isTablet ? 32 : 24,
    paddingVertical: isTablet ? 16 : 12,
    borderRadius: 25,
    minWidth: isTablet ? 160 : 120,
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
  },
  compactButton: {
    marginLeft: 8,
  },
  compactButtonText: {
    fontSize: 20,
  },
  volumeContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  volumeLabel: {
    fontSize: isTablet ? 16 : 14,
    marginBottom: 8,
  },
  volumeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  volumeBtn: {
    width: isTablet ? 40 : 36,
    height: isTablet ? 40 : 36,
    borderRadius: isTablet ? 20 : 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  volumeBtnText: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  statusText: {
    fontSize: isTablet ? 14 : 12,
    fontStyle: 'italic',
  },
});
