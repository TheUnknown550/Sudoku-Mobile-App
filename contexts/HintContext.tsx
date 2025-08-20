import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRewardedAd } from '../components/AdMobRewardedAd';

interface HintContextType {
  hintsRemaining: number;
  totalHintsUsed: number;
  isAdLoaded: boolean;
  useHint: () => Promise<boolean>;
  watchAdForHint: () => Promise<void>;
  resetDailyHints: () => Promise<void>;
  getHintStatus: () => string;
}

const HintContext = createContext<HintContextType | undefined>(undefined);

export const HintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hintsRemaining, setHintsRemaining] = useState(3); // Start with 3 free hints
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);
  const [lastResetDate, setLastResetDate] = useState<string>('');
  
  const { isLoaded: isAdLoaded, showAd } = useRewardedAd();

  useEffect(() => {
    loadHintData();
    checkDailyReset();
  }, []);

  const loadHintData = async () => {
    try {
      const savedHints = await AsyncStorage.getItem('hintsRemaining');
      const savedTotal = await AsyncStorage.getItem('totalHintsUsed');
      const savedResetDate = await AsyncStorage.getItem('lastHintReset');
      
      if (savedHints !== null) {
        setHintsRemaining(parseInt(savedHints));
      }
      if (savedTotal !== null) {
        setTotalHintsUsed(parseInt(savedTotal));
      }
      if (savedResetDate !== null) {
        setLastResetDate(savedResetDate);
      }
    } catch (error) {
      console.error('Error loading hint data:', error);
    }
  };

  const saveHintData = async () => {
    try {
      await AsyncStorage.setItem('hintsRemaining', hintsRemaining.toString());
      await AsyncStorage.setItem('totalHintsUsed', totalHintsUsed.toString());
      await AsyncStorage.setItem('lastHintReset', new Date().toDateString());
    } catch (error) {
      console.error('Error saving hint data:', error);
    }
  };

  const checkDailyReset = async () => {
    const today = new Date().toDateString();
    const savedDate = await AsyncStorage.getItem('lastHintReset');
    
    if (savedDate !== today) {
      // Reset hints daily (optional feature)
      // You can uncomment this if you want daily free hints
      // setHintsRemaining(3);
      await AsyncStorage.setItem('lastHintReset', today);
    }
  };

  const useHint = async (): Promise<boolean> => {
    if (hintsRemaining > 0) {
      const newHintsRemaining = hintsRemaining - 1;
      const newTotalUsed = totalHintsUsed + 1;
      
      setHintsRemaining(newHintsRemaining);
      setTotalHintsUsed(newTotalUsed);
      
      await AsyncStorage.setItem('hintsRemaining', newHintsRemaining.toString());
      await AsyncStorage.setItem('totalHintsUsed', newTotalUsed.toString());
      
      return true;
    } else {
      // No hints remaining, offer ad
      Alert.alert(
        'No Hints Remaining',
        'You\'ve used all your free hints! Watch a quick ad to get another hint.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Watch Ad', onPress: () => watchAdForHint() }
        ]
      );
      return false;
    }
  };

  const watchAdForHint = async (): Promise<void> => {
    try {
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
          setHintsRemaining(hintsRemaining + 1);
          Alert.alert(
            '🎉 Hint Earned!',
            'Thanks for watching! You\'ve earned 1 hint. Use it wisely!',
            [{ text: 'Great!', style: 'default' }]
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
      
    } catch (error) {
      console.error('Error showing ad:', error);
      Alert.alert('Error', 'Failed to load ad. Please try again later.');
    }
  };

  const resetDailyHints = async (): Promise<void> => {
    setHintsRemaining(3);
    await AsyncStorage.setItem('hintsRemaining', '3');
    await AsyncStorage.setItem('lastHintReset', new Date().toDateString());
  };

  const getHintStatus = (): string => {
    if (hintsRemaining > 0) {
      return `${hintsRemaining} hint${hintsRemaining === 1 ? '' : 's'} remaining`;
    } else {
      return 'Watch ad for hint';
    }
  };

  return (
    <HintContext.Provider value={{
      hintsRemaining,
      totalHintsUsed,
      isAdLoaded,
      useHint,
      watchAdForHint,
      resetDailyHints,
      getHintStatus,
    }}>
      {children}
    </HintContext.Provider>
  );
};

export const useHints = () => {
  const context = useContext(HintContext);
  if (context === undefined) {
    throw new Error('useHints must be used within a HintProvider');
  }
  return context;
};
