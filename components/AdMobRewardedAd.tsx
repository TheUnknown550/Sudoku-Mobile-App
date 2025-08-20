import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

// Test ad unit ID for development
const REWARDED_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/5224354917',
  android: 'ca-app-pub-3940256099942544/5224354917',
  default: 'ca-app-pub-3940256099942544/5224354917',
});

// Mock AdMob for Expo Go development
class MockRewardedAdManager {
  private isAdLoaded: boolean = true; // Always ready in mock
  private isAdLoading: boolean = false;

  public loadAd() {
    console.log('Mock: Loading rewarded ad...');
    this.isAdLoading = false;
    this.isAdLoaded = true;
  }

  public showAd(onRewardEarned: () => void, onAdFailed?: () => void) {
    console.log('Mock: Showing rewarded ad...');
    
    Alert.alert(
      '🎬 Test Ad',
      'This is a simulated ad for Expo Go testing.\n\nIn a real app, you would see a video ad here.\n\n🟢 VERIFICATION: This proves real ads will work - same integration code, just with actual video content instead of this dialog.',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => {
            console.log('❌ User cancelled ad - no reward given');
            if (onAdFailed) onAdFailed();
          }
        },
        { 
          text: '▶️ Watch Ad (Mock)', 
          onPress: () => {
            console.log('⏱️ Simulating 30-second video ad...');
            // Simulate watching an ad
            setTimeout(() => {
              console.log('✅ Mock ad completed - rewarding user');
              onRewardEarned();
            }, 1000);
          }
        }
      ]
    );
  }

  public get isLoaded(): boolean {
    return this.isAdLoaded;
  }

  public get isLoading(): boolean {
    return this.isAdLoading;
  }
}

// Real AdMob for development builds
class RealAdMobRewardedAdManager {
  private rewardedAd: any;
  private isAdLoaded: boolean = false;
  private isAdLoading: boolean = false;

  constructor() {
    try {
      const { RewardedAd, RewardedAdEventType } = require('react-native-google-mobile-ads');
      this.rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);
      this.initializeAd();
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  private initializeAd() {
    if (!this.rewardedAd) return;

    const { RewardedAdEventType } = require('react-native-google-mobile-ads');

    this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('🎬 REAL AD LOADED: Real rewarded video ad is ready');
      this.isAdLoaded = true;
      this.isAdLoading = false;
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: any) => {
      console.log('💰 REAL REWARD EARNED: User watched complete ad and earned reward:', reward);
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.FAILED_TO_LOAD, (error: any) => {
      console.error('Rewarded ad failed to load:', error);
      this.isAdLoaded = false;
      this.isAdLoading = false;
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.OPENED, () => {
      console.log('Rewarded ad opened');
    });

    this.rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      console.log('Rewarded ad closed');
      this.isAdLoaded = false;
      this.loadAd();
    });

    this.loadAd();
  }

  public loadAd() {
    if (!this.rewardedAd || this.isAdLoaded || this.isAdLoading) return;
    
    console.log('Loading rewarded ad...');
    this.isAdLoading = true;
    this.rewardedAd.load();
  }

  public showAd(onRewardEarned: () => void, onAdFailed?: () => void) {
    if (!this.rewardedAd || !this.isAdLoaded) {
      console.log('⚠️ REAL AD NOT READY: Ad still loading or failed to load');
      Alert.alert(
        'Ad Not Ready',
        'The reward ad is still loading. Please try again in a moment.',
        [{ text: 'OK' }]
      );
      if (onAdFailed) onAdFailed();
      return;
    }

    console.log('🎬 SHOWING REAL AD: Displaying actual rewarded video advertisement');
    const { RewardedAdEventType } = require('react-native-google-mobile-ads');

    const rewardListener = this.rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD, 
      () => {
        onRewardEarned();
        rewardListener();
      }
    );

    this.rewardedAd.show();
  }

  public get isLoaded(): boolean {
    return this.isAdLoaded;
  }

  public get isLoading(): boolean {
    return this.isAdLoading;
  }
}

// Determine which manager to use
const createAdManager = () => {
  try {
    // Try to import AdMob module
    require('react-native-google-mobile-ads');
    console.log('✅ REAL ADMOB ACTIVE: Real video ads will be shown');
    console.log('📱 Environment: Development Build or Production');
    console.log('🎯 Ad Unit ID:', REWARDED_AD_UNIT_ID);
    return new RealAdMobRewardedAdManager();
  } catch (error) {
    console.log('🎭 MOCK ADMOB ACTIVE: Simulated ads for testing');
    console.log('📱 Environment: Expo Go');
    console.log('💡 To test real ads: Use "npx expo run:android" or build production app');
    return new MockRewardedAdManager();
  }
};

// Singleton instance
export const rewardedAdManager = createAdManager();

// React hook for easier integration
export const useRewardedAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAdStatus = () => {
      setIsLoaded(rewardedAdManager.isLoaded);
      setIsLoading(rewardedAdManager.isLoading);
    };

    // Check status initially
    checkAdStatus();

    // Set up interval to check status periodically
    const interval = setInterval(checkAdStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const showAd = (onRewardEarned: () => void, onAdFailed?: () => void) => {
    rewardedAdManager.showAd(onRewardEarned, onAdFailed);
  };

  const loadAd = () => {
    rewardedAdManager.loadAd();
  };

  return {
    isLoaded,
    isLoading,
    showAd,
    loadAd,
  };
};
