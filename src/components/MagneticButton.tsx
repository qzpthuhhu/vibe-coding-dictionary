import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

/**
 * 磁吸按钮 · 概念 72
 * 鼠标靠近时按钮内容朝光标方向轻微偏移（最多 6px），按钮本身不逃离点击区域
 */
export default function MagneticButton({
  children,
  onClick,
  className,
  strength = 6,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setOffset({
      x: (relX / (rect.width / 2)) * strength,
      y: (relY / (rect.height / 2)) * strength,
    });
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-shadow hover:shadow-xl',
        className,
      )}
    >
      <span
        className="inline-flex items-center"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: offset.x === 0 && offset.y === 0 ? 'transform 0.35s ease-out' : 'none',
        }}
      >
        {children}
      </span>
    </button>
  );
}
