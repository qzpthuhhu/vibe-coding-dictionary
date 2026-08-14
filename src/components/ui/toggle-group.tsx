import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ToggleGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export function ToggleGroup({
  value,
  onValueChange,
  className,
  children,
}: {
  /** 目前仅支持 single 模式 */
  type?: 'single';
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      <div
        role="group"
        className={cn(
          'inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card p-1 shadow-sm',
          className,
        )}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({
  value,
  className,
  children,
  ...rest
}: {
  value: string;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error('ToggleGroupItem must be used within ToggleGroup');
  const isActive = ctx.value === value;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-all',
        isActive
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
