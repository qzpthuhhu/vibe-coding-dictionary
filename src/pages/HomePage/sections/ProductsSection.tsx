import { useMemo, useRef, useState, useEffect, type MouseEvent } from 'react';
import { ArrowRightLeft, LayoutGrid, Rows3, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { MOCK_PRODUCT_CATEGORIES, type IProduct } from '@/data/bytedance';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import InteractiveDot from '@/components/InteractiveDot';
import { cn } from '@/lib/utils';

type ViewMode = 'card' | 'masonry' | 'horizontal';

const VIEW_DESCRIPTIONS: Record<ViewMode, string> = {
  card: '概念 1·卡片式布局：信息封装在等高独立卡片中，视觉清晰易扫描',
  masonry: '概念 2·瀑布流：多列不等高卡片自然排列，充分利用垂直空间',
  horizontal: '概念 45·横向滚动：内容沿水平方向排列，左右滑动浏览',
};

/** 把所有品类的产品拍扁并按名称去重 */
function useFlatProducts() {
  return useMemo(() => {
    const list: IProduct[] = [];
    MOCK_PRODUCT_CATEGORIES.forEach((c) => c.products.forEach((p) => list.push(p)));
    const seen = new Set<string>();
    return list.filter((p) => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });
  }, []);
}

export default function ProductsSection() {
  const [selected, setSelected] = useState<{
    name: string;
    description: string;
    logo: string;
  } | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('card');

  useEffect(() => {
    const onSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.section !== 'products') return;
      if (detail.view === 'card' || detail.view === 'masonry' || detail.view === 'horizontal') {
        setView(detail.view);
      }
    };
    window.addEventListener('concept-view-switch', onSwitch);
    return () => window.removeEventListener('concept-view-switch', onSwitch);
  }, []);

  return (
    <section id="products" className="relative w-full bg-muted/20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <div className="mb-3 text-sm font-medium text-primary">PRODUCT MATRIX</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">产品矩阵</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            8 大品类，覆盖短视频、AI、企业服务、电商、游戏等核心赛道
          </p>

          <div className="mt-6 inline-flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-card p-1 shadow-sm">
              {(
                [
                  { key: 'card', label: '卡片式布局', Icon: LayoutGrid },
                  { key: 'masonry', label: '瀑布流', Icon: Rows3 },
                  { key: 'horizontal', label: '横向滚动', Icon: ArrowRightLeft },
                ] as const
              ).map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setView(key)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
                    view === key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
            <div className="h-4 text-[11px] text-muted-foreground/80">
              {VIEW_DESCRIPTIONS[view]}
            </div>
          </div>
        </motion.div>

        <LayoutGroup>
          <AnimatePresence mode="wait">
            {view === 'masonry' ? (
              <MasonryView key="masonry" onCardClick={setSelected} onLogoClick={setLightbox} />
            ) : view === 'horizontal' ? (
              <HorizontalView key="horizontal" onCardClick={setSelected} onLogoClick={setLightbox} />
            ) : (
              <CardView key="card" onCardClick={setSelected} onLogoClick={setLightbox} />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {/* 模态框 · 概念 31 */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selected && (
                <Image src={selected.logo} alt="" className="h-8 w-8 rounded object-contain" />
              )}
              {selected?.name}
            </DialogTitle>
            <DialogDescription>{selected?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">
            点击产品卡片弹出这个浮层 —— 这是概念 31「模态框」的真实演示，按 Esc 或点击遮罩可关闭。
          </div>
        </DialogContent>
      </Dialog>

      {/* 图片灯箱 · 概念 37 */}
      <Dialog open={!!lightbox} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>产品 Logo</DialogTitle>
            <DialogDescription>点击 Logo 放大查看 —— 概念 37「图片灯箱」演示</DialogDescription>
          </DialogHeader>
          {lightbox && (
            <div className="flex items-center justify-center rounded-lg bg-card p-8">
              <Image src={lightbox} alt="放大查看" className="max-h-[300px] w-auto object-contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

interface ViewProps {
  onCardClick: (p: { name: string; description: string; logo: string }) => void;
  onLogoClick: (url: string) => void;
}

/** 卡片式布局 · 概念 1：按品类分组 + 严格等高 */
function CardView({ onCardClick, onLogoClick }: ViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
      data-concept-id="1"
    >
      {MOCK_PRODUCT_CATEGORIES.map((category) => (
        <div key={category.id}>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <h3 className="text-xl font-semibold md:text-2xl">{category.name}</h3>
            <div className="ml-2 h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.products.map((product, pi) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: pi * 0.08 }}
                className="h-full"
              >
                <UniformCard
                  product={product}
                  onClick={() =>
                    onCardClick({
                      name: product.name,
                      description: product.longDesc || product.description,
                      logo: product.logo,
                    })
                  }
                  onLogoClick={(e) => {
                    e.stopPropagation();
                    onLogoClick(product.logo);
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function UniformCard({
  product,
  onClick,
  onLogoClick,
}: {
  product: IProduct;
  onClick: () => void;
  onLogoClick: (e: MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      data-concept-id="31"
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <Image
          data-concept-id="37"
          src={product.logo}
          alt={product.name}
          className="h-10 w-10 shrink-0 cursor-zoom-in rounded-lg object-contain transition-transform hover:scale-110"
          onClick={onLogoClick}
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-foreground">{product.name}</h4>
          <div className="truncate text-xs text-muted-foreground">{product.year}</div>
        </div>
      </div>
      <div className="mt-3 text-sm font-medium text-primary">{product.stat}</div>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">
        {product.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
        <span className="text-xs text-muted-foreground">查看详情</span>
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </div>
  );
}

/** 瀑布流 · 概念 2：CSS columns 真瀑布流，不分品类混排，高度由内容量决定 */
function MasonryView({ onCardClick, onLogoClick }: ViewProps) {
  const allProducts = useFlatProducts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      data-concept-id="2"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          全部 {allProducts.length} 个产品 · 瀑布流
        </h3>
        <div className="text-xs text-muted-foreground/70">内容量决定高度</div>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
        {allProducts.map((product, i) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: (i % 8) * 0.06 }}
            className="mb-4 break-inside-avoid"
          >
            <MasonryCard
              product={product}
              onClick={() =>
                onCardClick({
                  name: product.name,
                  description: product.longDesc || product.description,
                  logo: product.logo,
                })
              }
              onLogoClick={(e) => {
                e.stopPropagation();
                onLogoClick(product.logo);
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function MasonryCard(props: {
  product: IProduct;
  onClick: () => void;
  onLogoClick: (e: MouseEvent) => void;
}) {
  const { size } = props.product;
  if (size === 'large') return <LargeMasonryCard {...props} />;
  if (size === 'medium') return <MediumMasonryCard {...props} />;
  return <SmallMasonryCard {...props} />;
}

/** 3D 倾斜卡片 · 概念 73 的倾斜逻辑 */
function useTilt(maxDeg: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotate({
      y: ((x - centerX) / centerX) * maxDeg,
      x: ((centerY - y) / centerY) * maxDeg,
    });
  };

  const handleLeave = () => setRotate({ x: 0, y: 0 });

  const style = {
    transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.1s ease-out, box-shadow 0.3s',
  };

  return { ref, handleMove, handleLeave, style };
}

function LargeMasonryCard({
  product,
  onClick,
  onLogoClick,
}: {
  product: IProduct;
  onClick: () => void;
  onLogoClick: (e: MouseEvent) => void;
}) {
  const { ref, handleMove, handleLeave, style } = useTilt(6);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      data-concept-id="73"
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all hover:shadow-xl"
      style={style}
    >
      <div
        className={cn(
          'relative h-24 w-full bg-gradient-to-br',
          product.coverColor ?? 'from-primary/20 to-transparent',
        )}
      >
        <InteractiveDot label="点击查看详情" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      </div>

      <div className="relative px-5 pb-5 pt-2">
        <div className="-mt-8 flex items-end gap-3">
          <Image
            data-concept-id="37"
            src={product.logo}
            alt={product.name}
            className="h-14 w-14 shrink-0 cursor-zoom-in rounded-xl border border-border/50 bg-card p-1 object-contain shadow-md transition-transform hover:scale-110"
            onClick={onLogoClick}
          />
          <div className="min-w-0 flex-1 pb-1">
            <h4 className="truncate text-lg font-bold text-foreground">{product.name}</h4>
            <div className="truncate text-xs text-muted-foreground">{product.year}</div>
          </div>
        </div>

        <div className="mt-4 text-base font-semibold text-primary">{product.stat}</div>

        {product.extraStats.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {product.extraStats.map((s) => (
              <div key={s} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-1 w-1 shrink-0 rounded-full bg-primary/50" />
                <span className="truncate">{s}</span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-sm leading-relaxed text-foreground/80">
          {product.longDesc || product.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          了解更多
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function MediumMasonryCard({
  product,
  onClick,
  onLogoClick,
}: {
  product: IProduct;
  onClick: () => void;
  onLogoClick: (e: MouseEvent) => void;
}) {
  const { ref, handleMove, handleLeave, style } = useTilt(7);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      data-concept-id="73"
      className="group relative cursor-pointer rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-lg"
      style={style}
    >
      <InteractiveDot label="点击查看详情" />
      <div className="flex items-start gap-3">
        <Image
          data-concept-id="37"
          src={product.logo}
          alt={product.name}
          className="h-11 w-11 shrink-0 cursor-zoom-in rounded-lg object-contain transition-transform hover:scale-110"
          onClick={onLogoClick}
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-foreground">{product.name}</h4>
          <div className="truncate text-xs text-muted-foreground">{product.year}</div>
        </div>
      </div>

      <div className="mt-3 text-sm font-medium text-primary">{product.stat}</div>

      {product.extraStats.length > 0 && (
        <div className="mt-2 space-y-1">
          {product.extraStats.slice(0, 2).map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-1 w-1 shrink-0 rounded-full bg-primary/40" />
              <span className="truncate">{s}</span>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

      {product.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** 悬停微交互 · 概念 48 */
function SmallMasonryCard({
  product,
  onClick,
  onLogoClick,
}: {
  product: IProduct;
  onClick: () => void;
  onLogoClick: (e: MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      data-concept-id="48"
      className="group cursor-pointer rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center gap-2.5">
        <Image
          data-concept-id="52"
          src={product.logo}
          alt={product.name}
          className="h-8 w-8 shrink-0 cursor-zoom-in rounded-md object-contain transition-transform hover:scale-110"
          onClick={onLogoClick}
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-foreground">{product.name}</h4>
          <div className="truncate text-[11px] text-muted-foreground">{product.year}</div>
        </div>
      </div>
      <div className="mt-2 truncate text-xs font-medium text-primary">{product.stat}</div>
    </div>
  );
}

/** 横向滚动 · 概念 45：scroll-snap 水平浏览 */
function HorizontalView({ onCardClick, onLogoClick }: ViewProps) {
  const allProducts = useFlatProducts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      data-concept-id="45"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          全部 {allProducts.length} 个产品 · 横向滚动
        </h3>
        <div className="text-xs text-muted-foreground/70">← 左右滑动浏览 →</div>
      </div>

      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-6"
        style={{ scrollbarWidth: 'thin' }}
      >
        {allProducts.map((product, i) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="shrink-0 snap-start"
          >
            <div
              onClick={() =>
                onCardClick({
                  name: product.name,
                  description: product.longDesc || product.description,
                  logo: product.logo,
                })
              }
              className="group flex h-48 w-72 cursor-pointer flex-col rounded-xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={product.logo}
                  alt={product.name}
                  className="h-10 w-10 shrink-0 cursor-zoom-in rounded-lg object-contain"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogoClick(product.logo);
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-base font-semibold text-foreground">
                    {product.name}
                  </h4>
                  <div className="truncate text-xs text-muted-foreground">{product.year}</div>
                </div>
              </div>
              <div className="mt-3 text-sm font-medium text-primary">{product.stat}</div>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                {product.description}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-xs text-muted-foreground">查看详情</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
