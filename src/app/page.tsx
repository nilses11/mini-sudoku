'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import GameBoard from '@/components/GameBoard';
import NumberInput from '@/components/NumberInput';
import {
  generatePuzzle,
  validateMove,
  isBoardComplete,
  isAllCorrect,
  getHiddenCounts,
  Board,
  Difficulty,
} from '@/lib/sudoku';
import { Trophy, RotateCcw } from 'lucide-react';

export default function Page() {
  const [board, setBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [availableCounts, setAvailableCounts] = useState<Record<number, number>>({});

  const startNewGame = useCallback((diff: Difficulty) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setBoard(puzzle);
    setSolution(sol);
    setDifficulty(diff);
    setShowSuccess(false);
    setGameStarted(true);
    setAvailableCounts(getHiddenCounts(puzzle, sol));
  }, []);

  useEffect(() => {
    startNewGame('easy');
  }, [startNewGame]);

  const handleDrop = useCallback((row: number, col: number, num: number) => {
    if (board[row][col].isFixed) return;

    const oldValue = board[row][col].value;
    const isValid = validateMove(board, solution, row, col, num);
    
    let newValue: number;
    let countChanges: Record<number, number> = {};
    
    if (oldValue === num) {
      // Remove the number
      newValue = 0;
      countChanges[num] = 1; // increment
    } else {
      // Place the number
      newValue = num;
      if (oldValue !== 0) {
        countChanges[oldValue] = 1; // restore old
      }
      countChanges[num] = -1; // consume new
    }
    
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          return { ...cell, value: newValue };
        }
        return cell;
      })
    );

    setBoard(newBoard);

    setAvailableCounts(prev => {
      const updated = { ...prev };
      for (const [n, change] of Object.entries(countChanges)) {
        const numKey = parseInt(n);
        updated[numKey] = (updated[numKey] || 0) + change;
      }
      return updated;
    });

    if (isValid && isBoardComplete(newBoard) && isAllCorrect(newBoard, solution)) {
      setShowSuccess(true);
    }
  }, [board, solution]);

  const handleRemoveDrop = useCallback((num: number, fromRow: number, fromCol: number) => {
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === fromRow && j === fromCol) {
          return { ...cell, value: 0 };
        }
        return cell;
      })
    );

    setBoard(newBoard);
    setAvailableCounts(prev => ({ ...prev, [num]: (prev[num] || 0) + 1 }));
  }, [board]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            6×6 Sudoku
          </CardTitle>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={() => startNewGame('easy')}
              variant={difficulty === 'easy' ? 'default' : 'outline'}
              className="font-semibold"
            >
              Easy
            </Button>
            <Button
              onClick={() => startNewGame('medium')}
              variant={difficulty === 'medium' ? 'default' : 'outline'}
              className="font-semibold"
            >
              Medium
            </Button>
            <Button
              onClick={() => startNewGame('hard')}
              variant={difficulty === 'hard' ? 'default' : 'outline'}
              className="font-semibold"
            >
              Hard
            </Button>
            <Button
              onClick={() => startNewGame(difficulty)}
              variant="outline"
              size="icon"
              title="New Game"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {gameStarted && (
              <GameBoard
                board={board}
                onDrop={handleDrop}
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">
              Drag numbers to cells to place them, or drag numbers from cells back to remove them
            </p>
            <NumberInput
              availableCounts={availableCounts}
              onDrop={handleRemoveDrop}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <Trophy className="h-16 w-16 text-yellow-500" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center space-y-2">
              <p className="text-lg">You completed the puzzle!</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-center mt-4">
            <Button onClick={() => startNewGame(difficulty)}>
              Play Again
            </Button>
            <Button variant="outline" onClick={() => setShowSuccess(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}