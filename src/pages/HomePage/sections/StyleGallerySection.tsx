import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, LayoutGrid, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import InteractiveDot from '@/components/InteractiveDot';
import { useTheme } from '@/components/ThemeProvider';

interface StyleProduct {
  id: number;
  name: string;
  tag: string;
  desc: string;
  color: string;
  stat: string;
  statLabel: string;
  logoIcon: string;
}

const PRODUCTS: StyleProduct[] = [
  {
    id: 1,
    name: '抖音',
    tag: '短视频',
    desc: '记录美好生活，激发创造表达',
    color: '#000000',
    stat: '8-10 亿',
    statLabel: '日活跃用户',
    logoIcon: '🎵',
  },
  {
    id: 2,
    name: '飞书',
    tag: '企业协作',
    desc: '先进企业协作与管理平台',
    color: '#3370FF',
    stat: '1000 万+',
    statLabel: '企业用户',
    logoIcon: '📘',
  },
  {
    id: 3,
    name: '剪映',
    tag: '视频创作',
    desc: '一站式视频剪辑与创作工具',
    color: '#0057FF',
    stat: '10 亿+',
    statLabel: '全球下载量',
    logoIcon: '✂️',
  },
];

const STYLES = [
  { id: 'minimal', num: 61, name: '极简主义', desc: '大留白、单色强调' },
  { id: 'editorial', num: 62, name: '编辑杂志风', desc: '超大标题、引语、分栏' },
  { id: 'swiss', num: 63, name: '瑞士风', desc: '严格网格、左对齐、编号' },
  { id: 'glass', num: 64, name: '玻璃拟态', desc: '半透明 + 背景模糊 + 细亮边框' },
  { id: 'brutal', num: 65, name: '新野兽派', desc: '粗黑边框 + 硬阴影 + 大字号' },
  { id: 'dark', num: 66, name: '深色模式', desc: '深色背景 + 浅色文字' },
  { id: 'mono', num: 67, name: '单色双色', desc: '双色调处理，hover 恢复原色' },
  { id: 'mesh', num: 68, name: '网格渐变', desc: '柔和色团背景 + 缓慢漂移' },
  { id: 'grain', num: 69, name: '颗粒噪点', desc: '胶片质感，减少塑料感' },
  { id: 'neo', num: 70, name: '新拟态', desc: '同色系凸起与凹陷' },
] as const;

type StyleItem = (typeof STYLES)[number];

export default function StyleGallerySection() {
  const [viewMode, setViewMode] = useState<'gallery' | 'compare'>('gallery');
  const [grainOn, setGrainOn] = useState(true);

  useEffect(() => {
    const onSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.section !== 'style-gallery') return;
      if (detail.view === 'gallery' || detail.view === 'gallery-focus') setViewMode('gallery');
      else if (detail.view === 'compare') setViewMode('compare');
    };
    window.addEventListener('concept-view-switch', onSwitch);
    return () => window.removeEventListener('concept-view-switch', onSwitch);
  }, []);

  return (
    <section id="style-gallery" className="relative w-full py-20 md:py-28">
      <div data-concept-id="61" className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <div className="mb-3 text-sm font-medium text-primary">VISUAL STYLE</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">视觉风格画廊</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            同一组内容，十种不同视觉风格，直观感受设计手法的差异
          </p>

          <div className="mt-6 flex items-center justify-center">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(v) => v && setViewMode(v as 'gallery' | 'compare')}
            >
              <ToggleGroupItem value="gallery" aria-label="逐个查看">
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                逐个查看
              </ToggleGroupItem>
              <ToggleGroupItem value="compare" aria-label="并排对比">
                <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                并排对比
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </motion.div>

        {viewMode === 'gallery' ? (
          <div className="space-y-6">
            {STYLES.map((style, idx) => (
              <StyleBlock
                key={style.id}
                style={style}
                index={idx}
                grainOn={grainOn}
                onToggleGrain={() => setGrainOn(!grainOn)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {STYLES.map((style) => (
              <CompareCard key={style.id} style={style} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StyleBlock({
  style,
  index,
  grainOn,
  onToggleGrain,
}: {
  style: StyleItem;
  index: number;
  grainOn: boolean;
  onToggleGrain: () => void;
}) {
  return (
    <motion.div
      data-concept-id={style.num}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative overflow-hidden rounded-2xl border border-border/40"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="font-mono text-xs">
            {String(style.num).padStart(2, '0')}
          </Badge>
          <span className="text-base font-semibold">{style.name}</span>
          <span className="text-sm text-muted-foreground">{style.desc}</span>
        </div>
        {style.id === 'grain' && (
          <div className="flex items-center gap-2">
            <InteractiveDot label="点击切换噪点" />
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={onToggleGrain}>
              {grainOn ? '关闭噪点' : '开启噪点'}
            </Button>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8">
        <StyleRenderer styleId={style.id} products={PRODUCTS} grainOn={grainOn} />
      </div>
    </motion.div>
  );
}

function CompareCard({ style }: { style: StyleItem }) {
  return (
    <div
      data-concept-id={style.num}
      className="group rounded-lg border border-border/40 p-2 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <div className="aspect-square overflow-hidden rounded-md">
        <CompactRenderer styleId={style.id} product={PRODUCTS[0]} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] font-medium">{style.name}</span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {String(style.num).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}

function StyleRenderer({
  styleId,
  products,
  grainOn,
}: {
  styleId: string;
  products: StyleProduct[];
  grainOn: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // 61 极简主义
  if (styleId === 'minimal') {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col border border-border/50 p-6 transition-all hover:border-primary/30"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {p.tag}
              </span>
              <div className="flex h-10 w-10 items-center justify-center text-xl">{p.logoIcon}</div>
            </div>
            <div className="text-2xl font-bold text-foreground">{p.name}</div>
            <div className="mt-2 h-px w-10 bg-primary" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            <div className="mt-6">
              <div className="text-3xl font-bold text-primary">{p.stat}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.statLabel}</div>
            </div>
            <button className="mt-6 flex items-center gap-1.5 text-xs font-medium text-primary transition-all hover:gap-2.5">
              了解更多 <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // 62 编辑杂志风
  if (styleId === 'editorial') {
    return (
      <div className="font-serif">
        <div className="mb-6 flex items-baseline gap-4 border-b border-foreground/20 pb-4">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Issue 01 · 产品特辑
          </div>
          <div className="ml-auto text-xs text-muted-foreground">2026</div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h3 className="text-4xl font-bold leading-none md:text-5xl">
              产品
              <br />
              <span className="italic text-primary">矩阵</span>
              <br />
              特辑
            </h3>
            <blockquote className="mt-6 border-l-2 border-primary pl-4 text-sm italic leading-relaxed text-foreground/70">
              三款核心产品，覆盖创作、协作与表达，连接全球数十亿用户。
            </blockquote>
          </div>
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {products.map((p) => (
                <article key={p.id} className="flex flex-col">
                  <div className="mb-2 font-mono text-[11px] text-primary">
                    §{String(p.id).padStart(2, '0')}
                  </div>
                  <h4 className="text-lg font-bold leading-tight">{p.name}</h4>
                  <div className="my-2 text-xs uppercase tracking-wider text-muted-foreground">
                    {p.tag}
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/60">{p.desc}</p>
                  <div className="mt-4">
                    <div className="text-xl font-bold">{p.stat}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {p.statLabel}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 63 瑞士风
  if (styleId === 'swiss') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-px bg-foreground/20">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`bg-background p-6 ${i === 0 ? 'col-span-12 md:col-span-6' : 'col-span-6 md:col-span-3'}`}
            >
              <div className="font-mono text-xs font-bold text-foreground/40">
                {String(p.id).padStart(2, '0')}
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight">{p.name}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {p.tag}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-foreground/60">{p.desc}</p>
              <div className="mt-6">
                <div className="text-3xl font-bold tracking-tight">{p.stat}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {p.statLabel}
                </div>
              </div>
            </div>
          ))}
          <div className="col-span-12 flex items-center justify-between bg-foreground px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-background">
            <span>GRID SYSTEM · 12 COL</span>
            <span>SWISS DESIGN</span>
            <span>MMXXVI</span>
          </div>
        </div>
        <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span>HELVETICA · AKZIDENZ GROTESK</span>
          <span>LEFT ALIGN · RIGOROUS GRID</span>
        </div>
      </div>
    );
  }

  // 64 玻璃拟态
  if (styleId === 'glass') {
    const glassCard = isDark
      ? 'border border-white/10 bg-white/5 hover:bg-white/10'
      : 'border border-white/50 bg-white/30 hover:bg-white/40';
    const glassIcon = isDark ? 'bg-white/10' : 'bg-white/50';
    const glassBorder = isDark ? 'border-white/10' : 'border-white/30';
    const glassShadow = isDark
      ? '0 8px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '0 8px 32px -8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)';

    return (
      <div className="relative -mx-6 -my-6 overflow-hidden md:-mx-8 md:-my-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-400/15 to-amber-300/20" />
        <motion.div
          className="absolute left-10 top-6 h-40 w-40 rounded-full bg-primary/30 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-6 right-16 h-48 w-48 rounded-full bg-pink-400/30 blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative grid grid-cols-1 gap-5 p-6 md:grid-cols-3 md:p-8">
          {products.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col gap-3 rounded-2xl ${glassCard} p-6 backdrop-blur-xl transition-all`}
              style={{ boxShadow: glassShadow }}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${glassIcon} text-2xl backdrop-blur-sm`}
                >
                  {p.logoIcon}
                </div>
                <Badge variant="outline" className="text-[10px] backdrop-blur-sm">
                  {p.tag}
                </Badge>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{p.name}</div>
                <p className="mt-1 text-xs leading-relaxed text-foreground/60">{p.desc}</p>
              </div>
              <div className={`mt-2 border-t ${glassBorder} pt-3`}>
                <div className="text-2xl font-bold text-foreground">{p.stat}</div>
                <div className="text-[10px] text-foreground/50">{p.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 65 新野兽派
  if (styleId === 'brutal') {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {products.map((p, i) => (
          <div
            key={p.id}
            className="relative flex flex-col gap-3 border-[4px] border-foreground bg-background p-6 transition-transform hover:-translate-x-1.5 hover:-translate-y-1.5"
            style={{
              boxShadow: isDark
                ? `${8 + i * 2}px ${8 + i * 2}px 0 var(--primary)`
                : `${8 + i * 2}px ${8 + i * 2}px 0 #1A1A1A`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="border-[3px] border-foreground bg-primary px-2 py-1 font-mono text-sm font-black text-primary-foreground">
                {String(p.id).padStart(2, '0')}
              </div>
              <div className="text-3xl">{p.logoIcon}</div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest">{p.tag}</div>
              <div className="mt-1 text-3xl font-black leading-none">{p.name}</div>
            </div>
            <p className="text-xs font-medium leading-relaxed">{p.desc}</p>
            <div className="mt-2 border-t-[3px] border-foreground pt-3">
              <div className="text-3xl font-black">{p.stat}</div>
              <div className="text-[10px] font-bold uppercase">{p.statLabel}</div>
            </div>
            <button className="mt-2 border-[3px] border-foreground bg-foreground px-4 py-2 text-xs font-bold uppercase text-background transition-colors hover:border-primary hover:bg-primary">
              了解更多 →
            </button>
          </div>
        ))}
      </div>
    );
  }

  // 66 深色模式
  if (styleId === 'dark') {
    return (
      <div className="-mx-6 -my-6 bg-[#0A0A0A] p-6 text-white md:-mx-8 md:-my-8 md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest text-white/40">
            Dark Mode · 深色主题
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl ring-1 ring-white/10">
                  {p.logoIcon}
                </div>
                <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-white/60">
                  {p.tag}
                </span>
              </div>
              <div>
                <div className="text-xl font-semibold text-white">{p.name}</div>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{p.desc}</p>
              </div>
              <div className="mt-2 border-t border-white/10 pt-3">
                <div className="text-2xl font-bold text-white">{p.stat}</div>
                <div className="text-[10px] text-white/40">{p.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 67 单色双色
  if (styleId === 'mono') {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-border/40 transition-all hover:border-primary/40"
          >
            <div
              className="relative aspect-[16/10] w-full transition-all duration-500 group-hover:grayscale-0 group-hover:sepia-0 group-hover:hue-rotate-0 group-hover:saturate-100"
              style={{
                background: `linear-gradient(145deg, ${p.color}22, ${p.color}55)`,
                filter: 'grayscale(100%) sepia(35%) hue-rotate(85deg) saturate(50%)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110">
                {p.logoIcon}
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-foreground/60 px-1.5 py-0.5 text-[10px] text-background backdrop-blur-sm">
                Hover 查看原色
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-foreground">{p.name}</div>
                <Badge variant="outline" className="text-[10px]">
                  {p.tag}
                </Badge>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
              <div className="mt-auto pt-2">
                <div className="text-xl font-bold text-primary">{p.stat}</div>
                <div className="text-[10px] text-muted-foreground">{p.statLabel}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 68 网格渐变
  if (styleId === 'mesh') {
    const meshCard = isDark
      ? 'border border-white/10 bg-white/5 hover:bg-white/10'
      : 'border border-white/60 bg-white/50 hover:bg-white/70';
    const meshIcon = isDark ? 'bg-white/10' : 'bg-white/70';
    return (
      <div className="relative -mx-6 -my-6 overflow-hidden p-6 md:-mx-8 md:-my-8 md:p-8">
        <motion.div
          className="absolute left-0 top-0 h-56 w-56 rounded-full bg-primary/25 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-300/25 blur-3xl"
          animate={{ x: [0, -35, 0], y: [0, 25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full bg-secondary/50 blur-3xl"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col gap-3 rounded-2xl ${meshCard} p-6 shadow-lg backdrop-blur-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${meshIcon} text-2xl shadow-sm backdrop-blur-sm`}
                >
                  {p.logoIcon}
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {p.tag}
                </Badge>
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{p.name}</div>
                <p className="mt-1 text-xs leading-relaxed text-foreground/60">{p.desc}</p>
              </div>
              <div className="mt-2 border-t border-white/40 pt-3">
                <div className="text-2xl font-bold text-primary">{p.stat}</div>
                <div className="text-[10px] text-muted-foreground">{p.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 69 颗粒噪点
  if (styleId === 'grain') {
    const grainBg = isDark
      ? 'bg-gradient-to-br from-[#1A1F1C] to-[#0F1410]'
      : 'bg-gradient-to-br from-[#F5F1E8] to-[#EDE4D2]';
    const grainCard = isDark ? 'bg-[#1A1F1C]/80' : 'bg-[#F8F4EB]/80';
    const grainIcon = isDark ? 'bg-[#0F1410]' : 'bg-[#EDE4D2]';
    return (
      <div className={`relative -mx-6 -my-6 ${grainBg} p-6 md:-mx-8 md:-my-8 md:p-8`}>
        {grainOn && (
          <div
            className={`pointer-events-none absolute inset-0 ${
              isDark ? 'mix-blend-overlay' : 'mix-blend-multiply'
            }`}
            style={{
              opacity: isDark ? 0.25 : 0.18,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }}
          />
        )}
        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col gap-3 rounded-xl border border-foreground/15 ${grainCard} p-6 backdrop-blur-sm`}
              style={{
                boxShadow: isDark ? '3px 3px 0 rgba(0,0,0,0.3)' : '3px 3px 0 rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${grainIcon} text-2xl ring-1 ring-foreground/10`}
                >
                  {p.logoIcon}
                </div>
                <span className="font-serif text-[10px] italic text-muted-foreground">{p.tag}</span>
              </div>
              <div>
                <div className="font-serif text-xl font-bold text-foreground">{p.name}</div>
                <p className="mt-1 font-serif text-xs leading-relaxed text-foreground/60">
                  {p.desc}
                </p>
              </div>
              <div className="mt-2 border-t border-foreground/10 pt-3">
                <div className="font-serif text-2xl font-bold text-foreground">{p.stat}</div>
                <div className="font-serif text-[10px] italic text-muted-foreground">
                  {p.statLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 70 新拟态
  if (styleId === 'neo') {
    const neoBg = isDark ? '#1A1F1C' : '#E8ECF0';
    const neoText = isDark ? '#C8CECB' : '#4A4F57';
    const neoMuted = isDark ? '#8A908D' : '#8A8F97';
    const shadowOut = isDark
      ? '6px 6px 12px #0F1210, -6px -6px 12px #252B28'
      : '8px 8px 16px #c5c9ce, -8px -8px 16px #ffffff';
    const shadowIn = isDark
      ? 'inset 3px 3px 6px #0F1210, inset -3px -3px 6px #252B28'
      : 'inset 3px 3px 6px #c5c9ce, inset -3px -3px 6px #ffffff';

    return (
      <div className="-mx-6 -my-6 p-6 md:-mx-8 md:-my-8 md:p-8" style={{ background: neoBg }}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <div
              key={p.id}
              className="flex flex-col gap-4 rounded-2xl p-6"
              style={{ background: neoBg, boxShadow: shadowOut }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl"
                  style={{ background: neoBg, boxShadow: shadowIn }}
                >
                  {p.logoIcon}
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                  style={{ background: neoBg, color: neoMuted, boxShadow: shadowIn }}
                >
                  {p.tag}
                </span>
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: neoText }}>
                  {p.name}
                </div>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: neoMuted }}>
                  {p.desc}
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: neoText }}>
                  {p.stat}
                </div>
                <div className="text-[10px]" style={{ color: neoMuted }}>
                  {p.statLabel}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="flex-1 rounded-xl py-2 text-xs font-medium transition-all active:scale-[0.98]"
                  style={{
                    background: neoBg,
                    color: i === 1 ? 'var(--primary)' : neoMuted,
                    boxShadow: shadowOut.replace(/8px/g, '4px').replace(/16px/g, '8px'),
                  }}
                >
                  了解更多
                </button>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: neoBg,
                    boxShadow: shadowOut.replace(/8px/g, '3px').replace(/16px/g, '6px'),
                  }}
                  aria-label="播放"
                >
                  <Play className="h-3.5 w-3.5" style={{ color: neoMuted }} />
                </button>
              </div>
              {/* 凹陷滑槽 */}
              <div className="space-y-1.5">
                <div
                  className="flex items-center justify-between text-[10px]"
                  style={{ color: neoMuted }}
                >
                  <span>用户活跃度</span>
                  <span className="font-mono">{65 + i * 10}%</span>
                </div>
                <div
                  className="relative h-2 rounded-full"
                  style={{
                    background: neoBg,
                    boxShadow: shadowIn.replace(/3px/g, '2px').replace(/6px/g, '4px'),
                  }}
                >
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-primary/70"
                    style={{ width: `${65 + i * 10}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full"
                    style={{
                      left: `calc(${65 + i * 10}% - 10px)`,
                      background: neoBg,
                      boxShadow: shadowOut.replace(/8px/g, '2px').replace(/16px/g, '4px'),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

/** 并排对比用的缩略渲染 */
function CompactRenderer({ styleId, product }: { styleId: string; product: StyleProduct }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (styleId === 'minimal') {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 border border-border/40 text-center">
        <div className="text-[10px] text-muted-foreground">{product.tag}</div>
        <div className="text-sm font-semibold">{product.name}</div>
        <div className="h-px w-6 bg-primary" />
      </div>
    );
  }
  if (styleId === 'editorial') {
    return (
      <div className="flex h-full flex-col justify-center p-2 font-serif">
        <div className="text-base font-bold leading-none">
          产品
          <br />
          <span className="italic text-primary">矩阵</span>
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          §{product.id} {product.name}
        </div>
      </div>
    );
  }
  if (styleId === 'swiss') {
    return (
      <div className="grid h-full grid-cols-2 gap-px bg-border">
        <div className="bg-card p-2">
          <div className="font-mono text-[9px] text-muted-foreground">01</div>
          <div className="text-xs font-semibold">{product.name}</div>
        </div>
        <div className="bg-muted/30 p-2">
          <div className="font-mono text-[9px] text-muted-foreground">02</div>
          <div className="text-xs font-semibold">{product.tag}</div>
        </div>
      </div>
    );
  }
  if (styleId === 'glass') {
    return (
      <div className="relative flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-purple-400/20 p-2">
        <div
          className={`w-full rounded-lg border p-2 backdrop-blur-sm ${
            isDark ? 'border-white/10 bg-white/5' : 'border-white/40 bg-white/40'
          }`}
        >
          <div className="text-[9px] text-muted-foreground">{product.tag}</div>
          <div className="text-xs font-semibold">{product.name}</div>
        </div>
      </div>
    );
  }
  if (styleId === 'brutal') {
    return (
      <div className="flex h-full items-center p-2">
        <div
          className="w-full border-2 border-foreground bg-background p-2"
          style={{ boxShadow: isDark ? '3px 3px 0 var(--primary)' : '3px 3px 0 #1A1A1A' }}
        >
          <div className="text-[9px] font-bold uppercase">{product.tag}</div>
          <div className="text-sm font-black">{product.name}</div>
        </div>
      </div>
    );
  }
  if (styleId === 'dark') {
    return (
      <div className="flex h-full items-center bg-[#0A0A0A] p-2 text-white">
        <div className="w-full rounded-md border border-white/10 bg-white/5 p-2">
          <div className="text-[9px] text-white/50">{product.tag}</div>
          <div className="text-xs font-semibold">{product.name}</div>
        </div>
      </div>
    );
  }
  if (styleId === 'mono') {
    return (
      <div className="flex h-full flex-col">
        <div
          className="flex-1"
          style={{
            background: `linear-gradient(135deg, ${product.color}22, ${product.color}44)`,
            filter: 'grayscale(100%) sepia(40%) hue-rotate(80deg) saturate(40%)',
          }}
        />
        <div className="p-1.5">
          <div className="text-xs font-semibold">{product.name}</div>
        </div>
      </div>
    );
  }
  if (styleId === 'mesh') {
    return (
      <div className="relative flex h-full items-center overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 p-2">
        <div className="absolute -left-2 -top-2 h-10 w-10 rounded-full bg-primary/30 blur-xl" />
        <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-amber-300/30 blur-xl" />
        <div
          className={`relative w-full rounded-lg border p-2 backdrop-blur-sm ${
            isDark ? 'border-white/10 bg-white/5' : 'border-white/60 bg-white/50'
          }`}
        >
          <div className="text-xs font-semibold">{product.name}</div>
        </div>
      </div>
    );
  }
  if (styleId === 'grain') {
    return (
      <div
        className={`relative flex h-full items-center bg-gradient-to-br p-2 ${
          isDark ? 'from-[#1A1F1C] to-[#0F1410]' : 'from-[#F5F1E8] to-[#EDE8DC]'
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isDark ? 'mix-blend-overlay' : 'mix-blend-multiply'
          }`}
          style={{
            opacity: isDark ? 0.25 : 0.15,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
        <div className="relative w-full rounded-md border border-foreground/20 bg-background/80 p-2">
          <div className="font-serif text-xs font-bold">{product.name}</div>
        </div>
      </div>
    );
  }
  if (styleId === 'neo') {
    const neoBg = isDark ? '#1A1F1C' : '#E8ECF0';
    const neoText = isDark ? '#C8CECB' : '#6B7280';
    const shadowOut = isDark
      ? '4px 4px 8px #0F1210, -4px -4px 8px #252B28'
      : '4px 4px 8px #c5c9ce, -4px -4px 8px #ffffff';
    return (
      <div className="flex h-full items-center justify-center p-2" style={{ background: neoBg }}>
        <div
          className="w-full rounded-lg p-2 text-center text-xs font-semibold"
          style={{ background: neoBg, color: neoText, boxShadow: shadowOut }}
        >
          {product.name}
        </div>
      </div>
    );
  }
  return null;
}
