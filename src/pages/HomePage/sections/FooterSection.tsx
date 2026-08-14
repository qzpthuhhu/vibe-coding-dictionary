import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Github, Gauge } from 'lucide-react';
import { COMPANY_INFO } from '@/data/bytedance';
import { SECTIONS } from '@/lib/utils';

interface PerfMetric {
  label: string;
  value: string;
  hint: string;
  good: boolean;
}

/**
 * 页脚 · 概念 20
 * 返回顶部 · 概念 30
 * 性能预算 · 概念 80（用 Performance API 采集真实指标）
 */
export default function FooterSection() {
  const [showTop, setShowTop] = useState(false);
  const [metrics, setMetrics] = useState<PerfMetric[]>([]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 采集真实性能指标
  useEffect(() => {
    const collected: PerfMetric[] = [];

    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav) {
      const dcl = nav.domContentLoadedEventEnd - nav.startTime;
      collected.push({
        label: 'DCL',
        value: `${Math.round(dcl)} ms`,
        hint: 'DOM 可交互时间',
        good: dcl < 2000,
      });
    }

    let cls = 0;
    let lcpObserver: PerformanceObserver | undefined;
    let clsObserver: PerformanceObserver | undefined;

    try {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        if (!last) return;
        setMetrics((prev) => {
          const next = prev.filter((m) => m.label !== 'LCP');
          next.push({
            label: 'LCP',
            value: `${Math.round(last.startTime)} ms`,
            hint: '最大内容渲染',
            good: last.startTime < 2500,
          });
          return next.sort((a, b) => a.label.localeCompare(b.label));
        });
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        })[]) {
          if (!entry.hadRecentInput) cls += entry.value;
        }
        setMetrics((prev) => {
          const next = prev.filter((m) => m.label !== 'CLS');
          next.push({
            label: 'CLS',
            value: cls.toFixed(3),
            hint: '累积布局偏移',
            good: cls < 0.1,
          });
          return next.sort((a, b) => a.label.localeCompare(b.label));
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // 浏览器不支持对应 entry type，静默跳过
    }

    if (collected.length) {
      setMetrics((prev) => [...prev, ...collected].sort((a, b) => a.label.localeCompare(b.label)));
    }

    return () => {
      lcpObserver?.disconnect();
      clsObserver?.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer id="footer" data-concept-id="20" className="relative w-full border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* 品牌区 */}
          <div className="md:col-span-4">
            <div className="text-lg font-bold tracking-tight">Vibe Coding 视觉词典</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              80 个网页视觉与交互概念的可交互实现，每个概念都能在真实页面里点开、看到、复制走用。
            </p>
            <a
              href="https://github.com/qzpthuhhu/vibe-coding-dictionary"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="h-4 w-4" />
              GitHub 开源仓库
            </a>
          </div>

          {/* 区域导航 */}
          <div className="md:col-span-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              页面区域
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="text-left text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 性能预算 · 概念 80 */}
          <div data-concept-id="80" className="md:col-span-3">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              <Gauge className="h-3.5 w-3.5" />
              性能指标
            </div>
            <div className="space-y-2">
              {metrics.length === 0 ? (
                <div className="text-xs text-muted-foreground">正在采集…</div>
              ) : (
                metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between rounded-md border border-border/40 px-3 py-2"
                  >
                    <div>
                      <div className="font-mono text-xs font-medium">{m.label}</div>
                      <div className="text-[10px] text-muted-foreground">{m.hint}</div>
                    </div>
                    <div
                      className={`font-mono text-xs font-semibold ${
                        m.good ? 'text-primary' : 'text-destructive'
                      }`}
                    >
                      {m.value}
                    </div>
                  </div>
                ))
              )}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
              数值由浏览器 Performance API 实时采集，不同设备与网络会有差异
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>
            内容示例取材于 {COMPANY_INFO.name} 公开信息 · 仅用于设计概念演示
          </span>
          <span>MIT License · 2026</span>
        </div>
      </div>

      {/* 返回顶部 · 概念 30 */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            data-concept-id="30"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground"
            aria-label="返回顶部"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
