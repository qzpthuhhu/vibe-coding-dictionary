import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight } from 'lucide-react';
import { CONCEPTS, CHAPTERS } from '@/data/concepts';
import { SECTIONS, cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useHighlight } from './HighlightProvider';
import ExploreModeToggle from './ExploreModeToggle';

interface SidebarIndexProps {
  activeSection: string;
}

export default function SidebarIndex({ activeSection }: SidebarIndexProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { highlight } = useHighlight();

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return CONCEPTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        String(c.id).includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [search]);

  const scrollToConcept = (id: number) => {
    highlight(id);
    setOpen(false);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setOpen(false);
  };

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="border-b border-border/40 px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
            VC
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Vibe Coding</div>
            <div className="text-[11px] text-muted-foreground">视觉词典 · 80 Concepts</div>
          </div>
        </div>
      </div>

      {/* 搜索 */}
      <div className="border-b border-border/40 p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索 80 个概念…"
            className="h-9 w-full rounded-md border border-input bg-muted/30 pl-9 pr-8 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-accent"
              aria-label="清空搜索"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <AnimatePresence mode="wait">
          {filtered ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="space-y-1"
            >
              <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                搜索结果 · {filtered.length} 个
              </div>
              {filtered.length === 0 ? (
                <div className="px-2 py-8 text-center text-xs text-muted-foreground">
                  没有匹配的概念
                </div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => scrollToConcept(c.id)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <span className="font-mono text-xs text-primary">
                      {String(c.id).padStart(2, '0')}
                    </span>
                    <span className="flex-1 truncate text-foreground">{c.name}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chapters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* 区域导航 · 锚点跳转 概念 24 */}
              <div>
                <div className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  页面区域
                </div>
                <div data-concept-id="24" className="space-y-0.5">
                  {SECTIONS.filter((s) => s.id !== 'footer').map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                        activeSection === s.id
                          ? 'bg-primary/10 font-medium text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                    >
                      <ChevronRight className="h-3 w-3 shrink-0" />
                      <span className="truncate">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 章节导航 · 侧边导航 概念 26 */}
              {CHAPTERS.map((ch) => (
                <div key={ch.id} data-concept-id="26">
                  <div className="mb-2 flex items-center justify-between px-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      第{ch.id}章 · {ch.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/70">
                      {ch.range}
                    </span>
                  </div>
                  {/* 气泡提示 概念 34（title 原生 tooltip） */}
                  <div className="space-y-0.5" data-concept-id="34">
                    {CONCEPTS.filter((c) => c.chapter === ch.id).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => scrollToConcept(c.id)}
                        title={`${c.name} — ${c.description}`}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs transition-colors hover:bg-accent"
                      >
                        <span className="w-6 shrink-0 font-mono text-[11px] text-primary/70">
                          {String(c.id).padStart(2, '0')}
                        </span>
                        <span className="truncate text-foreground/80">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 探索模式开关 */}
      <div className="border-t border-border/40 p-3">
        <ExploreModeToggle />
      </div>

      {/* 当前区域提示 */}
      <div className="border-t border-border/40 p-3 text-[10px] text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>当前区域</span>
          <span className="font-medium text-foreground">
            {SECTIONS.find((s) => s.id === activeSection)?.label ?? '...'}
          </span>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg md:hidden"
          aria-label="打开概念索引"
        >
          <Search className="h-5 w-5" />
        </button>
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-[70] bg-black/50"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 z-[80] h-screen w-80 border-r border-border bg-card"
              >
                {content}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <aside
      data-concept-id="7"
      data-sidebar-index
      className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-border/40 bg-card/50 backdrop-blur-md md:flex"
      style={{ width: 'clamp(200px, 15vw, 280px)' }}
    >
      {content}
    </aside>
  );
}
