import { useEffect, useState } from 'react';

/**
 * 跑马灯 · 概念 47
 * 两组内容无缝衔接横向循环；hover 暂停；尊重 prefers-reduced-motion（降级为静态标签列表）
 */
export default function Marquee({
  items,
  speed = 40,
}: {
  items: string[];
  speed?: number;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // 减少动态：降级为静态标签列表，信息不丢失
  if (reduced) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 px-6">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-border/50 bg-card/60 px-3 py-1 text-xs text-muted-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="group relative flex w-full overflow-hidden">
      {/* 两侧渐隐遮罩 */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

      {[0, 1].map((groupIndex) => (
        <div
          key={groupIndex}
          className="flex shrink-0 items-center gap-8 whitespace-nowrap px-4"
          style={{
            animation: `marquee-scroll ${speed}s linear infinite`,
          }}
          aria-hidden={groupIndex === 1}
        >
          {items.map((item) => (
            <span
              key={`${groupIndex}-${item}`}
              className="text-sm font-medium text-muted-foreground/70"
            >
              {item}
            </span>
          ))}
        </div>
      ))}

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .group:hover > div[style*="marquee-scroll"] {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
