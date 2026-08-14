import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 轻量 Sheet（抽屉 · 概念 32）
 * 从指定方向滑出的面板，比模态框更轻量，不打断主流程
 */
export function Sheet({
  open,
  onOpenChange,
  side = 'right',
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'right' | 'left' | 'bottom';
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  const variants = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
    bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
  }[side];

  const position = {
    right: 'right-0 top-0 h-screen w-[420px] max-w-[92vw] border-l',
    left: 'left-0 top-0 h-screen w-[420px] max-w-[92vw] border-r',
    bottom: 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl border-t',
  }[side];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className={cn(
              'fixed z-[95] overflow-y-auto border-border bg-card p-6 shadow-2xl',
              position,
            )}
          >
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function SheetContent({
  className,
  children,
  ...rest
}: { className?: string; children: ReactNode } & Record<string, unknown>) {
  return (
    <div className={cn('pr-6', className)} {...rest}>
      {children}
    </div>
  );
}

export function SheetHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function SheetTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <h3 className={cn('text-lg font-semibold text-foreground', className)}>{children}</h3>;
}

export function SheetDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={cn('mt-1 text-sm text-muted-foreground', className)}>{children}</p>;
}
