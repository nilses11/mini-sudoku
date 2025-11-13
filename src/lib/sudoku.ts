// logika iza igre

export type Cell = {
  value: number;
  isFixed: boolean;
  isError: boolean;
};

export type Board = Cell[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

// generation of sudoku board - every board is valid 
function generateSolution(): number[][] {
  const board: number[][] = Array(6).fill(0).map(() => Array(6).fill(0));
  
  function isValid(board: number[][], row: number, col: number, num: number): boolean {
    // check row
    for (let x = 0; x < 6; x++) {
      if (board[row][x] === num) return false;
    }
    
    // check column
    for (let x = 0; x < 6; x++) {
      if (board[x][col] === num) return false;
    }
    
    // check 2x3 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    
    return true;
  }
  
  function solve(board: number[][]): boolean {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 6; col++) {
        if (board[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
          for (const num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  solve(board);
  return board;
}

// remove cells based on difficulty
function removeNumbers(solution: number[][], difficulty: Difficulty): Board {
  const board: Board = solution.map(row => 
    row.map(value => ({ value, isFixed: true, isError: false }))
  );
  
  const cellsToRemove = {
    easy: 15,
    medium: 20,
    hard: 25
  }[difficulty];
  
  const positions: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      positions.push([i, j]);
    }
  }
  
  // shuffle positions
  positions.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < cellsToRemove; i++) {
    const [row, col] = positions[i];
    board[row][col] = { value: 0, isFixed: false, isError: false };
  }
  
  return board;
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: number[][] } {
  const solution = generateSolution();
  const puzzle = removeNumbers(solution, difficulty);
  return { puzzle, solution };
}

export function validateMove(
  board: Board,
  solution: number[][],
  row: number,
  col: number,
  value: number
): boolean {
  return solution[row][col] === value;
}

export function isBoardComplete(board: Board): boolean {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (board[i][j].value === 0) return false;
    }
  }
  return true;
}

export function isAllCorrect(board: Board, solution: number[][]): boolean {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (board[i][j].value !== solution[i][j]) return false;
    }
  }
  return true;
}
