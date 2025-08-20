import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { MCX_STUDIOS_CONFIG, SplashConfig } from './SplashConfig';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  size: number;
  speed: number;
  direction: number;
  initialX: number;
  initialY: number;
}

interface SplashScreenProps {
  onFinish: () => void;
  config?: SplashConfig;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  config = MCX_STUDIOS_CONFIG,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const particleAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const {
    brandName,
    tagline,
    logoSource,
    duration,
    backgroundColor,
    particleColor,
    primaryTextColor,
    secondaryTextColor,
    accentColor,
    particleCount,
    particleSize,
    particleSpeed,
    logoAnimationDelay,
    brandAnimationDelay,
    taglineAnimationDelay,
    fadeOutDelay,
  } = config;

  // Generate particles
  useEffect(() => {
    const createParticles = () => {
      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        const initialX = Math.random() * SCREEN_WIDTH;
        const initialY = Math.random() * SCREEN_HEIGHT;
        
        newParticles.push({
          id: i,
          x: new Animated.Value(initialX),
          y: new Animated.Value(initialY),
          opacity: new Animated.Value(Math.random() * 0.8 + 0.2),
          scale: new Animated.Value(Math.random() * 0.5 + 0.5),
          size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
          speed: Math.random() * (particleSpeed.max - particleSpeed.min) + particleSpeed.min,
          direction: Math.random() * Math.PI * 2,
          initialX,
          initialY,
        });
      }
      setParticles(newParticles);
    };

    createParticles();
  }, []);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animateParticles = () => {
      const animations = particles.map(particle => {
        return Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(particle.x, {
                toValue: particle.initialX + Math.cos(particle.direction) * 100,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: false,
              }),
              Animated.timing(particle.y, {
                toValue: particle.initialY + Math.sin(particle.direction) * 100,
                duration: 3000 + Math.random() * 2000,
                useNativeDriver: false,
              }),
              Animated.sequence([
                Animated.timing(particle.opacity, {
                  toValue: 0.1,
                  duration: 1500 + Math.random() * 1000,
                  useNativeDriver: false,
                }),
                Animated.timing(particle.opacity, {
                  toValue: 0.8,
                  duration: 1500 + Math.random() * 1000,
                  useNativeDriver: false,
                }),
              ]),
            ]),
          ])
        );
      });

      particleAnimation.current = Animated.parallel(animations);
      particleAnimation.current.start();
    };

    animateParticles();

    return () => {
      if (particleAnimation.current) {
        particleAnimation.current.stop();
      }
    };
  }, [particles]);

  // Main animation sequence
  useEffect(() => {
    const startAnimation = () => {
      // Logo animation
      Animated.sequence([
        Animated.delay(logoAnimationDelay),
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(brandAnimationDelay - logoAnimationDelay),
        // Brand name animation
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.delay(taglineAnimationDelay - brandAnimationDelay),
        // Tagline animation
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(duration - taglineAnimationDelay - fadeOutDelay), // Wait for remaining time
        // Fade out animation
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: fadeOutDelay,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    };

    startAnimation();
  }, [duration, onFinish, logoAnimationDelay, brandAnimationDelay, taglineAnimationDelay, fadeOutDelay]);

  const renderParticles = () => {
    return particles.map(particle => (
      <Animated.View
        key={particle.id}
        style={[
          styles.particle,
          {
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            transform: [{ scale: particle.scale }],
            width: particle.size,
            height: particle.size,
            backgroundColor: particleColor,
            shadowColor: particleColor,
          },
        ]}
      />
    ));
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor, opacity: containerOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      
      {/* Particle Background */}
      <View style={styles.particleContainer}>
        {renderParticles()}
      </View>

      {/* Gradient Overlay */}
      <View style={styles.gradientOverlay} />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        {logoSource && (
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          </Animated.View>
        )}

        {/* Brand Name */}
        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: brandOpacity,
            },
          ]}
        >
          <Text style={[styles.brandName, { color: primaryTextColor, textShadowColor: `${accentColor}80` }]}>
            {brandName}
          </Text>
          <View style={[styles.brandUnderline, { backgroundColor: accentColor, shadowColor: accentColor }]} />
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
              color: secondaryTextColor,
            },
          ]}
        >
          {tagline}
        </Animated.Text>

        {/* Loading indicator */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: taglineOpacity,
            },
          ]}
        >
          <View style={styles.loadingBar}>
            <Animated.View style={[styles.loadingProgress, { backgroundColor: accentColor, shadowColor: accentColor }]} />
          </View>
          <Text style={[styles.loadingText, { color: secondaryTextColor }]}>Loading...</Text>
        </Animated.View>
      </View>

      {/* Bottom branding */}
      <Animated.View
        style={[
          styles.bottomBrand,
          {
            opacity: brandOpacity,
          },
        ]}
      >
        <Text style={[styles.bottomBrandText, { color: secondaryTextColor }]}>Powered by {brandName}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 40,
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'System', // You can replace with custom font
    letterSpacing: 2,
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 8,
  },
  brandUnderline: {
    width: 80,
    height: 3,
    marginTop: 8,
    borderRadius: 2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 60,
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
    transform: [{ translateX: -200 }],
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    fontSize: 14,
    letterSpacing: 1,
  },
  bottomBrand: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  bottomBrandText: {
    fontSize: 12,
    letterSpacing: 1,
  },
});

export default SplashScreen;
