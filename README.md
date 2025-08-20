# 🧩 Sudoku Game - React Native with Expo

A beautiful and intuitive Sudoku game built with React Native and Expo. Perfect for beginners to intermediate players with three difficulty levels.

## 🎮 Features

- **Three Difficulty Levels**: Easy (45-50 pre-filled numbers), Medium (35-40), and Hard (25-30)
- **Intuitive Interface**: Tap cells and use the number pad to fill in values
- **Smart Grid Display**: Original numbers are highlighted differently from user input
- **Real-time Validation**: Immediate feedback when the puzzle is solved
- **Clean Design**: Simple, clear interface optimized for mobile devices
- **Dark/Light Theme Support**: Automatically adapts to your device's theme

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd Sudoku
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## 🎯 How to Play

1. **Choose Difficulty**: Start by selecting Easy, Medium, or Hard difficulty
2. **Select a Cell**: Tap any empty cell (gray cells are pre-filled and can't be changed)
3. **Enter Numbers**: Use the number pad at the bottom to fill in values 1-9
4. **Clear Mistakes**: Use the "Clear" button to remove incorrect entries
5. **Win**: Complete the puzzle by filling all cells with valid numbers!

### Sudoku Rules

- Fill the 9×9 grid with numbers 1-9
- Each row must contain all digits 1-9 (no repeats)
- Each column must contain all digits 1-9 (no repeats)
- Each 3×3 box must contain all digits 1-9 (no repeats)

## 🏗️ Project Structure

```
components/
├── SudokuGame.tsx          # Main game component
├── SudokuGrid.tsx          # 9x9 grid display
├── NumberPad.tsx           # Number input interface
└── DifficultySelection.tsx # Start screen with difficulty options

utils/
└── sudokuLogic.ts          # Puzzle generation and validation logic

app/
└── (tabs)/
    └── index.tsx           # Main app entry point
```

## 🛠️ Technical Details

### Key Components

- **SudokuGame**: Manages game state, difficulty, and win conditions
- **SudokuGrid**: Renders the 9×9 grid with cell selection and visual feedback
- **NumberPad**: Provides number input (1-9) and clear functionality
- **DifficultySelection**: Welcome screen with difficulty level selection

### Game Logic

- **Puzzle Generation**: Creates valid, complete Sudoku solutions using backtracking
- **Difficulty Implementation**: Removes numbers based on difficulty level
- **Validation**: Real-time checking for rule violations and completion
- **Smart UI**: Distinguishes between original and user-entered numbers

## 🎨 Customization

The app uses Expo's theming system and can be easily customized:

- **Colors**: Modify `constants/Colors.ts`
- **Styles**: Update component StyleSheets
- **Difficulty**: Adjust number removal in `utils/sudokuLogic.ts`

## 📱 Supported Platforms

- ✅ iOS
- ✅ Android  
- ✅ Web (via Expo web support)

## 🤝 Contributing

This is a beginner-friendly project! Feel free to:

- Add new features (hints, timer, scoring)
- Improve the UI/UX
- Add animations and sound effects
- Implement save/load functionality

## 📝 License

This project is open source and available under the MIT License.

---

**Happy Puzzling! 🧩✨**

