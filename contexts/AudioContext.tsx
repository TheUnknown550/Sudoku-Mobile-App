import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  isMusicEnabled: boolean;
  soundEffectsEnabled: boolean;
  toggleMusic: () => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  toggleMusicEnabled: () => Promise<void>;
  toggleSoundEffects: () => Promise<void>;
  playSound: (effect: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true); // Force enabled for testing
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);

  useEffect(() => {
    loadAudioSettings();
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadAudioSettings = async () => {
    try {
      const savedVolume = await AsyncStorage.getItem('musicVolume');
      const savedMusicEnabled = await AsyncStorage.getItem('musicEnabled');
      
      if (savedVolume) {
        setVolumeState(parseFloat(savedVolume));
      }
      if (savedMusicEnabled !== null) {
        setIsMusicEnabled(savedMusicEnabled === 'true');
      }
    } catch (error) {
      console.error('Error loading audio settings:', error);
    }
  };

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
      
      // Load the background music file
      await loadBackgroundMusic();
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const loadBackgroundMusic = async () => {
    try {
      // Try multiple approaches to load the music file
      let musicFile;
      let loadMethod = '';
      
      try {
        // Method 1: Try loading with the simplified filename (no spaces)
        musicFile = require('../assets/music/charm_music.mp3');
        loadMethod = 'simplified filename';
      } catch (err1) {
        try {
          // Method 2: Try with the original filename
          musicFile = require('../assets/music/Charm - Anno Domini Beats.mp3');
          loadMethod = 'original filename';
        } catch (err2) {
          try {
            // Method 3: Try with Asset API for complex filenames
            const Asset = require('expo-asset').Asset;
            const asset = Asset.fromModule(require('../assets/music/charm_music.mp3'));
            await asset.downloadAsync();
            musicFile = { uri: asset.localUri || asset.uri };
            loadMethod = 'Asset API';
          } catch (err3) {
            console.warn('Could not load music file with any method:', err1, err2, err3);
            throw new Error('Music file not accessible');
          }
        }
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        musicFile,
        {
          shouldPlay: false,
          isLooping: true,
          volume: volume,
        }
      );
      
      setSound(newSound);
    } catch (error) {
      console.warn('Could not load background music file:', error);
      // Continue without music file - the app will work in demo mode
    }
  };

  const toggleMusic = async () => {
    if (!isMusicEnabled) {
      return;
    }

    try {
      if (!sound) {
        // If no sound file is loaded, work in demo mode
        setIsPlaying(!isPlaying);
        return;
      }

      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling music:', error);
      // Fallback to demo mode
      setIsPlaying(!isPlaying);
    }
  };

  const setVolume = async (newVolume: number) => {
    try {
      setVolumeState(newVolume);
      if (sound) {
        await sound.setVolumeAsync(newVolume);
      }
      await AsyncStorage.setItem('musicVolume', newVolume.toString());
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const toggleMusicEnabled = async () => {
    try {
      const newEnabled = !isMusicEnabled;
      setIsMusicEnabled(newEnabled);
      
      if (!newEnabled && isPlaying) {
        await sound?.pauseAsync();
        setIsPlaying(false);
      }
      
      await AsyncStorage.setItem('musicEnabled', newEnabled.toString());
    } catch (error) {
      console.error('Error toggling music enabled:', error);
    }
  };

  const toggleSoundEffects = async () => {
    try {
      const newEnabled = !soundEffectsEnabled;
      setSoundEffectsEnabled(newEnabled);
      await AsyncStorage.setItem('soundEffectsEnabled', newEnabled.toString());
    } catch (error) {
      console.error('Error toggling sound effects:', error);
    }
  };

  const playSound = (effect: string) => {
    if (soundEffectsEnabled) {
      // Here you would call the actual sound effects system
      // soundEffects.playSound(effect as SoundEffect);
    }
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      volume,
      isMusicEnabled,
      soundEffectsEnabled,
      toggleMusic,
      setVolume,
      toggleMusicEnabled,
      toggleSoundEffects,
      playSound,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
