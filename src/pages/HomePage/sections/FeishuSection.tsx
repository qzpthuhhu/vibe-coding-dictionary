import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Users, Workflow, Layers } from 'lucide-react';
import { MOCK_FEISHU_PRODUCTS } from '@/data/bytedance';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  { id: 'base', name: '基础协作', count: 12, Icon: Layers },
  { id: 'org', name: '组织管理', count: 7, Icon: Users },
  { id: 'ai', name: 'AI 产品', count: 8, Icon: Sparkles },
  { id: 'platform', name: '平台开放', count: 4, Icon: Workflow },
] as const;

type CategoryId = (typeof CATEGORIES)[number]['id'];

export default function FeishuSection() {
  const [active, setActive] = useState<CategoryId>('base');
  const products = MOCK_FEISHU_PRODUCTS.filter((p) => p.category === active);

  useEffect(() => {
    const onSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.section !== 'feishu') return;
      if (detail.view === 'tab' || detail.view === 'split') setActive('base');
    };
    window.addEventListener('concept-view-switch', onSwitch);
    return () => window.removeEventListener('concept-view-switch', onSwitch);
  }, []);

  return (
    <section id="feishu" className="relative w-full py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <div className="mb-3 text-sm font-medium text-primary">FEISHU ECOSYSTEM</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">飞书生态</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            31 个产品，4 大品类，一站式企业协作与 AI 办公平台
          </p>
        </motion.div>

        {/* 分屏布局 · 概念 4 */}
        <div data-concept-id="4" className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* 标签切换 · 概念 25 */}
          <div data-concept-id="25" className="lg:w-64 lg:shrink-0">
            <div className="sticky top-24 space-y-2">
              {CATEGORIES.map((cat) => {
                const isActive = active === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActive(cat.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                      isActive
                        ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                        : 'border-border/50 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <cat.Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{cat.name}</div>
                      <div className="text-xs opacity-70">{cat.count} 个产品</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 右侧内容 */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {products.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="group rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground">{p.name}</h4>
                      {p.highlight && (
                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                          {p.highlight}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{p.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
