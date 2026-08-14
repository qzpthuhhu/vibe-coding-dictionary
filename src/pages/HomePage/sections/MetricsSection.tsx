import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'framer-motion';
import { LayoutGrid, Gauge } from 'lucide-react';
import { MOCK_METRICS } from '@/data/bytedance';
import { cn } from '@/lib/utils';

type ViewMode = 'bento' | 'gauge';

/** 数字滚动动画：进入视口后从 0 弹簧过渡到目标值 */
function AnimatedNumber({ value, inView }: { value: string; inView: boolean }) {
  const numMatch = value.match(/[\d.]+/);
  const num = numMatch ? parseFloat(numMatch[0]) : 0;
  const suffix = value.replace(/[\d.]+/, '');

  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => {
    const rounded = num >= 100 ? Math.round(v) : Number(v.toFixed(1));
    return rounded + suffix;
  });

  useEffect(() => {
    if (inView) spring.set(num);
  }, [inView, num, spring]);

  return <motion.span className="tabular-nums">{display}</motion.span>;
}

export default function MetricsSection() {
  const [view, setView] = useState<ViewMode>('bento');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // 监听左侧索引发来的视图切换事件
  useEffect(() => {
    const onSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.section !== 'metrics') return;
      if (detail.view === 'bento' || detail.view === 'gauge') setView(detail.view);
    };
    window.addEventListener('concept-view-switch', onSwitch);
    return () => window.removeEventListener('concept-view-switch', onSwitch);
  }, []);

  return (
    <section id="metrics" className="relative w-full py-20 md:py-28">
      <div data-concept-id="3" className="pointer-events-none absolute inset-0" aria-hidden="true" />
      <div data-concept-id="8" className="pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div ref={ref} className="mb-10 text-center md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-3 text-sm font-medium text-primary">KEY METRICS</div>
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">关键数据</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              字节跳动在全球市场的核心业务指标，见证 AI 时代的高速增长
            </p>
          </motion.div>

          {/* 视图切换 */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card p-1 shadow-sm">
            <button
              onClick={() => setView('bento')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                view === 'bento'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Bento Grid
            </button>
            <button
              onClick={() => setView('gauge')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                view === 'gauge'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Gauge className="h-3.5 w-3.5" />
              仪表盘布局
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'bento' ? (
            <BentoView key="bento" inView={isInView} />
          ) : (
            <GaugeView key="gauge" inView={isInView} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** Bento Grid · 概念 3：大小不等的格子拼成信息密度不同的网格 */
function BentoView({ inView }: { inView: boolean }) {
  return (
    <motion.div
      data-concept-id="3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[160px] md:grid-cols-4 md:gap-4"
    >
      {MOCK_METRICS.map((metric, i) => {
        const isLarge = metric.size === 'lg';
        const isMedium = metric.size === 'md';

        return (
          <motion.div
            key={metric.id}
            /* 滚动出现 · 概念 41 */
            data-concept-id={i === 0 ? '41' : undefined}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
              isLarge && 'bg-gradient-to-br from-primary/5 to-card p-7 md:col-span-2 md:row-span-2',
            )}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'flex items-center justify-center rounded-lg bg-primary/10 text-primary',
                    isLarge ? 'h-10 w-10' : 'h-8 w-8',
                  )}
                >
                  {isLarge ? <Gauge className="h-5 w-5" /> : <LayoutGrid className="h-4 w-4" />}
                </div>
              </div>
              <div>
                <div
                  className={cn(
                    'font-bold tracking-tight text-foreground',
                    isLarge
                      ? 'text-4xl md:text-5xl'
                      : isMedium
                        ? 'text-2xl md:text-3xl'
                        : 'text-xl md:text-2xl',
                  )}
                >
                  <AnimatedNumber value={metric.value} inView={inView} />
                </div>
                <div
                  className={cn(
                    'mt-1 font-medium text-foreground/90',
                    isLarge ? 'text-base' : 'text-sm',
                  )}
                >
                  {metric.label}
                </div>
                {isLarge && (
                  <div className="mt-2 text-xs text-muted-foreground">{metric.description}</div>
                )}
              </div>
            </div>
            {isLarge && (
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/** 仪表盘布局 · 概念 8：等宽卡片 + 圆环进度，强调监控感 */
function GaugeView({ inView }: { inView: boolean }) {
  return (
    <motion.div
      data-concept-id="8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
    >
      {MOCK_METRICS.map((metric, i) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="flex flex-col items-center rounded-xl border border-border/50 bg-card p-5 shadow-sm"
        >
          <GaugeChart value={Math.min(100, i * 9 + 15)} inView={inView} />
          <div className="mt-3 text-center">
            <div className="text-lg font-bold tracking-tight md:text-xl">
              <AnimatedNumber value={metric.value} inView={inView} />
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">{metric.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function GaugeChart({ value, inView }: { value: number; inView: boolean }) {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, (v) => `${Math.round(v)}`);

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, value, spring]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = useTransform(
    spring,
    (v) => circumference - (v / 100) * circumference * 0.75,
  );

  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-[135deg]">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          className="text-muted/50"
          strokeLinecap="round"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={`${circumference * 0.75} ${circumference}`}
          style={{ strokeDashoffset: dashOffset }}
          className="text-primary"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-foreground">
        <motion.span>{display}</motion.span>%
      </div>
    </div>
  );
}
