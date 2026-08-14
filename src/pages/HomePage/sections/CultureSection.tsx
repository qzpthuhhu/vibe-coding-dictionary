import { useState, useRef, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { MOCK_CULTURE, type ICultureValue } from '@/data/bytedance';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

export default function CultureSection() {
  const [openDrawer, setOpenDrawer] = useState<number | null>(null);
  const selected = MOCK_CULTURE.find((c) => c.id === openDrawer);

  return (
    <section id="culture" data-concept-id="49" className="relative w-full py-20 md:py-28">
      <div data-concept-id="16" className="pointer-events-none absolute inset-0" aria-hidden="true" />
      <div data-concept-id="74" className="pointer-events-none absolute inset-0" aria-hidden="true" />
      <div data-concept-id="32" className="pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <div className="mb-3 text-sm font-medium text-primary">CULTURE</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">企业文化</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            六条核心价值观，塑造一家公司的文化基因
          </p>
          <p className="mt-2 text-sm text-muted-foreground/80">和优秀的人，做有挑战的事</p>
        </motion.div>

        {/* 功能网格 · 概念 16 + 错峰动画 · 概念 49 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {MOCK_CULTURE.map((item, i) => (
            <SpotlightCard
              key={item.id}
              item={item}
              index={i}
              onClick={() => setOpenDrawer(item.id)}
            />
          ))}
        </div>
      </div>

      {/* 抽屉 · 概念 32 */}
      <Sheet open={openDrawer !== null} onOpenChange={(o) => !o && setOpenDrawer(null)}>
        <SheetContent data-concept-id="32">
          <SheetHeader>
            <SheetTitle className="text-2xl">{selected?.title}</SheetTitle>
            <SheetDescription className="font-mono text-xs uppercase tracking-wider">
              {selected?.subtitle}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <p className="leading-relaxed text-muted-foreground">{selected?.description}</p>
            <div className="rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">关于概念 32「抽屉」</div>
              <p className="mt-1 text-xs">
                从侧边滑出的面板，用于展示详情或二级操作。比模态框更轻量，不完全打断主流程，移动端会自动改为从底部滑出。
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

/** 聚光灯悬停 · 概念 74：跟随鼠标的径向渐变高光 */
function SpotlightCard({
  item,
  index,
  onClick,
}: {
  item: ICultureValue;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      data-concept-id={index === 0 ? '16' : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      /* 错峰动画 · 概念 49：每张卡延迟 0.08s 依次入场 */
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div
        data-concept-id={index === 0 ? '74' : undefined}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, color-mix(in srgb, var(--primary) 18%, transparent), transparent 60%)`,
        }}
      />

      <div className="relative z-10">
        <div className="font-mono text-xs font-medium text-primary/70">
          0{item.id}
        </div>
        <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
        <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {item.subtitle}
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
          了解更多 →
        </div>
      </div>
    </motion.div>
  );
}
