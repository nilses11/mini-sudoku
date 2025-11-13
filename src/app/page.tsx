'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Board,
  Difficulty,
} from '@/lib/sudoku';
import { Trophy, RotateCcw } from 'lucide-react';

export default function Page() {
  const [board, setBoard] = useState<Board>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showSuccess, setShowSuccess] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startNewGame = useCallback((diff: Difficulty) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    setBoard(puzzle);
    setSolution(sol);
    setSelectedCell(null);
    setMistakes(0);
    setDifficulty(diff);
    setShowSuccess(false);
    setGameStarted(true);
  }, []);

  useEffect(() => {
    startNewGame('easy');
  }, [startNewGame]);

  const handleCellClick = (row: number, col: number) => {
    if (!board[row][col].isFixed) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = useCallback((num: number) => {
    if (!selectedCell) return;

    const [row, col] = selectedCell;
    if (board[row][col].isFixed) return;

    const isValid = validateMove(board, solution, row, col, num);
    
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => {
        if (i === row && j === col) {
          return { ...cell, value: num, isError: !isValid };
        }
        return { ...cell, isError: false };
      })
    );

    setBoard(newBoard);

    if (!isValid) {
      setMistakes(prev => prev + 1);
      setTimeout(() => {
        setBoard(prevBoard =>
          prevBoard.map((r, i) =>
            r.map((cell, j) => ({ ...cell, isError: false }))
          )
        );
      }, 500);
    } else {
      if (isBoardComplete(newBoard) && isAllCorrect(newBoard, solution)) {
        setShowSuccess(true);
      }
    }
  }, [selectedCell, board, solution]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6 && selectedCell) {
        handleNumberInput(num);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedCell, handleNumberInput]);

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

          <div className="flex justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Mistakes: {mistakes}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {gameStarted && (
              <GameBoard
                board={board}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-center text-sm text-muted-foreground">
              Select a cell and choose a number
            </p>
            <NumberInput
              onNumberClick={handleNumberInput}
              disabled={!selectedCell}
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
              <p className="text-xl font-semibold">
                Mistakes: {mistakes}
              </p>
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