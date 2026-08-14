import { useState, useEffect, useRef, type MouseEvent } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { AlignLeft, AlignHorizontalDistributeCenter } from 'lucide-react';
import { MOCK_TIMELINE } from '@/data/bytedance';
import { cn } from '@/lib/utils';

type ViewMode = 'vertical' | 'horizontal';

export default function TimelineSection() {
  const [view, setView] = useState<ViewMode>('vertical');

  useEffect(() => {
    const onSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.section !== 'timeline') return;
      if (detail.view === 'vertical' || detail.view === 'horizontal') setView(detail.view);
    };
    window.addEventListener('concept-view-switch', onSwitch);
    return () => window.removeEventListener('concept-view-switch', onSwitch);
  }, []);

  return (
    <section
      id="timeline"
      data-concept-id="18"
      className="relative w-full bg-muted/20 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <div className="mb-3 text-sm font-medium text-primary">OUR JOURNEY</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">发展时间线</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            从今日头条到 AI 时代，见证一家公司的进化之路
          </p>

          <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card p-1 shadow-sm">
            <button
              onClick={() => setView('vertical')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                view === 'vertical'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <AlignLeft className="h-3.5 w-3.5" />
              垂直时间线
            </button>
            <button
              onClick={() => setView('horizontal')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                view === 'horizontal'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <AlignHorizontalDistributeCenter className="h-3.5 w-3.5" />
              滚动吸附
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'vertical' ? (
            <VerticalTimeline key="vertical" />
          ) : (
            <HorizontalTimeline key="horizontal" />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** 垂直时间线 · 概念 18 + 固定叙事 · 概念 17 */
function VerticalTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {MOCK_TIMELINE.map((stage, si) => (
        <TimelineStage key={stage.period} stage={stage} index={si} />
      ))}
    </motion.div>
  );
}

function TimelineStage({
  stage,
  index,
}: {
  stage: (typeof MOCK_TIMELINE)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <div ref={ref} className="relative flex gap-6 py-10 md:gap-12">
      {/* 固定叙事 · 概念 17：左侧标题随滚动固定 */}
      <div className="w-28 shrink-0 md:w-44">
        <div
          data-concept-id="17"
          className={cn(
            'sticky top-24 transition-all duration-500',
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-40',
          )}
        >
          <div className="font-mono text-xs text-primary/70">STAGE {index + 1}</div>
          <div className="mt-1 text-2xl font-black tracking-tight md:text-3xl">
            {stage.period}
          </div>
          <div className="mt-1 font-mono text-sm text-muted-foreground">{stage.years}</div>
        </div>
      </div>

      <div className="relative flex-1 border-l-2 border-border/60 pl-8">
        {stage.events.map((event, ei) => (
          <motion.div
            key={`${event.year}-${event.title}`}
            data-concept-id={index === 0 && ei === 0 ? '18' : undefined}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: ei * 0.1 }}
            className="relative pb-8 last:pb-0"
          >
            <div className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background md:-left-[49px]" />
            <div className="font-mono text-sm font-medium text-primary">{event.year}</div>
            <h4 className="mt-1 font-semibold text-foreground">{event.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** 横向时间线 · 滚动吸附 概念 44 + 横向滚动 概念 45 */
function HorizontalTimeline() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const allEvents = MOCK_TIMELINE.flatMap((s) =>
    s.events.map((e) => ({ ...e, period: s.period })),
  );

  // 垂直滚轮转横向滚动
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: 'auto' });
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.pageX, scrollLeft: scrollerRef.current?.scrollLeft ?? 0 };
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !scrollerRef.current) return;
    e.preventDefault();
    scrollerRef.current.scrollLeft = dragStart.current.scrollLeft - (e.pageX - dragStart.current.x);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-3 text-center text-xs text-muted-foreground">
        ← 鼠标滚轮 / 拖拽 / 滑动查看，卡片会自动吸附对齐 →
      </div>
      <div
        ref={scrollerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        data-concept-id="45"
        className={cn(
          'timeline-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4',
          isDragging ? 'cursor-grabbing select-none' : 'cursor-grab',
        )}
      >
        <style>{`
          .timeline-scroll::-webkit-scrollbar { height: 8px; }
          .timeline-scroll::-webkit-scrollbar-track { background: var(--border); border-radius: 999px; }
          .timeline-scroll::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 999px; }
        `}</style>
        {allEvents.map((event, i) => (
          <div
            key={`${event.year}-${event.title}`}
            data-concept-id={i === 0 ? '44' : undefined}
            className="flex w-[85%] shrink-0 snap-start sm:w-[380px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-xl border border-border/50 bg-card p-6 shadow-sm"
            >
              <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-primary/70">
                {event.period}
              </div>
              <div className="mb-2 font-mono text-sm font-bold text-primary">{event.year}</div>
              <h4 className="text-lg font-semibold">{event.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{event.detail}</p>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={() => scrollerRef.current?.scrollBy({ left: -380, behavior: 'smooth' })}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-md"
          aria-label="向左滚动"
        >
          ←
        </button>
        <button
          onClick={() => scrollerRef.current?.scrollBy({ left: 380, behavior: 'smooth' })}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-md"
          aria-label="向右滚动"
        >
          →
        </button>
      </div>
    </motion.div>
  );
}
