import { Alert, Platform } from 'react-native';

// Interstitial ad unit ID for ad breaks
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-9992987709866316/8112155581',
  android: 'ca-app-pub-9992987709866316/8112155581', 
  default: 'ca-app-pub-9992987709866316/8112155581',
});

// Test ad unit for development
const TEST_INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
  default: 'ca-app-pub-3940256099942544/1033173712',
});

// Use test ads during development
const AD_UNIT_ID = __DEV__ ? TEST_INTERSTITIAL_AD_UNIT_ID : INTERSTITIAL_AD_UNIT_ID;

// Mock Interstitial for Expo Go development
class MockInterstitialAdManager {
  private isAdLoaded: boolean = true; // Always ready in mock
  private isAdLoading: boolean = false;

  public loadAd() {
    console.log('🎬 Mock: Loading interstitial ad...');
    this.isAdLoading = false;
    this.isAdLoaded = true;
  }

  public showAd(onAdClosed?: () => void, onAdFailed?: () => void) {
    console.log('🎬 Mock: Showing interstitial ad break...');
    
    Alert.alert(
      '📺 Ad Break!',
      'This is a simulated ad break for Expo Go testing.\n\nIn a real app, you would see a full-screen advertisement here.',
      [
        { 
          text: 'Skip (Test)', 
          style: 'cancel',
          onPress: () => {
            console.log('❌ User skipped mock ad');
            if (onAdFailed) onAdFailed();
          }
        },
        { 
          text: 'Watch Ad Break (Mock)', 
          onPress: () => {
            console.log('⏱️ Simulating 15-30 second ad break...');
            // Simulate watching an interstitial ad
            setTimeout(() => {
              console.log('✅ Mock ad break completed');
              if (onAdClosed) onAdClosed();
            }, 2000); // 2 second simulation
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

// Real AdMob Interstitial for development builds
class RealInterstitialAdManager {
  private interstitialAd: any;
  private isAdLoaded: boolean = false;
  private isAdLoading: boolean = false;

  constructor() {
    try {
      const { InterstitialAd, AdEventType } = require('react-native-google-mobile-ads');
      this.interstitialAd = InterstitialAd.createForAdRequest(AD_UNIT_ID);
      this.initializeAd();
    } catch (error) {
      console.error('Failed to initialize Interstitial AdMob:', error);
    }
  }

  private initializeAd() {
    if (!this.interstitialAd) return;

    const { AdEventType } = require('react-native-google-mobile-ads');

    this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('🎬 REAL INTERSTITIAL LOADED: Full-screen ad ready');
      this.isAdLoaded = true;
      this.isAdLoading = false;
    });

    this.interstitialAd.addAdEventListener(AdEventType.FAILED_TO_LOAD, (error: any) => {
      console.error('💥 INTERSTITIAL FAILED TO LOAD:', error);
      this.isAdLoaded = false;
      this.isAdLoading = false;
    });

    this.interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
      console.log('🎬 INTERSTITIAL OPENED: Full-screen ad displayed');
    });

    this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('✅ INTERSTITIAL CLOSED: User finished watching ad');
      this.isAdLoaded = false;
      this.loadAd(); // Preload next ad
    });

    this.loadAd();
  }

  public loadAd() {
    if (!this.interstitialAd || this.isAdLoaded || this.isAdLoading) return;
    
    console.log('🎬 Loading interstitial ad...');
    this.isAdLoading = true;
    this.interstitialAd.load();
  }

  public showAd(onAdClosed?: () => void, onAdFailed?: () => void) {
    if (!this.interstitialAd || !this.isAdLoaded) {
      console.log('⚠️ INTERSTITIAL NOT READY: Ad still loading or failed');
      if (onAdFailed) onAdFailed();
      return;
    }

    console.log('🎬 SHOWING INTERSTITIAL: Displaying full-screen advertisement');
    
    const { AdEventType } = require('react-native-google-mobile-ads');

    // Set up one-time close listener
    const closeListener = this.interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (onAdClosed) onAdClosed();
        closeListener(); // Remove listener
      }
    );

    this.interstitialAd.show();
  }

  public get isLoaded(): boolean {
    return this.isAdLoaded;
  }

  public get isLoading(): boolean {
    return this.isAdLoading;
  }
}

// Determine which manager to use
const createInterstitialAdManager = () => {
  try {
    // Try to import AdMob module
    require('react-native-google-mobile-ads');
    console.log('✅ REAL INTERSTITIAL ACTIVE: Full-screen ads will be shown');
    console.log('📱 Environment: Development Build or Production');
    console.log('🎯 Interstitial Ad Unit ID:', AD_UNIT_ID);
    return new RealInterstitialAdManager();
  } catch (error) {
    console.log('🎭 MOCK INTERSTITIAL ACTIVE: Simulated ad breaks for testing');
    console.log('📱 Environment: Expo Go');
    console.log('💡 To test real ads: Use "npx expo run:android" or build production app');
    return new MockInterstitialAdManager();
  }
};

// Singleton instance
export const interstitialAdManager = createInterstitialAdManager();

// Ad break strategy - when to show ads
export enum AdBreakTrigger {
  PUZZLE_COMPLETED = 'puzzle_completed',
  PUZZLE_FAILED = 'puzzle_failed', 
  GAME_RESTART = 'game_restart',
  BACK_TO_MENU = 'back_to_menu',
  NEW_GAME_START = 'new_game_start'
}

// Ad break controller with frequency management
class AdBreakController {
  private lastAdTime: number = 0;
  private minAdInterval: number = 60000; // 1 minute minimum between ads
  private adCount: number = 0;
  private maxAdsPerSession: number = 5; // Reasonable limit per session

  public shouldShowAd(trigger: AdBreakTrigger): boolean {
    const now = Date.now();
    const timeSinceLastAd = now - this.lastAdTime;

    // Check if enough time has passed and we haven't hit the session limit
    const canShowAd = timeSinceLastAd >= this.minAdInterval && 
                     this.adCount < this.maxAdsPerSession &&
                     interstitialAdManager.isLoaded;

    if (canShowAd) {
      console.log(`🎯 Ad break triggered: ${trigger}`);
      return true;
    }

    if (timeSinceLastAd < this.minAdInterval) {
      console.log(`⏰ Ad break skipped: Too soon (${Math.round(timeSinceLastAd/1000)}s ago)`);
    } else if (this.adCount >= this.maxAdsPerSession) {
      console.log(`🛑 Ad break skipped: Session limit reached (${this.adCount}/${this.maxAdsPerSession})`);
    } else if (!interstitialAdManager.isLoaded) {
      console.log(`⚠️ Ad break skipped: Ad not loaded yet`);
    }

    return false;
  }

  public showAdBreak(trigger: AdBreakTrigger, onComplete?: () => void) {
    if (!this.shouldShowAd(trigger)) {
      // No ad shown, proceed immediately
      if (onComplete) onComplete();
      return;
    }

    this.lastAdTime = Date.now();
    this.adCount++;

    console.log(`🎬 Showing ad break for: ${trigger} (${this.adCount}/${this.maxAdsPerSession})`);

    interstitialAdManager.showAd(
      () => {
        console.log(`✅ Ad break completed for: ${trigger}`);
        if (onComplete) onComplete();
      },
      () => {
        console.log(`❌ Ad break failed for: ${trigger}`);
        if (onComplete) onComplete();
      }
    );
  }

  public resetSession() {
    this.adCount = 0;
    this.lastAdTime = 0;
    console.log('🔄 Ad break session reset');
  }
}

// Singleton ad break controller
export const adBreakController = new AdBreakController();
