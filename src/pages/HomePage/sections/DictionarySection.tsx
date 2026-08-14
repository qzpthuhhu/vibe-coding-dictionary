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

/** 只在词典区展示的概念 */
const DICT_CONCEPT_IDS = [5, 12, 13, 14, 29, 63, 65, 67, 70];
const PAGE_SIZE = 6;

type CardStyle = 'card' | 'minimal' | 'swiss' | 'brutal';

/** 视图切换映射：不同概念对应不同卡片风格 */
const VIEW_TO_STYLE: Record<string, CardStyle> = {
  swiss: 'swiss',
  brutalist: 'brutal',
  mono: 'minimal',
  neumorphic: 'card',
};

export default function DictionarySection() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [cardStyle, setCardStyle] = useState<CardStyle>('card');
  const [selected, setSelected] = useState<IConcept | null>(null);

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

  const dictConcepts = useMemo(
    () => CONCEPTS.filter((c) => DICT_CONCEPT_IDS.includes(c.id)),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return dictConcepts;
    return dictConcepts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.chapterName.toLowerCase().includes(q) ||
        (CONCEPT_DETAILS[c.id]?.en ?? '').toLowerCase().includes(q),
    );
  }, [dictConcepts, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  const detail = selected ? CONCEPT_DETAILS[selected.id] : undefined;

  const copyPrompt = async () => {
    if (!detail?.prompt) return;
    try {
      await navigator.clipboard.writeText(detail.prompt);
      toast.success('提示词已复制');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = detail.prompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast.success('提示词已复制');
    }
  };

  return (
    <section id="dictionary" className="relative w-full py-20 md:py-28">
      {/* CSS Grid 布局 · 概念 5 */}
      <div data-concept-id="5" className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <div className="mb-3 text-sm font-medium text-primary">CONCEPT DICTIONARY</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">概念词典</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            支持搜索、四种卡片风格切换与分页浏览，点击任意卡片查看说明与可直接复制的 AI 提示词
          </p>

          <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索概念名称或描述…"
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
        </motion.div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">没有找到匹配的概念</div>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 h-7 text-xs"
                onClick={() => setSearch('')}
              >
                清除搜索
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${cardStyle}-${currentPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setSelected(c)}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  size="sm"
                  variant={n === currentPage ? 'default' : 'outline'}
                  className="h-8 w-8 px-0 text-xs"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
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

        <div className="mt-4 text-center text-xs text-muted-foreground">
          共 {filtered.length} 个概念 · 第 {currentPage} / {totalPages} 页
        </div>

        {/* 多页网站 / 落地页 / 案例研究页 · 概念 12/13/14 */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              id: 12,
              name: '多页网站',
              lines: ['首页', '产品', '案例', '关于', '联系'],
              note: '内容按主题分散到多个独立页面，各页有自己的 URL',
            },
            {
              id: 13,
              name: '落地页',
              lines: ['Hero 主张', '核心卖点', '社会证明', 'CTA 转化'],
              note: '为单一转化目标设计，去掉一切干扰性导航',
            },
            {
              id: 14,
              name: '案例研究页',
              lines: ['背景与挑战', '解决方案', '实施过程', '量化结果'],
              note: '按叙事顺序展开，用数据收尾建立可信度',
            },
          ].map((item) => (
            <div
              key={item.id}
              data-concept-id={String(item.id)}
              className="rounded-xl border border-border/40 bg-card p-5"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {item.id}
                </Badge>
                <span className="text-sm font-semibold">{item.name}</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {item.lines.map((l, i) => (
                  <div
                    key={l}
                    className="flex items-center gap-2 rounded border border-border/30 bg-muted/20 px-2 py-1.5 text-[11px]"
                  >
                    <span className="font-mono text-muted-foreground">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>
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
              {detail?.en && (
                <span className="text-xs text-muted-foreground">{detail.en}</span>
              )}
            </div>
            <DialogDescription>
              {selected?.chapterName} ·{' '}
              {selected?.level === 'region' ? '区域级' : '元素级'}概念
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            <div>
              <div className="mb-1 text-xs font-semibold text-muted-foreground">概念说明</div>
              <p className="text-sm leading-relaxed">{detail?.desc ?? selected?.description}</p>
            </div>

            {detail?.scene && (
              <div>
                <div className="mb-1 text-xs font-semibold text-muted-foreground">适合场景</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{detail.scene}</p>
              </div>
            )}

            {detail?.prompt && (
              <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-semibold text-muted-foreground">AI 提示词</div>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={copyPrompt}>
                    <Copy className="mr-1 h-3 w-3" />
                    复制
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
                  {detail.prompt}
                </p>
              </div>
            )}

            {detail?.here && (
              <div>
                <div className="mb-1 text-xs font-semibold text-muted-foreground">此处体现</div>
                <p className="text-sm leading-relaxed text-muted-foreground">{detail.here}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/** 概念卡片：四种视觉风格（概念 63 / 65 / 67 / 70） */
function DictCard({ concept, style }: { concept: IConcept; style: CardStyle }) {
  const chapter = CHAPTERS.find((c) => c.id === concept.chapter);
  const detail = CONCEPT_DETAILS[concept.id];

  // 卡片风（新拟态倾向）· 概念 70
  if (style === 'card') {
    return (
      <div
        data-concept-id={String(concept.id)}
        className="group flex h-full flex-col rounded-xl border border-border/40 bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
      >
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-xs">
            {String(concept.id).padStart(2, '0')}
          </Badge>
          <Badge variant="secondary" className="text-[10px]">
            {concept.level === 'region' ? '区域级' : '元素级'}
          </Badge>
        </div>
        <div className="text-lg font-bold text-foreground">{concept.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{detail?.en}</div>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {concept.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4 text-[10px] text-muted-foreground">
          <span>第 {concept.chapter} 章 · {concept.chapterName}</span>
          <span className="text-primary transition-all group-hover:translate-x-1">查看详情 →</span>
        </div>
      </div>
    );
  }

  // 极简 / 单色风 · 概念 67
  if (style === 'minimal') {
    return (
      <div
        data-concept-id={String(concept.id)}
        className="group flex h-full flex-col border-l-2 border-primary/30 p-5 transition-all hover:border-primary hover:bg-muted/30"
      >
        <div className="font-mono text-xs text-muted-foreground">
          {String(concept.id).padStart(2, '0')} · {concept.chapterName}
        </div>
        <div className="mt-2 text-xl font-semibold text-foreground">{concept.name}</div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {concept.description}
        </p>
        <div className="mt-auto pt-4 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
          点击查看 →
        </div>
      </div>
    );
  }

  // 瑞士风 · 概念 63
  if (style === 'swiss') {
    return (
      <div
        data-concept-id={String(concept.id)}
        className="flex h-full flex-col border border-foreground/15 bg-background p-5 transition-all hover:border-foreground/40"
      >
        <div className="font-mono text-3xl font-black leading-none text-foreground/15">
          {String(concept.id).padStart(2, '0')}
        </div>
        <div className="mt-2 text-base font-bold uppercase tracking-tight text-foreground">
          {concept.name}
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {concept.level === 'region' ? 'REGION' : 'ELEMENT'}
        </div>
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-foreground/70">
          {concept.description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-4 font-mono text-[10px] text-muted-foreground">
          <span>CH.{concept.chapter}</span>
          <span>{chapter?.range}</span>
        </div>
      </div>
    );
  }

  // 新野兽派 · 概念 65
  return (
    <div
      data-concept-id={String(concept.id)}
      className="flex h-full flex-col border-[3px] border-foreground bg-background p-5 transition-transform hover:-translate-x-1 hover:-translate-y-1"
      style={{ boxShadow: '6px 6px 0 var(--primary)' }}
    >
      <div className="flex items-center justify-between">
        <div className="border-[2px] border-foreground bg-primary px-2 py-0.5 font-mono text-xs font-black text-primary-foreground">
          №{String(concept.id).padStart(2, '0')}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          {concept.level === 'region' ? 'REGION' : 'ELEM'}
        </span>
      </div>
      <div className="mt-3 text-xl font-black leading-tight text-foreground">{concept.name}</div>
      <p className="mt-2 line-clamp-2 text-xs font-medium leading-relaxed text-foreground/80">
        {concept.description}
      </p>
      <div className="mt-auto pt-3 text-[10px] font-bold uppercase text-muted-foreground">
        Ch.{concept.chapter} · {concept.chapterName}
      </div>
    </div>
  );
}
