'use client';

import { Board, Cell } from '@/lib/sudoku';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Board;
  onDrop?: (row: number, col: number, num: number) => void;
}

export default function GameBoard({ board, onDrop }: GameBoardProps) {
  const getBoxClass = (row: number, col: number) => {
    const boxRow = Math.floor(row / 2);
    const boxCol = Math.floor(col / 3);
    const boxIndex = boxRow * 2 + boxCol;
    
    const colors = [
      'bg-blue-50 dark:bg-blue-950/20',
      'bg-purple-50 dark:bg-purple-950/20',
      'bg-blue-50 dark:bg-blue-950/20',
      'bg-purple-50 dark:bg-purple-950/20'
    ];
    
    return colors[boxIndex];
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    const num = parseInt(e.dataTransfer.getData('number'));
    if (onDrop) onDrop(row, col, num);
  };

  return (
    <div className="inline-block p-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-4 border-gray-800 dark:border-gray-200">
      <div className="grid grid-cols-6 gap-0">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 5;
            const isBottomBorder = (rowIndex + 1) % 2 === 0 && rowIndex !== 5;
            
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                draggable={cell.value !== 0 && !cell.isFixed}
                onDragStart={(e) => {
                  e.dataTransfer.setData('remove', cell.value.toString());
                  e.dataTransfer.setData('from', `${rowIndex},${colIndex}`);
                }}
                disabled={cell.isFixed}
                className={cn(
                  'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center text-xl sm:text-2xl font-semibold transition-all duration-200',
                  getBoxClass(rowIndex, colIndex),
                  cell.isFixed 
                    ? 'text-gray-900 dark:text-gray-100 cursor-default font-bold' 
                    : 'text-blue-600 dark:text-blue-400 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40',
                  isRightBorder && 'border-r-4 border-gray-800 dark:border-gray-200',
                  isBottomBorder && 'border-b-4 border-gray-800 dark:border-gray-200',
                  'border border-gray-300 dark:border-gray-700'
                )}
              >
                {cell.value !== 0 ? cell.value : ''}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
