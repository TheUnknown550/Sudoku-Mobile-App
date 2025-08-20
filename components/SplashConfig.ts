import { ImageSourcePropType } from 'react-native';

export interface SplashConfig {
  // Brand Information
  brandName: string;
  tagline: string;
  logoSource?: ImageSourcePropType;
  
  // Timing
  duration: number;
  
  // Colors
  backgroundColor: string;
  particleColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  accentColor: string;
  
  // Particle Settings
  particleCount: number;
  particleSize: {
    min: number;
    max: number;
  };
  particleSpeed: {
    min: number;
    max: number;
  };
  
  // Animation Settings
  logoAnimationDelay: number;
  brandAnimationDelay: number;
  taglineAnimationDelay: number;
  fadeOutDelay: number;
}

// Default configuration for MCX Studios24
export const MCX_STUDIOS_CONFIG: SplashConfig = {
  brandName: "MCX Studios24",
  tagline: "Creating Amazing Experiences",
  logoSource: require('../assets/images/mcx-logo.png'), // Your MCX Studios logo
  duration: 3500,
  backgroundColor: '#0a0a0a',
  particleColor: '#4facfe',
  primaryTextColor: '#ffffff',
  secondaryTextColor: '#cccccc',
  accentColor: '#4facfe',
  particleCount: 50,
  particleSize: {
    min: 2,
    max: 6,
  },
  particleSpeed: {
    min: 1,
    max: 3,
  },
  logoAnimationDelay: 300,
  brandAnimationDelay: 700,
  taglineAnimationDelay: 900,
  fadeOutDelay: 500,
};

// Alternative theme configurations for different games
export const GAMING_THEME_CONFIG: SplashConfig = {
  ...MCX_STUDIOS_CONFIG,
  backgroundColor: '#1a1a2e',
  particleColor: '#ff6b6b',
  accentColor: '#ff6b6b',
  tagline: "Level Up Your Experience",
};

export const MINIMAL_THEME_CONFIG: SplashConfig = {
  ...MCX_STUDIOS_CONFIG,
  backgroundColor: '#ffffff',
  particleColor: '#333333',
  primaryTextColor: '#333333',
  secondaryTextColor: '#666666',
  accentColor: '#333333',
  particleCount: 30,
  tagline: "Simply Beautiful",
};

export const NEON_THEME_CONFIG: SplashConfig = {
  ...MCX_STUDIOS_CONFIG,
  backgroundColor: '#0f0f23',
  particleColor: '#00ff9f',
  accentColor: '#00ff9f',
  particleCount: 80,
  tagline: "Future Gaming",
};
