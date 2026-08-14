import { useState, useRef, useEffect, type ComponentType, type ReactNode, type MouseEvent } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  Zap,
  Magnet,
  Box,
  Lightbulb,
  Type,
  Scissors,
  Sparkles,
  Layers,
  Activity,
  Gauge,
  Eye,
  MousePointer,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import InteractiveDot from '@/components/InteractiveDot';
import MagneticButton from '@/components/MagneticButton';

/** 概念 80 性能预算：Core Web Vitals 指标与预算对比 */
const PERF_METRICS = [
  { name: 'LCP', value: 1.2, unit: 's', budget: 2.5, label: '最大内容绘制' },
  { name: 'CLS', value: 0.03, unit: '', budget: 0.1, label: '累积布局偏移' },
  { name: 'FID', value: 18, unit: 'ms', budget: 100, label: '首次输入延迟' },
  { name: 'TTI', value: 2.1, unit: 's', budget: 3.8, label: '可交互时间' },
];

const DEMOS: {
  id: string;
  num: number;
  name: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { id: 'cursor', num: 71, name: '自定义光标', desc: '进入该区域光标变成自定义样式（仅桌面端）', icon: MousePointer },
  { id: 'magnetic', num: 72, name: '磁吸按钮', desc: '鼠标靠近按钮被吸引，3 种强度对比', icon: Magnet },
  { id: 'tilt3d', num: 73, name: '三维倾斜卡片', desc: '鼠标移动卡片明显倾斜，可调节强度', icon: Box },
  { id: 'spotlight', num: 74, name: '聚光灯悬停', desc: '深色网格背景，鼠标移动光斑跟随', icon: Lightbulb },
  { id: 'textmask', num: 75, name: '图片文字蒙版', desc: '大标题文字内部填充流动渐变', icon: Type },
  { id: 'clipreveal', num: 76, name: '裁切揭示', desc: 'clip-path 动画逐步揭示完整内容', icon: Scissors },
  { id: 'particles', num: 77, name: 'WebGL 粒子动画', desc: '粒子跟随鼠标吸引，点击重播', icon: Sparkles },
  { id: 'viewtrans', num: 78, name: '视图过渡', desc: '点击卡片放大为详情，元素平滑衔接', icon: Layers },
  { id: 'reducemotion', num: 79, name: '减少动态', desc: '模拟系统级减少动态偏好，动画降级', icon: Activity },
  { id: 'perfbudget', num: 80, name: '性能预算', desc: 'Core Web Vitals 指标与预算对比', icon: Gauge },
];

/**
 * 高级效果实验场 · 概念 71-80
 * 单列大卡片：每个概念独占一整行，演示区有充足空间完整展开效果
 */
export default function AdvancedLabSection() {
  return (
    <section
      id="advanced-lab"
      className="relative w-full bg-gradient-to-b from-background via-muted/20 to-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:mb-14"
        >
          <div className="mb-3 text-sm font-medium text-primary">CHAPTER 08 · ADVANCED EFFECTS</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">高级效果实验场</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            10 种前沿视觉与交互效果，每个都可交互体验
          </p>
        </motion.div>

        <div className="space-y-6">
          {DEMOS.map((d) => (
            <DemoBlock key={d.id} num={d.num} name={d.name} desc={d.desc} icon={d.icon}>
              {d.id === 'cursor' && <CustomCursorDemo />}
              {d.id === 'magnetic' && <MagneticDemo />}
              {d.id === 'tilt3d' && <Tilt3dDemo />}
              {d.id === 'spotlight' && <SpotlightDemo />}
              {d.id === 'textmask' && <TextMaskDemo />}
              {d.id === 'clipreveal' && <ClipRevealDemo />}
              {d.id === 'particles' && <ParticlesDemo />}
              {d.id === 'viewtrans' && <ViewTransitionDemo />}
              {d.id === 'reducemotion' && <ReduceMotionDemo />}
              {d.id === 'perfbudget' && <PerformanceBudgetDemo />}
            </DemoBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoBlock({
  num,
  name,
  desc,
  icon: Icon,
  children,
}: {
  num: number;
  name: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <Card
        data-concept-id={String(num)}
        className="relative min-h-[380px] overflow-hidden border-border/50 bg-card/80 backdrop-blur transition-shadow hover:shadow-md"
      >
        <InteractiveDot label="互动试试" />
        <CardContent className="flex h-full flex-col p-6">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="shrink-0 font-mono text-xs">
                  {String(num).padStart(2, '0')}
                </Badge>
                <span className="text-lg font-semibold">{name}</span>
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
            </div>
          </div>
          <div className="flex-1 rounded-xl border border-border/30 bg-muted/20 p-6">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/** 71 自定义光标 */
function CustomCursorDemo() {
  const areaRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false });
  const [cursorType, setCursorType] = useState<'default' | 'view' | 'drag' | 'open'>('default');

  const LABELS: Record<string, string> = {
    default: '点击',
    view: '查看',
    drag: '拖拽',
    open: '打开',
  };

  return (
    <div
      ref={areaRef}
      onMouseMove={(e: MouseEvent) => {
        const rect = areaRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
      }}
      onMouseLeave={() => setPos((p) => ({ ...p, visible: false }))}
      className="relative h-48 w-full cursor-none overflow-hidden rounded-lg bg-gradient-to-br from-foreground/5 to-transparent"
    >
      {pos.visible && (
        <motion.div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
          animate={{ x: pos.x, y: pos.y }}
          transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.3 }}
        >
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
            <div className="absolute inset-1 rounded-full bg-primary/20" />
            <MousePointer className="h-3 w-3 text-primary" />
          </div>
          <div className="mt-1 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[9px] font-medium text-background">
            {LABELS[cursorType]}
          </div>
        </motion.div>
      )}
      <div className="grid h-full grid-cols-3 gap-2 p-3">
        {[
          { label: '查看图片', type: 'view' as const },
          { label: '拖拽排序', type: 'drag' as const },
          { label: '打开链接', type: 'open' as const },
        ].map((item) => (
          <button
            key={item.label}
            onMouseEnter={() => setCursorType(item.type)}
            onMouseLeave={() => setCursorType('default')}
            className="flex items-center justify-center rounded-md border border-border/40 bg-card text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground">
        ↖ 在区域内移动鼠标
      </div>
    </div>
  );
}

/** 72 磁吸按钮 */
function MagneticDemo() {
  const buttons = [
    { label: '弱磁吸', strength: 15, className: '!bg-muted !text-foreground' },
    { label: '中磁吸', strength: 30, className: '!bg-secondary !text-secondary-foreground' },
    { label: '强磁吸', strength: 60, className: '' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-10 py-6">
      {buttons.map((b) => (
        <MagneticButton
          key={b.label}
          strength={b.strength}
          className={`h-24 w-24 !px-0 !py-0 ${b.className}`}
          onClick={() => toast.success(`${b.label}被点击`)}
        >
          <span className="flex flex-col items-center gap-1">
            <Magnet className="h-4 w-4" />
            <span className="text-sm font-medium">{b.label}</span>
            <span className="text-[10px] font-normal opacity-70">强度 {b.strength}</span>
          </span>
        </MagneticButton>
      ))}
    </div>
  );
}

/** 73 三维倾斜卡片 */
function Tilt3dDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [strength, setStrength] = useState(15);

  const rotateX = useTransform(y, [-100, 100], [strength, -strength]);
  const rotateY = useTransform(x, [-100, 100], [-strength, strength]);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 15, mass: 0.3 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 15, mass: 0.3 });

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      <div className="flex-1" style={{ perspective: '1000px' }}>
        <motion.div
          ref={ref}
          onMouseMove={(e: MouseEvent) => {
            const rect = ref.current?.getBoundingClientRect();
            if (!rect) return;
            x.set(e.clientX - rect.left - rect.width / 2);
            y.set(e.clientY - rect.top - rect.height / 2);
          }}
          onMouseLeave={() => {
            x.set(0);
            y.set(0);
          }}
          style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
          className="mx-auto w-56 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xl"
        >
          <div
            className="h-28 bg-gradient-to-br from-primary/60 via-secondary/40 to-primary/20"
            style={{ transform: 'translateZ(20px)' }}
          />
          <div className="space-y-3 p-5" style={{ transform: 'translateZ(30px)' }}>
            <div className="text-base font-bold">3D Tilt Card</div>
            <div className="text-xs text-muted-foreground">移动鼠标体验三维倾斜</div>
            <div className="h-2 w-3/4 rounded-full bg-muted" />
            <div className="h-2 w-1/2 rounded-full bg-muted/60" />
          </div>
        </motion.div>
      </div>
      <div className="flex-1 space-y-3">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <Label>倾斜强度</Label>
            <span className="font-mono text-muted-foreground">{strength}°</span>
          </div>
          <Slider
            value={[strength]}
            onValueChange={(v) => setStrength(v[0])}
            min={5}
            max={30}
            step={1}
            aria-label="倾斜强度"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Box className="h-3.5 w-3.5" />
          <span>鼠标在卡片上移动，卡片随之倾斜</span>
        </div>
      </div>
    </div>
  );
}

/** 74 聚光灯悬停 */
function SpotlightDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  return (
    <div
      ref={ref}
      onMouseMove={(e: MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      className="relative h-56 w-full overflow-hidden rounded-lg bg-foreground/90"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle 120px at ${pos.x}% ${pos.y}%, rgba(255,255,255,0.25), transparent 70%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <Lightbulb className="mb-3 h-8 w-8 text-primary/60" />
        <div className="text-lg font-semibold text-white/80">Spotlight Hover</div>
        <div className="mt-1 text-xs text-white/40">移动鼠标，光斑跟随</div>
      </div>
    </div>
  );
}

/** 75 图片文字蒙版 */
function TextMaskDemo() {
  return (
    <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-background">
      <div className="text-center">
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          className="text-6xl font-black leading-none tracking-tight"
          style={{
            backgroundImage:
              'linear-gradient(135deg, var(--primary) 0%, #3370FF 30%, #FFD60A 60%, var(--primary) 100%)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          GRADIENT
        </motion.div>
        <div className="mt-3 text-sm font-semibold tracking-[0.4em] text-muted-foreground">
          TEXT MASK EFFECT
        </div>
        <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </div>
  );
}

/** 76 裁切揭示 */
function ClipRevealDemo() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-muted/30">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="hidden"
            initial={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 100% 0 0)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <Scissors className="h-8 w-8 text-muted-foreground" />
            <Button size="sm" onClick={() => setRevealed(true)}>
              点击揭示内容
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 0 0 100%)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 p-6"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <div className="text-xl font-bold">Clip Path Reveal</div>
            </div>
            <p className="max-w-sm text-center text-sm text-muted-foreground">
              使用 CSS clip-path 实现元素的裁切揭示动画，适合首屏入场、内容切换等场景
            </p>
            <Button size="sm" variant="outline" onClick={() => setRevealed(false)}>
              再看一次
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 77 WebGL / Canvas 粒子动画 */
function ParticlesDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef<number | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 尊重系统的减少动态偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 90 : 180;
    const linkDistance = isMobile ? 80 : 120;
    const isDark = document.documentElement.classList.contains('dark');
    const dotRGB = isDark ? '255,255,255' : '26,95,62';

    const dpr = window.devicePixelRatio || 1;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2 + 1,
    }));

    const onMove = (e: globalThis.MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
    };
    const onLeave = () => {
      mouseRef.current.active = false;
    };
    const onClick = () => setReplayKey((k) => k + 1);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;

      for (const p of particles) {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 0) {
            const force = ((150 - dist) / 150) * 0.02;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            ctx.strokeStyle = `rgba(${dotRGB}, ${(1 - dist / linkDistance) * 0.18})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = `rgba(${dotRGB}, 0.55)`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [replayKey]);

  return (
    <div
      ref={containerRef}
      className="relative h-64 w-full cursor-pointer overflow-hidden rounded-lg bg-background"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="pointer-events-none absolute bottom-3 left-3 text-[10px] text-muted-foreground">
        <Sparkles className="mr-1 inline h-3 w-3" />
        移动鼠标吸引粒子，点击重播
      </div>
    </div>
  );
}

/** 78 视图过渡 */
function ViewTransitionDemo() {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => setExpanded((v) => !v));
    } else {
      setExpanded((v) => !v);
      toast('当前浏览器不支持 View Transitions API，已降级为普通动画');
    }
  };

  return (
    <div className="flex h-48 w-full items-center justify-center rounded-lg bg-muted/20">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={toggle}
            className="flex w-48 flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-5 shadow-lg transition-colors hover:border-primary/30"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm font-semibold">视图过渡演示</div>
            <div className="text-[11px] text-muted-foreground">点击展开详情卡片</div>
          </motion.button>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-80 rounded-xl border border-primary/30 bg-card p-5 shadow-xl"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Layers className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-bold">View Transitions API</div>
                <div className="text-[11px] text-muted-foreground">平滑的页面 / 元素过渡</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              View Transitions API 让不同视图状态之间的切换变得丝滑自然，支持 DOM
              在切换过程中的动画效果。
            </p>
            <Button size="sm" variant="outline" className="mt-4 w-full" onClick={toggle}>
              收起
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 79 减少动态 */
function ReduceMotionDemo() {
  const [systemReduce, setSystemReduce] = useState(false);
  const [simulate, setSimulate] = useState(false);
  const shouldReduce = systemReduce || simulate;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduce(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemReduce(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-48 w-full flex-col items-center justify-center gap-5 rounded-lg bg-muted/20">
      <div className="flex items-center gap-8">
        <motion.div
          animate={shouldReduce ? {} : { y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`flex h-16 w-16 items-center justify-center rounded-xl ${
            shouldReduce ? 'bg-muted' : 'bg-primary/20'
          }`}
        >
          <Activity
            className={`h-7 w-7 ${shouldReduce ? 'text-muted-foreground' : 'text-primary'}`}
          />
        </motion.div>

        <motion.div
          animate={shouldReduce ? { scale: 1 } : { scale: [1, 1.15, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className={`flex h-16 w-16 items-center justify-center rounded-xl ${
            shouldReduce ? 'bg-muted' : 'bg-secondary/50'
          }`}
        >
          <Zap
            className={`h-7 w-7 ${
              shouldReduce ? 'text-muted-foreground' : 'text-secondary-foreground'
            }`}
          />
        </motion.div>

        <motion.div
          animate={shouldReduce ? { opacity: 1 } : { opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className={`flex h-16 w-16 items-center justify-center rounded-xl ${
            shouldReduce ? 'bg-muted' : 'bg-accent'
          }`}
        >
          <Eye
            className={`h-7 w-7 ${
              shouldReduce ? 'text-muted-foreground' : 'text-accent-foreground'
            }`}
          />
        </motion.div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-sm font-semibold">
            {shouldReduce ? '已启用减少动态' : '动画正常播放中'}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {systemReduce ? '系统偏好已开启' : simulate ? '模拟开启中' : '系统偏好未开启'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="simulate-reduce"
            checked={simulate}
            onCheckedChange={setSimulate}
            disabled={systemReduce}
            aria-label="模拟减少动态"
          />
          <Label htmlFor="simulate-reduce" className="text-xs">
            模拟减少动态
          </Label>
        </div>
      </div>
    </div>
  );
}

/** 80 性能预算 */
function PerformanceBudgetDemo() {
  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Core Web Vitals</span>
        </div>
        <Badge variant="outline" className="text-[10px]">
          全部达标
        </Badge>
      </div>

      <div className="space-y-4">
        {PERF_METRICS.map((m) => {
          const pct = Math.min(100, (m.value / m.budget) * 100);
          return (
            <div key={m.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">{m.name}</span>
                  <span className="text-muted-foreground">{m.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-foreground">
                    {m.value}
                    <span className="ml-0.5 text-muted-foreground">{m.unit}</span>
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span className="font-mono text-muted-foreground">
                    {m.budget}
                    {m.unit}
                  </span>
                </div>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Eye className="h-3.5 w-3.5" />
          <span>Lighthouse 模拟得分</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>4 项通过</span>
          </div>
          <div className="font-mono text-lg font-bold text-primary">95</div>
        </div>
      </div>
    </div>
  );
}
