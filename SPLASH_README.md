# MCX Studios24 Splash Screen System

A beautiful, customizable splash screen component with particle effects for React Native games.

## 🎯 Features

- **Particle Animation System**: Dynamic floating particles with customizable colors and movement
- **Smooth Animations**: Professional fade-in/fade-out transitions with spring animations
- **Fully Customizable**: Easy theming system for different games and brands
- **Reusable Across Projects**: Copy 2 files and you're ready to go
- **Performance Optimized**: Efficient animations using native drivers where possible
- **TypeScript Support**: Full type safety and IntelliSense support

## 🚀 Quick Start

### 1. Files Included
- `components/SplashScreen.tsx` - Main splash screen component
- `components/SplashConfig.ts` - Configuration themes and interfaces
- `components/SplashExamples.tsx` - Usage examples and documentation

### 2. Basic Implementation

```tsx
import SplashScreen from '@/components/SplashScreen';
import { MCX_STUDIOS_CONFIG } from '@/components/SplashConfig';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        config={MCX_STUDIOS_CONFIG}
      />
    );
  }

  return <YourMainApp />;
}
```

## 🎨 Customization

### Using Predefined Themes

```tsx
import { 
  MCX_STUDIOS_CONFIG,    // Default MCX Studios branding
  GAMING_THEME_CONFIG,   // Gaming-focused theme
  MINIMAL_THEME_CONFIG,  // Clean, minimal design
  NEON_THEME_CONFIG     // Futuristic neon theme
} from '@/components/SplashConfig';

<SplashScreen config={GAMING_THEME_CONFIG} onFinish={onFinish} />
```

### Creating Custom Themes

```tsx
const customConfig: SplashConfig = {
  brandName: "Your Studio Name",
  tagline: "Your Game Tagline",
  logoSource: require('../assets/logo.png'),
  duration: 3500,
  backgroundColor: '#1a1a1a',
  particleColor: '#ff6b6b',
  primaryTextColor: '#ffffff',
  secondaryTextColor: '#cccccc',
  accentColor: '#ff6b6b',
  particleCount: 60,
  particleSize: { min: 2, max: 6 },
  particleSpeed: { min: 1, max: 3 },
  logoAnimationDelay: 300,
  brandAnimationDelay: 700,
  taglineAnimationDelay: 900,
  fadeOutDelay: 500,
};
```

## 🎮 Game-Specific Examples

### Sudoku Game
```tsx
const sudokuConfig = {
  ...MCX_STUDIOS_CONFIG,
  tagline: "Master the Grid. Challenge Your Mind.",
  particleColor: '#4facfe',
  duration: 3500,
};
```

### Action Game
```tsx
const actionConfig = {
  ...GAMING_THEME_CONFIG,
  tagline: "Level Up Your Experience",
  backgroundColor: '#1a1a2e',
  particleColor: '#ff6b6b',
};
```

### Puzzle Game
```tsx
const puzzleConfig = {
  ...MCX_STUDIOS_CONFIG,
  tagline: "Puzzle Your Way to Victory",
  backgroundColor: '#2c1810',
  particleColor: '#ffa726',
  accentColor: '#ffa726',
};
```

## 📦 Copy to New Projects

To use this splash screen in other games:

1. **Copy Files**: Copy `SplashScreen.tsx` and `SplashConfig.ts` to your new project
2. **Add Assets**: Place your logo in `assets/images/`
3. **Install Dependencies**: Ensure React Native is installed (no additional packages needed)
4. **Customize**: Update the config with your branding
5. **Implement**: Use the patterns shown in the examples

## 🎨 Adding Your Logo

1. Place your logo image in `assets/images/mcx-logo.png`
2. Update your config:

```tsx
const configWithLogo = {
  ...MCX_STUDIOS_CONFIG,
  logoSource: require('../assets/images/mcx-logo.png'),
};
```

## ⚡ Performance Tips

- **Particle Count**: Reduce `particleCount` for older devices (30-50 recommended)
- **Animation Duration**: Keep `duration` between 2-4 seconds for best UX
- **Native Driver**: Most animations use native drivers for smooth performance
- **Memory**: Splash screen automatically cleans up when finished

## 🎯 Brand Consistency

The splash screen is designed to maintain MCX Studios24 branding across all games while allowing customization:

- **Consistent Brand Name**: "MCX Studios24" appears in all themes
- **Professional Animation**: Smooth, polished transitions
- **Flexible Theming**: Colors and particles adapt to game genre
- **Quality Assurance**: Tested across different screen sizes and devices

## 🔧 Advanced Customization

### Custom Particle Behavior
Modify the particle animation in `SplashScreen.tsx`:
- Change movement patterns in `animateParticles()`
- Adjust opacity fading in the particle animation sequence
- Modify particle generation in `createParticles()`

### Custom Fonts
Update the `fontFamily` in styles to use custom fonts:
```tsx
brandName: {
  fontFamily: 'YourCustomFont-Bold',
  // ... other styles
}
```

### Sound Effects
Add audio integration by calling your sound system in the animation callbacks:
```tsx
// In the animation sequence
Animated.timing(logoOpacity, {
  toValue: 1,
  duration: 800,
  useNativeDriver: true,
}).start(() => {
  playLogoSound(); // Your sound function
});
```

## 📱 Tested On
- iOS (iPhone 12, iPhone 14 Pro)
- Android (Pixel 6, Samsung Galaxy S22)
- Expo Go Development Environment
- Various screen sizes and orientations

## 🤝 Support
For questions about implementation or customization, refer to the examples in `SplashExamples.tsx` or create detailed configurations in `SplashConfig.ts`.

---

**MCX Studios24** - Creating Amazing Experiences
