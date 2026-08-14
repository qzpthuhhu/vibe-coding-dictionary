import { useEffect, useState } from 'react';
import { Search, Keyboard } from 'lucide-react';
import { useHighlight } from './HighlightProvider';
import { useTheme } from './ThemeProvider';

/**
 * 探索学习模式开关
 * 关闭态：黄色呼吸闪烁 + 光晕脉冲，吸引注意
 * 开启态：常亮 + 静态外发光 + ON 标记
 */
export default function ExploreModeToggle() {
  const { exploreMode, toggleExploreMode } = useHighlight();
  const { theme } = useTheme();
  const [prefersReduced, setPrefersReduced] = useState(false);
  const isDark = theme === 'dark';

  // 检测减少动态偏好 · 概念 79
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const pulseOff = !exploreMode && !prefersReduced;
  const yellowBase = isDark ? '#E6BE09' : '#FFD60A';
  const textColor = '#1A1A1A';

  return (
    <button
      onClick={toggleExploreMode}
      aria-pressed={exploreMode}
      aria-label={exploreMode ? '关闭探索学习模式' : '开启探索学习模式'}
      className="group relative w-full overflow-hidden rounded-xl border p-3 text-left transition-all duration-300 ease-out"
      style={{
        backgroundColor: yellowBase,
        borderColor: exploreMode
          ? textColor
          : prefersReduced
            ? yellowBase
            : isDark
              ? 'rgba(230, 190, 9, 0.85)'
              : 'rgba(255, 214, 10, 0.9)',
        borderStyle: prefersReduced && !exploreMode ? 'dashed' : 'solid',
        boxShadow: exploreMode
          ? isDark
            ? '0 0 0 3px rgba(230, 190, 9, 0.2), 0 6px 20px rgba(230, 190, 9, 0.25)'
            : '0 0 0 3px rgba(255, 214, 10, 0.25), 0 6px 20px rgba(255, 214, 10, 0.35)'
          : prefersReduced
            ? isDark
              ? '0 2px 8px rgba(230, 190, 9, 0.15)'
              : '0 2px 8px rgba(255, 214, 10, 0.2)'
            : isDark
              ? '0 0 12px rgba(230, 190, 9, 0.25)'
              : '0 0 12px rgba(255, 214, 10, 0.3)',
        animation: pulseOff ? 'explore-btn-pulse 1.6s ease-in-out infinite' : 'none',
      }}
    >
      {/* 关闭态光晕脉冲 */}
      {pulseOff && (
        <span
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            boxShadow: isDark
              ? '0 0 24px 4px rgba(230, 190, 9, 0.4)'
              : '0 0 28px 6px rgba(255, 214, 10, 0.55)',
            animation: 'explore-btn-glow 1.6s ease-in-out infinite',
          }}
        />
      )}

      <div className="relative flex items-start gap-3">
        <div
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300"
          style={{
            backgroundColor: exploreMode ? 'rgba(26, 26, 26, 0.2)' : 'rgba(26, 26, 26, 0.1)',
            color: textColor,
            animation: pulseOff ? 'explore-btn-icon 1.6s ease-in-out infinite' : 'none',
          }}
        >
          <Search className="h-4 w-4" />
          {exploreMode && (
            <span
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full"
              style={{ backgroundColor: textColor, border: `2px solid ${yellowBase}` }}
              aria-hidden
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold leading-tight" style={{ color: textColor }}>
              {exploreMode ? '探索模式进行中' : '探索学习模式'}
            </span>
            {exploreMode && (
              <span
                className="rounded-sm px-1.5 py-0.5 text-[9px] font-bold tracking-wide"
                style={{ backgroundColor: textColor, color: yellowBase }}
              >
                ON
              </span>
            )}
          </div>
          <p
            className="mt-1 text-[11px] leading-snug"
            style={{ color: 'rgba(26, 26, 26, 0.72)' }}
          >
            {exploreMode
              ? '探索模式进行中 · 移动鼠标试试'
              : '开启后，鼠标移到页面任意区域，即可看到该处运用了什么视觉概念'}
          </p>
          <div
            className="mt-1.5 flex items-center gap-1 text-[10px]"
            style={{ color: 'rgba(26, 26, 26, 0.55)' }}
          >
            <Keyboard className="h-2.5 w-2.5" />
            <span className="font-mono">快捷键 E</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes explore-btn-pulse {
          0%, 100% { opacity: 0.55; filter: brightness(0.9); }
          50% { opacity: 1; filter: brightness(1.1); }
        }
        @keyframes explore-btn-glow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        @keyframes explore-btn-icon {
          0%, 100% { opacity: 0.7; transform: scale(0.94); }
          50% { opacity: 1; transform: scale(1.06); }
        }
      `}</style>
    </button>
  );
}
