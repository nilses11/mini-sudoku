'use client';

import { Button } from '@/components/ui/button';

interface NumberInputProps {
  onNumberClick: (num: number) => void;
  disabled: boolean;
  availableCounts: Record<number, number>;
  onDrop?: (num: number, fromRow: number, fromCol: number) => void;
}

export default function NumberInput({ onNumberClick, disabled, availableCounts, onDrop }: NumberInputProps) {
  const handleDragStart = (e: React.DragEvent, num: number) => {
    e.dataTransfer.setData('number', num.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const num = parseInt(e.dataTransfer.getData('remove'));
    const [fromRow, fromCol] = e.dataTransfer.getData('from').split(',').map(Number);
    if (onDrop) onDrop(num, fromRow, fromCol);
  };

  return (
    <div 
      className="flex gap-2 sm:gap-3 justify-center flex-wrap"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {[1, 2, 3, 4, 5, 6].map((num) => (
        availableCounts[num] > 0 && (
          <Button
            key={num}
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            size="lg"
            draggable
            onDragStart={(e) => handleDragStart(e, num)}
            className="w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl font-bold hover:scale-110 transition-transform"
          >
            {num}
          </Button>
        )
      ))}
    </div>
  );
}
