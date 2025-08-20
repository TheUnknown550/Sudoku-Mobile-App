import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'midnight';

export interface Theme {
  mode: ThemeMode;
  name: string;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    shadow: string;
    overlay: string;
  };
}

const lightTheme: Theme = {
  mode: 'light',
  name: 'Classic Light',
  colors: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    primary: '#2563EB',
    secondary: '#64748B',
    accent: '#7C3AED',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  name: 'Classic Dark',
  colors: {
    background: '#0F172A',
    surface: '#1E293B',
    primary: '#3B82F6',
    secondary: '#64748B',
    accent: '#8B5CF6',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

const oceanTheme: Theme = {
  mode: 'ocean',
  name: 'Ocean Blue',
  colors: {
    background: '#F0F9FF',
    surface: '#E0F2FE',
    primary: '#0284C7',
    secondary: '#0F766E',
    accent: '#0891B2',
    text: '#164E63',
    textSecondary: '#475569',
    border: '#BAE6FD',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

const forestTheme: Theme = {
  mode: 'forest',
  name: 'Forest Green',
  colors: {
    background: '#F0FDF4',
    surface: '#DCFCE7',
    primary: '#16A34A',
    secondary: '#15803D',
    accent: '#65A30D',
    text: '#14532D',
    textSecondary: '#374151',
    border: '#BBF7D0',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

const sunsetTheme: Theme = {
  mode: 'sunset',
  name: 'Sunset Orange',
  colors: {
    background: '#FFF7ED',
    surface: '#FFEDD5',
    primary: '#EA580C',
    secondary: '#DC2626',
    accent: '#F59E0B',
    text: '#9A3412',
    textSecondary: '#78716C',
    border: '#FED7AA',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
};

const midnightTheme: Theme = {
  mode: 'midnight',
  name: 'Midnight Purple',
  colors: {
    background: '#1E1B4B',
    surface: '#312E81',
    primary: '#8B5CF6',
    secondary: '#6D28D9',
    accent: '#A855F7',
    text: '#E0E7FF',
    textSecondary: '#A5B4FC',
    border: '#4338CA',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  forest: forestTheme,
  sunset: sunsetTheme,
  midnight: midnightTheme,
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  currentTheme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (themeMode: ThemeMode) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'ocean', 'forest', 'sunset', 'midnight'].includes(savedTheme)) {
        setCurrentTheme(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (theme: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = async () => {
    const themeOrder: ThemeMode[] = ['light', 'dark', 'ocean', 'forest', 'sunset', 'midnight'];
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const newTheme = themeOrder[nextIndex];
    setCurrentTheme(newTheme);
    await saveTheme(newTheme);
  };

  const setTheme = async (themeMode: ThemeMode) => {
    setCurrentTheme(themeMode);
    await saveTheme(themeMode);
  };

  const theme = themes[currentTheme];
  const isDark = currentTheme === 'dark' || currentTheme === 'midnight';
  const availableThemes = Object.values(themes);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDark, 
      currentTheme,
      toggleTheme, 
      setTheme,
      availableThemes
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
