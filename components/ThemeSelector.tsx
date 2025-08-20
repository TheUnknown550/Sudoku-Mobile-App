import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export default function ThemeSelector({ visible, onClose }: ThemeSelectorProps) {
  const { theme, currentTheme, setTheme, availableThemes } = useTheme();

  const handleThemeSelect = async (themeMode: string) => {
    await setTheme(themeMode as any);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Select Theme
          </Text>
          
          <ScrollView style={styles.themeList}>
            {availableThemes.map((themeOption) => (
              <TouchableOpacity
                key={themeOption.mode}
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: currentTheme === themeOption.mode 
                      ? theme.colors.primary 
                      : theme.colors.background,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => handleThemeSelect(themeOption.mode)}
              >
                <View style={styles.themePreview}>
                  <View style={[styles.colorSample, { backgroundColor: themeOption.colors.primary }]} />
                  <View style={[styles.colorSample, { backgroundColor: themeOption.colors.secondary }]} />
                  <View style={[styles.colorSample, { backgroundColor: themeOption.colors.accent }]} />
                </View>
                
                <Text style={[
                  styles.themeName,
                  { 
                    color: currentTheme === themeOption.mode 
                      ? theme.colors.surface 
                      : theme.colors.text 
                  }
                ]}>
                  {themeOption.name}
                </Text>
                
                {currentTheme === themeOption.mode && (
                  <Text style={[styles.selectedText, { color: theme.colors.surface }]}>
                    ✓ Selected
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.surface }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: isTablet ? '60%' : '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  themeList: {
    maxHeight: isTablet ? 400 : 300,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 2,
  },
  themePreview: {
    flexDirection: 'row',
    marginRight: 15,
  },
  colorSample: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  themeName: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600',
    flex: 1,
  },
  selectedText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
  },
});
