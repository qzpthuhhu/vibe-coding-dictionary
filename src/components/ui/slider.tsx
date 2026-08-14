import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

/**
 * 轻量单值 Slider，基于原生 range input。
 * 用 accent-color 跟随主题色，避免额外依赖 Radix。
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onValueChange, min = 0, max = 100, step = 1, className, disabled, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        value={value[0] ?? 0}
        onChange={(e) => onValueChange([Number(e.target.value)])}
        className={cn(
          'h-2 w-full cursor-pointer appearance-none rounded-full bg-muted outline-none',
          '[accent-color:var(--primary)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...rest}
      />
    );
  },
);
Slider.displayName = 'Slider';
