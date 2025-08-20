import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getGameStats, loadCurrentGame, SavedGame } from '../utils/gameStorage';
import { Difficulty } from '../utils/sudokuLogic';

const { width, height } = Dimensions.get('window');

interface MainMenuProps {
  onContinueGame: () => void;
  onNewGame: (difficulty: Difficulty) => void;
  onViewHistory: () => void;
  onSettings: () => void;
}

export default function MainMenu({
  onContinueGame,
  onNewGame,
  onViewHistory,
  onSettings,
}: MainMenuProps) {
  const { theme } = useTheme();
  const [currentGame, setCurrentGame] = useState<SavedGame | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    loadSavedGame();
    loadUserStats();
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadSavedGame = async () => {
    const saved = await loadCurrentGame();
    setCurrentGame(saved);
  };

  const loadUserStats = async () => {
    const stats = await getGameStats();
    setUserStats(stats);
  };

  const difficulties: { value: Difficulty; label: string; description: string; color: string }[] = [
    { value: 'easy', label: 'Easy', description: '55-56 numbers given', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', description: '40-41 numbers given', color: '#FF9800' },
    { value: 'hard', label: 'Hard', description: '25-30 numbers given', color: '#F44336' }
  ];

  const selectedDifficultyData = difficulties.find(d => d.value === selectedDifficulty)!;

  const handleNewGame = () => {
    onNewGame(selectedDifficulty);
    setDropdownOpen(false);
  };

  const MenuButton = ({
    title,
    subtitle,
    onPress,
    icon,
    disabled = false,
    primary = false,
  }: {
    title: string;
    subtitle?: string;
    onPress: () => void;
    icon: string;
    disabled?: boolean;
    primary?: boolean;
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.menuButton,
          {
            backgroundColor: primary ? theme.colors.primary : theme.colors.surface,
            borderColor: primary ? theme.colors.primary : theme.colors.border,
            opacity: disabled ? 0.6 : 1,
            shadowColor: theme.colors.shadow,
            elevation: disabled ? 0 : 8,
            transform: [{ scale: 1 }],
          },
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <View style={styles.buttonContent}>
          <View style={styles.buttonIcon}>
            <Text style={[styles.iconText, { color: primary ? '#FFFFFF' : theme.colors.primary }]}>
              {icon}
            </Text>
          </View>
          <View style={styles.buttonTextContainer}>
            <Text
              style={[
                styles.buttonTitle,
                { color: primary ? '#FFFFFF' : theme.colors.text },
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.buttonSubtitle,
                  { color: primary ? 'rgba(255,255,255,0.8)' : theme.colors.textSecondary },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
          <View style={styles.chevron}>
            <Text
              style={[
                styles.chevronText,
                { color: primary ? 'rgba(255,255,255,0.6)' : theme.colors.textSecondary },
              ]}
            >
              ›
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getContinueGameSubtitle = () => {
    if (!currentGame) return '';
    const elapsed = Math.floor((Date.now() - currentGame.lastPlayed) / 1000);
    if (elapsed < 3600) {
      const minutes = Math.floor(elapsed / 60);
      return `${currentGame.difficulty.toUpperCase()} • ${minutes}m ago`;
    } else if (elapsed < 86400) {
      const hours = Math.floor(elapsed / 3600);
      return `${currentGame.difficulty.toUpperCase()} • ${hours}h ago`;
    } else {
      const days = Math.floor(elapsed / 86400);
      return `${currentGame.difficulty.toUpperCase()} • ${days}d ago`;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
        <TouchableOpacity 
          style={[styles.settingsButton, { backgroundColor: theme.colors.background, shadowColor: theme.colors.shadow }]}
          onPress={onSettings}
        >
          <Text style={[styles.settingsIcon, { color: theme.colors.textSecondary }]}>⚙️</Text>
        </TouchableOpacity>
        
        <View style={styles.headerTitle}>
          <Text style={[styles.appIcon, { color: theme.colors.primary }]}>🧩</Text>
          <Text style={[styles.appTitle, { color: theme.colors.text }]}>Sudoku</Text>
        </View>
        
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.mainScrollView} contentContainerStyle={styles.mainScrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* User Stats Summary */}
          {userStats && userStats.totalGamesCompleted > 0 && (
          <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.statsTitle, { color: theme.colors.text }]}>📊 Your Records</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {userStats.totalGamesCompleted}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Completed
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {Math.round(userStats.completionRate)}%
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Win Rate
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {userStats.bestTimes.easy ? Math.floor(userStats.bestTimes.easy / 60) : '--'}m
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Best Easy
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Main Menu Buttons */}
        <View style={styles.menuContainer}>
          {/* Continue Game Button */}
          <MenuButton
            title={currentGame ? 'Continue Game' : 'No saved game'}
            onPress={onContinueGame}
            icon="▶️"
            disabled={!currentGame}
            primary={!!currentGame}
          />

          {/* New Game Button */}
          <View style={[styles.newGameContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <View style={styles.newGameHeader}>
              <Text style={[styles.newGameTitle, { color: theme.colors.text }]}>🎮 New Game</Text>
            </View>
            
            {/* Difficulty Dropdown */}
            <View style={styles.difficultySection}>
              <TouchableOpacity
                style={[styles.difficultyDropdown, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
                onPress={() => setDropdownOpen(!dropdownOpen)}
              >
                <View style={styles.difficultySelected}>
                  <View style={[styles.difficultyColorDot, { backgroundColor: selectedDifficultyData.color }]} />
                  <View style={styles.difficultyInfo}>
                    <Text style={[styles.difficultyLabel, { color: theme.colors.text }]}>
                      {selectedDifficultyData.label}
                    </Text>
                    <Text style={[styles.difficultyDesc, { color: theme.colors.textSecondary }]}>
                      {selectedDifficultyData.description}
                    </Text>
                  </View>
                  <Text style={[styles.dropdownArrow, { color: theme.colors.textSecondary }]}>
                    {dropdownOpen ? '▲' : '▼'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Dropdown Options */}
              {dropdownOpen && (
                <View style={[styles.dropdownOptions, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                  {difficulties.map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty.value}
                      style={[
                        styles.dropdownOption,
                        { backgroundColor: selectedDifficulty === difficulty.value ? theme.colors.primary + '20' : 'transparent' }
                      ]}
                      onPress={() => {
                        setSelectedDifficulty(difficulty.value);
                        setDropdownOpen(false);
                      }}
                    >
                      <View style={[styles.difficultyColorDot, { backgroundColor: difficulty.color }]} />
                      <View style={styles.difficultyInfo}>
                        <Text style={[styles.difficultyLabel, { color: theme.colors.text }]}>
                          {difficulty.label}
                        </Text>
                        <Text style={[styles.difficultyDesc, { color: theme.colors.textSecondary }]}>
                          {difficulty.description}
                        </Text>
                      </View>
                      {selectedDifficulty === difficulty.value && (
                        <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Start Game Button */}
            <TouchableOpacity
              style={[styles.startGameButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleNewGame}
            >
              <Text style={styles.startGameButtonText}>Start Game</Text>
            </TouchableOpacity>
          </View>

          {/* History & Records Button */}
          <MenuButton
            title="History & Records"
            onPress={onViewHistory}
            icon="📊"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            Made with ❤️ for puzzle lovers
          </Text>
        </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsIcon: {
    fontSize: 20,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    gap: 20,
  },
  menuButton: {
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  buttonIcon: {
    width: 56,
    height: 56,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  chevron: {
    marginLeft: 12,
  },
  chevronText: {
    fontSize: 24,
    fontWeight: '300',
  },
  bottomActions: {
    marginTop: 30,
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  // New Game Section Styles
  newGameContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  newGameHeader: {
    gap: 4,
  },
  newGameTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  newGameSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  difficultySection: {
    gap: 8,
  },
  difficultyDropdown: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  difficultySelected: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  difficultyInfo: {
    flex: 1,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  difficultyDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  dropdownArrow: {
    fontSize: 16,
    marginLeft: 10,
  },
  dropdownOptions: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  startGameButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startGameButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Stats Summary Styles
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
