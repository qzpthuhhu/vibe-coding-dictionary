import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid3X3,
  LayoutList,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CONCEPTS, CHAPTERS, type IConcept } from '@/data/concepts';
import { CONCEPT_DETAILS } from '@/data/conceptDetails';

const PAGE_SIZE = 16;

type CardStyle = 'card' | 'minimal' | 'swiss' | 'brutal';

/** 探索模式里 63/65/67/70 依赖的视图 → 卡片风格映射 */
const VIEW_TO_STYLE: Record<string, CardStyle> = {
  swiss: 'swiss',
  brutalist: 'brutal',
  mono: 'minimal',
  neumorphic: 'card',
};

/**
 * 概念词典 · 80 个概念的完整索引
 * 章节筛选 + 关键词搜索 + 分页 + 4 种卡片风格；点击卡片跳转到对应演示区域
 */
export default function DictionarySection() {
  const [search, setSearch] = useState('');
  const [chapter, setChapter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [cardStyle, setCardStyle] = useState<CardStyle>('card');
  const [selected, setSelected] = useState<IConcept | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.section !== 'dictionary') return;
      const next = VIEW_TO_STYLE[detail.view as string];
      if (next) setCardStyle(next);
    };
    window.addEventListener('concept-view-switch', onSwitch);
    return () => window.removeEventListener('concept-view-switch', onSwitch);
  }, []);

  const filtered = useMemo(() => {
    let list = CONCEPTS;
    if (chapter !== 'all') {
      list = list.filter((c) => c.chapter === Number(chapter));
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.chapterName.toLowerCase().includes(q) ||
          (CONCEPT_DETAILS[c.id]?.en ?? '').toLowerCase().includes(q) ||
          String(c.id).includes(q),
      );
    }
    return list;
  }, [search, chapter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [search, chapter]);

  const detail = selected ? CONCEPT_DETAILS[selected.id] : undefined;

  const jumpToSection = (concept: IConcept) => {
    const el = document.getElementById(concept.section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelected(null);
    }
  };

  const handleCardClick = (concept: IConcept) => {
    // demoOnly 概念没有独立演示区，只开详情
    if (concept.demoOnly) setSelected(concept);
    else jumpToSection(concept);
  };

  const copyPrompt = async () => {
    if (!detail?.prompt) return;
    try {
      await navigator.clipboard.writeText(detail.prompt);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = detail.prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    toast.success('提示词已复制');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const visiblePages = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <section id="dictionary" className="relative w-full bg-muted/20 py-20 md:py-28">
      {/* CSS Grid 布局 · 概念 5 */}
      <div data-concept-id="5" className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <div className="mb-3 text-sm font-medium text-primary">CONCEPT DICTIONARY</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">概念词典</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            80 个网页设计概念完整索引，点击可跳转至对应演示区域
          </p>

          {/* 搜索 + 卡片风格切换 */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索概念名称、描述或编号…"
                className="h-10 pl-9"
              />
              {search && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setSearch('')}
                  aria-label="清除搜索"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <ToggleGroup
              type="single"
              value={cardStyle}
              onValueChange={(v) => v && setCardStyle(v as CardStyle)}
            >
              <ToggleGroupItem value="card" aria-label="卡片风">
                <Layers className="mr-1 h-3.5 w-3.5" />
                卡片
              </ToggleGroupItem>
              <ToggleGroupItem value="minimal" aria-label="极简风">
                <LayoutList className="mr-1 h-3.5 w-3.5" />
                极简
              </ToggleGroupItem>
              <ToggleGroupItem value="swiss" aria-label="瑞士风">
                <Grid3X3 className="mr-1 h-3.5 w-3.5" />
                瑞士
              </ToggleGroupItem>
              <ToggleGroupItem value="brutal" aria-label="野兽派">
                <BookOpen className="mr-1 h-3.5 w-3.5" />
                野兽
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* 章节筛选 */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant={chapter === 'all' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setChapter('all')}
              className="h-7 text-xs"
            >
              全部
              <span className="ml-1 font-mono text-[10px] opacity-70">{CONCEPTS.length}</span>
            </Button>
            {CHAPTERS.map((ch) => {
              const count = CONCEPTS.filter((c) => c.chapter === ch.id).length;
              return (
                <Button
                  key={ch.id}
                  variant={chapter === String(ch.id) ? 'default' : 'secondary'}
                  size="sm"
                  onClick={() => setChapter(String(ch.id))}
                  className="h-7 text-xs"
                >
                  第{ch.id}章
                  <span className="ml-1 font-mono text-[10px] opacity-70">{count}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* 结果统计 + 面包屑 · 概念 23 */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            <span className="font-mono">{filtered.length}</span> 个概念 · 第 {currentPage} /{' '}
            {totalPages} 页
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>概念词典</span>
            <span>/</span>
            <span>{chapter === 'all' ? '全部' : `第${chapter}章`}</span>
            <span>/</span>
            <span className="font-medium text-foreground">第{currentPage}页</span>
          </div>
        </div>

        {/* 概念网格 */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">没有找到匹配的概念</div>
              <div className="mt-1 text-xs text-muted-foreground">试试其他关键词</div>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${cardStyle}-${chapter}-${currentPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
            >
              {pageItems.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  onClick={() => handleCardClick(c)}
                  className="cursor-pointer"
                >
                  <DictCard concept={c} style={cardStyle} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 分页 · 概念 29 */}
        {totalPages > 1 && (
          <div data-concept-id="29" className="mt-8 flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="上一页"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              {visiblePages.map((p, idx) =>
                p === 'ellipsis' ? (
                  <span
                    key={`e-${idx}`}
                    className="flex h-8 w-8 items-center justify-center text-xs text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === currentPage ? 'default' : 'outline'}
                    className="h-8 w-8 px-0 text-xs"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
            </div>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="下一页"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {selected ? String(selected.id).padStart(2, '0') : ''}
              </Badge>
              <DialogTitle>{selected?.name}</DialogTitle>
              {detail?.en && <span className="text-xs text-muted-foreground">{detail.en}</span>}
            </div>
            <DialogDescription>
              {selected?.chapterName} · {selected?.level === 'region' ? '区域级' : '元素级'}概念
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            <div>
              <div className="mb-1.5 text-xs font-semibold text-muted-foreground">概念说明</div>
              <p className="text-sm leading-relaxed text-foreground">
                {detail?.desc ?? selected?.description}
              </p>
            </div>

            {detail?.scene && (
              <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
                <div className="mb-1.5 text-xs font-semibold text-muted-foreground">适合场景</div>
                <p className="text-sm leading-relaxed">{detail.scene}</p>
              </div>
            )}

            {detail?.prompt && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-semibold text-primary">AI 提示词</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 text-[11px]"
                    onClick={copyPrompt}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? '已复制' : '复制'}
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/80">
                  {detail.prompt}
                </p>
              </div>
            )}

            {detail?.here && (
              <div>
                <div className="mb-1.5 text-xs font-semibold text-muted-foreground">此处体现</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{detail.here}</p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              {selected && !selected.demoOnly && (
                <Button size="sm" onClick={() => selected && jumpToSection(selected)}>
                  跳转到演示
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
                关闭
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/** 概念卡片：4 种视觉风格（概念 63 瑞士 / 65 野兽派 / 67 单色 / 70 新拟态） */
function DictCard({ concept, style }: { concept: IConcept; style: CardStyle }) {
  const chapter = CHAPTERS.find((c) => c.id === concept.chapter);

  if (style === 'card') {
    return (
      <div
        data-concept-id={String(concept.id)}
        className="group flex h-full flex-col rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
      >
        <div className="mb-2 flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-[11px]">
            {String(concept.id).padStart(2, '0')}
          </Badge>
          {concept.demoOnly && (
            <Badge variant="secondary" className="text-[10px]">
              词典
            </Badge>
          )}
        </div>
        <div className="text-sm font-semibold text-foreground group-hover:text-primary">
          {concept.name}
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{concept.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-[10px] text-muted-foreground/70">
          <span>第{concept.chapter}章</span>
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
            {concept.demoOnly ? '查看详情' : '跳转 →'}
          </span>
        </div>
      </div>
    );
  }

  if (style === 'minimal') {
    return (
      <div
        data-concept-id={String(concept.id)}
        className="group flex h-full flex-col border-l-2 border-primary/30 bg-transparent p-4 transition-all hover:border-primary hover:bg-muted/30"
      >
        <div className="font-mono text-[11px] text-muted-foreground">
          {String(concept.id).padStart(2, '0')} · {concept.chapterName}
        </div>
        <div className="mt-1 text-base font-semibold text-foreground">{concept.name}</div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {concept.description}
        </p>
        <div className="mt-auto pt-2 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
          {concept.demoOnly ? '查看详情' : '点击跳转 →'}
        </div>
      </div>
    );
  }

  if (style === 'swiss') {
    return (
      <div
        data-concept-id={String(concept.id)}
        className="group relative flex h-full flex-col border border-foreground/10 bg-background p-4 transition-all hover:border-foreground/30"
      >
        <div className="font-mono text-2xl font-black leading-none text-foreground/10">
          {String(concept.id).padStart(2, '0')}
        </div>
        <div className="mt-1 text-sm font-bold uppercase tracking-tight text-foreground">
          {concept.name}
        </div>
        <div className="mt-0.5 text-[9px] uppercase tracking-widest text-muted-foreground">
          {concept.level === 'region' ? 'REGION' : 'ELEMENT'}
        </div>
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-foreground/70">
          {concept.description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-2 font-mono text-[9px] text-muted-foreground">
          <span>CH.{concept.chapter}</span>
          <span>{chapter?.range}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-concept-id={String(concept.id)}
      className="group relative flex h-full flex-col border-[3px] border-foreground bg-background p-4 transition-transform hover:-translate-x-1 hover:-translate-y-1"
      style={{ boxShadow: '4px 4px 0 var(--primary)' }}
    >
      <div className="flex items-center justify-between">
        <div className="border-[2px] border-foreground bg-primary px-1.5 py-0.5 font-mono text-[11px] font-black text-primary-foreground">
          №{String(concept.id).padStart(2, '0')}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-widest">
          {concept.level === 'region' ? 'REGION' : 'ELEM'}
        </span>
      </div>
      <div className="mt-2 text-base font-black leading-tight text-foreground">{concept.name}</div>
      <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-relaxed text-foreground/80">
        {concept.description}
      </p>
      <div className="mt-auto pt-2 text-[9px] font-bold uppercase text-muted-foreground">
        Ch.{concept.chapter} · {concept.chapterName}
      </div>
    </div>
  );
}
