import React from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useHints } from '../contexts/HintContext';
import { useTheme } from '../contexts/ThemeContext';
import { useRewardedAd } from './AdMobRewardedAd';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface HintButtonProps {
  onHintUsed: (hint: string) => void; // Callback to provide the actual hint
  disabled?: boolean;
  style?: any;
}

export const HintButton: React.FC<HintButtonProps> = ({
  onHintUsed,
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const { hintsRemaining, useHint, getHintStatus } = useHints();
  const { isLoaded: isAdLoaded, showAd } = useRewardedAd();

  const handleHintPress = async () => {
    if (disabled) {
      Alert.alert('Hint Unavailable', 'Hints are not available at this time.');
      return;
    }

    if (hintsRemaining > 0) {
      // User has free hints remaining
      const success = await useHint();
      if (success) {
        provideSudokuHint();
      }
    } else {
      // No free hints, offer ad
      Alert.alert(
        '💡 Need a Hint?',
        'You\'ve used all your free hints! Watch a quick ad to earn another hint.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { 
            text: '📺 Watch Ad', 
            onPress: () => watchAdForHint(),
            style: 'default'
          }
        ]
      );
    }
  };

  const watchAdForHint = () => {
    if (!isAdLoaded) {
      Alert.alert(
        'Loading Ad...',
        'The reward ad is still loading. Please try again in a moment.',
        [{ text: 'OK' }]
      );
      return;
    }

    showAd(
      () => {
        // Ad was watched successfully, reward the user
        Alert.alert(
          '🎉 Hint Earned!',
          'Thanks for watching! You\'ve earned 1 hint. Here\'s your hint:',
          [
            { 
              text: 'Show Hint', 
              onPress: () => provideSudokuHint()
            }
          ]
        );
      },
      () => {
        // Ad failed or was closed without completion
        Alert.alert(
          'Ad Incomplete',
          'You need to watch the complete ad to earn a hint. Please try again.',
          [{ text: 'OK' }]
        );
      }
    );
  };

  const provideSudokuHint = () => {
    // Generate different types of hints
    const hintTypes = [
      'Look for cells that can only contain one number.',
      'Check row 3 - there\'s a number that can only go in one place.',
      'Focus on the top-left 3×3 box - you\'re missing just one number.',
      'Look for a column that\'s almost complete.',
      'Check for pairs - when two cells in a row can only contain the same two numbers.',
      'Look for the number 5 - there\'s a spot where it can only go in one place.',
      'Check the middle row for obvious placements.',
      'Focus on the number 1 - trace where it can go in each box.',
      'Look for a 3×3 box that\'s almost complete.',
      'Check for hidden singles - numbers that can only go in one cell in a row/column/box.',
    ];

    const randomHint = hintTypes[Math.floor(Math.random() * hintTypes.length)];
    onHintUsed(randomHint);
  };

  const getButtonText = () => {
    if (hintsRemaining > 0) {
      return `💡 Hint (${hintsRemaining})`;
    } else {
      return '📺 Watch Ad for Hint';
    }
  };

  const getButtonColor = () => {
    if (disabled) {
      return theme.colors.border;
    } else if (hintsRemaining > 0) {
      return theme.colors.primary;
    } else {
      return '#FF6B35'; // Orange for ad-based hints
    }
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.hintButton,
          {
            backgroundColor: getButtonColor(),
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={handleHintPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Text style={styles.hintButtonText}>
          {getButtonText()}
        </Text>
      </TouchableOpacity>
      
      {/* Hint status indicator */}
      <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
        {getHintStatus()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  hintButton: {
    paddingHorizontal: isTablet ? 24 : 20,
    paddingVertical: isTablet ? 14 : 12,
    borderRadius: isTablet ? 12 : 10,
    minWidth: isTablet ? 200 : 160,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  hintButtonText: {
    color: 'white',
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusText: {
    fontSize: isTablet ? 14 : 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
