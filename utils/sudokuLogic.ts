/**
 * Sudoku Game Logic
 * Contains functions for generating, validating, and checking Sudoku puzzles
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type SudokuGrid = (number | null)[][];

/**
 * Creates an empty 9x9 Sudoku grid
 */
function createEmptyGrid(): SudokuGrid {
  return Array(9).fill(null).map(() => Array(9).fill(null));
}

/**
 * Checks if a number can be placed at a specific position
 */
export function isValidMove(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Solves a Sudoku puzzle using backtracking algorithm
 */
function solveSudoku(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;
            
            if (solveSudoku(grid)) {
              return true;
            }
            
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Generates a complete, valid Sudoku solution
 */
function generateCompleteSudoku(): SudokuGrid {
  const grid = createEmptyGrid();
  
  // Fill the diagonal 3x3 boxes first (they don't affect each other)
  for (let box = 0; box < 9; box += 3) {
    fillBox(grid, box, box);
  }
  
  // Solve the rest
  solveSudoku(grid);
  
  return grid;
}

/**
 * Fills a 3x3 box with random valid numbers
 */
function fillBox(grid: SudokuGrid, row: number, col: number): void {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  // Shuffle the numbers
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  
  let numIndex = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      grid[row + i][col + j] = nums[numIndex];
      numIndex++;
    }
  }
}

/**
 * Removes numbers from a complete Sudoku to create a puzzle
 */
function removeNumbers(grid: SudokuGrid, difficulty: Difficulty): SudokuGrid {
  const puzzle = grid.map(row => [...row]);
  
  // Determine how many numbers to remove based on difficulty
  let numbersToRemove: number;
  switch (difficulty) {
    case 'easy':
      numbersToRemove = 25; // Leave about 56 numbers (much easier)
      break;
    case 'medium':
      numbersToRemove = 40; // Leave about 41 numbers
      break;
    case 'hard':
      numbersToRemove = 55; // Leave about 26 numbers
      break;
    default:
      numbersToRemove = 25;
  }

  let removed = 0;
  while (removed < numbersToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      removed++;
    }
  }
  
  return puzzle;
}

/**
 * Generates a Sudoku puzzle based on difficulty
 */
export function generateSudoku(difficulty: Difficulty): SudokuGrid {
  const completeSudoku = generateCompleteSudoku();
  return removeNumbers(completeSudoku, difficulty);
}

/**
 * Checks if the current state of the Sudoku is valid
 * (no duplicate numbers in rows, columns, or boxes)
 */
export function isValidSudoku(grid: SudokuGrid): boolean {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num !== null) {
        if (seen.has(num)) {
          return false;
        }
        seen.add(num);
      }
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const num = grid[row][col];
      if (num !== null) {
        if (seen.has(num)) {
          return false;
        }
        seen.add(num);
      }
    }
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>();
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
          const num = grid[row][col];
          if (num !== null) {
            if (seen.has(num)) {
              return false;
            }
            seen.add(num);
          }
        }
      }
    }
  }

  return true;
}

/**
 * Checks if the puzzle is completely filled
 */
export function isPuzzleComplete(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Gets a hint for the player (finds the next valid move)
 */
export function getHint(grid: SudokuGrid): { row: number; col: number; number: number } | null {
  // Create a copy and solve it
  const solution = grid.map(row => [...row]);
  if (!solveSudoku(solution)) {
    return null;
  }

  // Find the first empty cell and return its solution
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return {
          row,
          col,
          number: solution[row][col] as number,
        };
      }
    }
  }

  return null;
}
