import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Command, Menu, Search, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { SECTIONS, cn } from '@/lib/utils';
import { CONCEPTS } from '@/data/concepts';
import { useHighlight } from '@/components/HighlightProvider';

const NAV_IDS = ['hero', 'metrics', 'products', 'feishu', 'timeline', 'culture', 'dictionary'];

export default function Header({ activeSection }: { activeSection?: string }) {
  const { theme, toggle } = useTheme();
  const isMobile = useIsMobile();
  const { highlight } = useHighlight();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cmd/Ctrl + K 打开命令面板
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCmdOpen(false);
    setMobileNavOpen(false);
  };

  const matchedConcepts = query.trim()
    ? CONCEPTS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          String(c.id).includes(query.trim()),
      ).slice(0, 8)
    : CONCEPTS.slice(0, 8);

  const matchedSections = SECTIONS.filter(
    (s) => s.id !== 'footer' && (!query.trim() || s.label.includes(query.trim())),
  );

  return (
    <>
      {/* 阅读进度条 · 概念 43 */}
      <motion.div
        data-concept-id="43"
        style={{ scaleX, transformOrigin: 'left' }}
        className="fixed left-0 top-0 z-[60] h-0.5 w-full bg-primary"
        aria-label="阅读进度条"
      />

      {/* 固定导航 · 概念 21 / 玻璃拟态 · 概念 64 */}
      <header
        data-concept-id="21"
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300 md:pl-[clamp(200px,15vw,280px)]',
          scrolled
            ? 'border-b border-border/40 bg-background/70 backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        {/* Flexbox · 概念 6 */}
        <div
          data-concept-id="6"
          className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8"
        >
          <div className="flex items-center gap-3">
            {isMobile && (
              /* 汉堡菜单 · 概念 22 */
              <button
                data-concept-id="22"
                onClick={() => setMobileNavOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent"
                aria-label="菜单"
                aria-expanded={mobileNavOpen}
              >
                {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
            <span className="font-mono text-sm font-bold text-primary md:hidden">VC</span>
          </div>

          {/* 桌面导航 · 概念 27 */}
          <nav data-concept-id="27" className="hidden items-center gap-1 lg:flex">
            {NAV_IDS.map((id) => {
              const section = SECTIONS.find((s) => s.id === id);
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'font-medium text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {section?.label.split(' · ')[0]}
                </button>
              );
            })}
          </nav>

          {/* 命令面板入口 · 概念 39 */}
          <div data-concept-id="39" className="flex items-center gap-2">
            <button
              onClick={() => setCmdOpen(true)}
              className="hidden h-8 items-center gap-2 rounded-md px-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground md:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span>搜索</span>
              <kbd className="ml-1 flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
                <Command className="h-3 w-3" />K
              </kbd>
            </button>
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-accent"
              aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 移动端展开导航 */}
        {isMobile && mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col p-2">
              {SECTIONS.filter((s) => s.id !== 'footer').map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-accent"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </header>

      {/* 命令面板弹窗 · 概念 39 */}
      {cmdOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 pt-[15vh] backdrop-blur-sm"
          onClick={() => setCmdOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索概念或区域…"
                className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="max-h-[320px] overflow-y-auto p-2">
              {matchedSections.length === 0 && matchedConcepts.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">没有找到结果</div>
              )}
              {matchedSections.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    页面区域
                  </div>
                  {matchedSections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className="flex w-full items-center rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-accent"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              {matchedConcepts.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    概念（共 80 个）
                  </div>
                  {matchedConcepts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCmdOpen(false);
                        highlight(c.id);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-foreground hover:bg-accent"
                    >
                      <span className="w-6 font-mono text-xs text-primary">
                        {String(c.id).padStart(2, '0')}
                      </span>
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-[11px] text-muted-foreground">{c.chapterName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
