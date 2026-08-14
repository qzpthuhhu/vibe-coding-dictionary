import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sun, Moon, ArrowUp, Command, Compass } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/ThemeProvider';
import { useHighlight } from '@/components/HighlightProvider';

/**
 * 悬浮操作按钮 FAB · 概念 40
 * 主按钮展开一组次级操作，错峰动画依次出现
 */
export default function FabSection() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { exploreMode, toggleExploreMode } = useHighlight();

  const actions = [
    {
      key: 'theme',
      label: theme === 'dark' ? '切换浅色' : '切换深色',
      Icon: theme === 'dark' ? Sun : Moon,
      onClick: () => {
        toggle();
        setOpen(false);
      },
    },
    {
      key: 'explore',
      label: exploreMode ? '关闭探索模式' : '开启探索模式',
      Icon: Compass,
      onClick: () => {
        toggleExploreMode();
        setOpen(false);
      },
    },
    {
      key: 'top',
      label: '返回顶部',
      Icon: ArrowUp,
      onClick: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setOpen(false);
      },
    },
    {
      key: 'palette',
      label: '命令面板（⌘K）',
      Icon: Command,
      onClick: () => {
        toast('按 ⌘K / Ctrl+K 可直接唤起命令面板');
        setOpen(false);
      },
    },
  ];

  return (
    <div data-concept-id="40" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((action, i) => (
            <motion.div
              key={action.key}
              initial={{ opacity: 0, scale: 0.6, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6, y: 12 }}
              /* 错峰动画：每项延迟 0.05s 依次弹出 */
              transition={{ duration: 0.2, delay: (actions.length - 1 - i) * 0.05 }}
              className="group flex items-center gap-2"
            >
              <span className="pointer-events-none whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                {action.label}
              </span>
              <button
                onClick={action.onClick}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label={action.label}
              >
                <action.Icon className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: open ? 45 : 0 }}
        transition={{ duration: 0.2 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25"
        aria-label={open ? '收起快捷操作' : '展开快捷操作'}
        aria-expanded={open}
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
