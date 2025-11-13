'use client';

import { Button } from '@/components/ui/button';

interface NumberInputProps {
  onNumberClick: (num: number) => void;
  disabled: boolean;
}

export default function NumberInput({ onNumberClick, disabled }: NumberInputProps) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <Button
          key={num}
          onClick={() => onNumberClick(num)}
          disabled={disabled}
          size="lg"
          className="w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl font-bold hover:scale-110 transition-transform"
        >
          {num}
        </Button>
      ))}
    </div>
  );
}
