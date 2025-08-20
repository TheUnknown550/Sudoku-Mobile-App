/**
 * MCX Studios24 Splash Screen Usage Examples
 * 
 * This file demonstrates how to use the reusable splash screen component
 * across different games with different themes and configurations.
 */

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import {
    GAMING_THEME_CONFIG,
    MCX_STUDIOS_CONFIG,
    MINIMAL_THEME_CONFIG,
    NEON_THEME_CONFIG,
    SplashConfig
} from './SplashConfig';
import SplashScreen from './SplashScreen';

// Placeholder components for examples
const YourMainGameComponent = () => <View><Text>Your Main Game Component</Text></View>;
const YourPuzzleGameComponent = () => <View><Text>Your Puzzle Game Component</Text></View>;
const YourActionGameComponent = () => <View><Text>Your Action Game Component</Text></View>;
const YourCasualGameComponent = () => <View><Text>Your Casual Game Component</Text></View>;
const YourSciFiGameComponent = () => <View><Text>Your Sci-Fi Game Component</Text></View>;
const YourGameWithLogoComponent = () => <View><Text>Your Game With Logo Component</Text></View>;

// Example 1: Basic usage with default MCX Studios24 branding
const SudokuGameSplash = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        config={MCX_STUDIOS_CONFIG}
      />
    );
  }

  // Your main game component here
  return <YourMainGameComponent />;
};

// Example 2: Custom configuration for a specific game
const PuzzleGameSplash = () => {
  const [showSplash, setShowSplash] = useState(true);

  const customConfig: SplashConfig = {
    ...MCX_STUDIOS_CONFIG,
    tagline: "Puzzle Your Way to Victory",
    backgroundColor: '#2c1810',
    particleColor: '#ffa726',
    accentColor: '#ffa726',
    duration: 4000,
  };

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        config={customConfig}
      />
    );
  }

  return <YourPuzzleGameComponent />;
};

// Example 3: Using predefined gaming theme
const ActionGameSplash = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        config={GAMING_THEME_CONFIG}
      />
    );
  }

  return <YourActionGameComponent />;
};

// Example 4: Minimal theme for casual games
const CasualGameSplash = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        config={MINIMAL_THEME_CONFIG}
      />
    );
  }

  return <YourCasualGameComponent />;
};

// Example 5: Futuristic neon theme for sci-fi games
const SciFiGameSplash = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        config={NEON_THEME_CONFIG}
      />
    );
  }

  return <YourSciFiGameComponent />;
};

// Example 6: Adding your logo to the splash screen
const GameWithLogoSplash = () => {
  const [showSplash, setShowSplash] = useState(true);

  const configWithLogo: SplashConfig = {
    ...MCX_STUDIOS_CONFIG,
    logoSource: require('../assets/images/mcx-logo.png'), // Add your logo here
  };

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        config={configWithLogo}
      />
    );
  }

  return <YourGameWithLogoComponent />;
};

/**
 * How to copy this splash screen to another project:
 * 
 * 1. Copy these files to your new project:
 *    - components/SplashScreen.tsx
 *    - components/SplashConfig.ts
 * 
 * 2. Install required dependencies (should already be in React Native):
 *    - react-native (Animated, Dimensions, etc.)
 * 
 * 3. Add your logo:
 *    - Place your logo in assets/images/
 *    - Update the logoSource in your config
 * 
 * 4. Customize your theme:
 *    - Modify existing themes in SplashConfig.ts
 *    - Or create new themes following the SplashConfig interface
 * 
 * 5. Implement in your app:
 *    - Import SplashScreen and your chosen config
 *    - Use the pattern shown in the examples above
 * 
 * 6. Optional customizations:
 *    - Modify particle count for performance
 *    - Adjust animation timings
 *    - Change fonts (update fontFamily in styles)
 *    - Add sound effects (integrate with your audio system)
 */

export {
    ActionGameSplash,
    CasualGameSplash, GameWithLogoSplash, PuzzleGameSplash, SciFiGameSplash, SudokuGameSplash
};

