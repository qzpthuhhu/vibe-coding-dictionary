import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useHighlight } from './HighlightProvider';
import { useTheme } from './ThemeProvider';

/**
 * 探索模式提示横幅
 * 位于导航栏下方 76px，不遮挡导航；30 秒后自动淡出
 */
export default function ExploreModeBanner() {
  const { exploreMode } = useHighlight();
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (exploreMode) {
      setVisible(true);
      const t = window.setTimeout(() => setVisible(false), 30000);
      return () => window.clearTimeout(t);
    }
    setVisible(false);
  }, [exploreMode]);

  const yellowBg = isDark ? 'rgba(230, 190, 9, 0.9)' : 'rgba(255, 214, 10, 0.85)';
  const yellowBorder = isDark ? 'rgba(230, 190, 9, 0.5)' : 'rgba(255, 214, 10, 0.4)';

  return (
    <AnimatePresence>
      {exploreMode && visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-1/2 top-[76px] z-[60] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-full border px-4 py-2 shadow-lg"
          style={{
            borderColor: yellowBorder,
            backgroundColor: yellowBg,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#1A1A1A',
          }}
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="text-xs font-medium">
            探索模式已开启 · 将鼠标移到任意区域查看该处运用的视觉概念 · 按 E 退出
          </span>
          <button
            onClick={() => setVisible(false)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-black/10"
            aria-label="关闭提示"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
