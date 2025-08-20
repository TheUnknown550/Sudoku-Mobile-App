import { Audio } from 'expo-av';

export type SoundEffect = 
  | 'number_place'
  | 'number_remove'
  | 'hint_used'
  | 'game_complete'
  | 'achievement_unlock'
  | 'button_tap'
  | 'error'
  | 'success';

interface SoundConfig {
  volume: number;
  pitch?: number;
  duration?: number;
}

class SoundEffectsManager {
  private static instance: SoundEffectsManager;
  private enabled: boolean = true;
  private volume: number = 0.7;
  private sounds: Map<SoundEffect, Audio.Sound> = new Map();

  private constructor() {}

  static getInstance(): SoundEffectsManager {
    if (!SoundEffectsManager.instance) {
      SoundEffectsManager.instance = new SoundEffectsManager();
    }
    return SoundEffectsManager.instance;
  }

  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: false, // Sound effects respect silent mode
        shouldDuckAndroid: true, // Duck under background music
        playThroughEarpieceAndroid: false,
      });
      
      await this.loadSoundEffects();
      console.log('Sound effects system initialized');
    } catch (error) {
      console.error('Failed to initialize sound effects:', error);
    }
  }

  private async loadSoundEffects() {
    // For now, we'll generate simple tones programmatically
    // In production, you'd load actual sound files
    const soundConfigs: Record<SoundEffect, SoundConfig> = {
      number_place: { volume: 0.5, pitch: 440, duration: 100 },
      number_remove: { volume: 0.3, pitch: 330, duration: 80 },
      hint_used: { volume: 0.6, pitch: 550, duration: 150 },
      game_complete: { volume: 0.8, pitch: 660, duration: 500 },
      achievement_unlock: { volume: 0.7, pitch: 880, duration: 300 },
      button_tap: { volume: 0.2, pitch: 220, duration: 50 },
      error: { volume: 0.4, pitch: 150, duration: 200 },
      success: { volume: 0.6, pitch: 523, duration: 200 },
    };

    // Note: In a real app, you would load actual sound files here
    // For demo purposes, we'll simulate the loading
    for (const [effect] of Object.entries(soundConfigs)) {
      try {
        // Placeholder for actual sound loading
        // const { sound } = await Audio.Sound.createAsync(
        //   require(`../assets/sounds/${effect}.mp3`),
        //   { volume: this.volume * soundConfigs[effect as SoundEffect].volume }
        // );
        // this.sounds.set(effect as SoundEffect, sound);
        console.log(`Sound effect "${effect}" ready`);
      } catch (error) {
        console.warn(`Could not load sound effect "${effect}":`, error);
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    // Update volume for all loaded sounds
    this.sounds.forEach(async (sound) => {
      try {
        await sound.setVolumeAsync(this.volume);
      } catch (error) {
        console.warn('Failed to update sound volume:', error);
      }
    });
  }

  async playSound(effect: SoundEffect, config?: Partial<SoundConfig>) {
    if (!this.enabled) return;

    try {
      const sound = this.sounds.get(effect);
      if (sound) {
        // Stop any previous playback of this sound
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        
        // Apply custom config if provided
        if (config?.volume !== undefined) {
          await sound.setVolumeAsync(this.volume * config.volume);
        }
        
        await sound.playAsync();
      } else {
        // Fallback: Log the sound effect for demo
        console.log(`🔊 Sound effect: ${effect}`);
        this.simulateSound(effect);
      }
    } catch (error) {
      console.warn(`Failed to play sound effect "${effect}":`, error);
    }
  }

  private simulateSound(effect: SoundEffect) {
    // Simple simulation for demo purposes
    const effects = {
      number_place: '🔢 *click*',
      number_remove: '🗑️ *pop*',
      hint_used: '💡 *ding*',
      game_complete: '🎉 *fanfare*',
      achievement_unlock: '🏆 *chime*',
      button_tap: '👆 *tap*',
      error: '❌ *buzz*',
      success: '✅ *ding*',
    };
    
    console.log(`Sound: ${effects[effect]}`);
  }

  // Cleanup when app closes
  async cleanup() {
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.warn('Error unloading sound:', error);
      }
    }
    this.sounds.clear();
  }
}

export const soundEffects = SoundEffectsManager.getInstance();

// Helper functions for common game actions
export const playSoundEffect = {
  numberPlace: () => soundEffects.playSound('number_place'),
  numberRemove: () => soundEffects.playSound('number_remove'),
  hintUsed: () => soundEffects.playSound('hint_used'),
  gameComplete: () => soundEffects.playSound('game_complete'),
  achievementUnlock: () => soundEffects.playSound('achievement_unlock'),
  buttonTap: () => soundEffects.playSound('button_tap'),
  error: () => soundEffects.playSound('error'),
  success: () => soundEffects.playSound('success'),
};
