import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface AnimatedCelebrationProps {
  visible: boolean;
  type: 'number-placed' | 'row-complete' | 'column-complete' | 'box-complete' | 'game-complete';
  duration?: number;
}

export default function AnimatedCelebration({ 
  visible, 
  type, 
  duration = 1000 
}: AnimatedCelebrationProps) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      rotateAnim.setValue(0);

      // Start celebration animation
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: duration * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: duration * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: duration * 0.5,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: duration * 0.2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: duration * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: duration * 0.5,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getEmoji = () => {
    switch (type) {
      case 'number-placed':
        return '✨';
      case 'row-complete':
        return '🎯';
      case 'column-complete':
        return '🏆';
      case 'box-complete':
        return '💎';
      case 'game-complete':
        return '🎉';
      default:
        return '✨';
    }
  };

  const getText = () => {
    switch (type) {
      case 'number-placed':
        return 'Nice!';
      case 'row-complete':
        return 'Row Complete!';
      case 'column-complete':
        return 'Column Complete!';
      case 'box-complete':
        return 'Box Complete!';
      case 'game-complete':
        return 'Puzzle Complete!';
      default:
        return 'Great!';
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.celebration,
          {
            backgroundColor: theme.colors.primary,
            transform: [
              { scale: scaleAnim },
              { rotate: spin },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.emoji}>{getEmoji()}</Text>
        <Text style={[styles.text, { color: theme.colors.background }]}>
          {getText()}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  celebration: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
