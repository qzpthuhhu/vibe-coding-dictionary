import { useState, useEffect, useRef, type MouseEvent } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  MousePointer2,
  Magnet,
  Layers,
  Lightbulb,
  Type,
  Scissors,
  Sparkles,
  Eye,
  Ban,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import MagneticButton from '@/components/MagneticButton';
import InteractiveDot from '@/components/InteractiveDot';
import { useTheme } from '@/components/ThemeProvider';

const DEMOS = [
  { id: 71, name: '自定义光标', key: 'cursor' },
  { id: 72, name: '磁吸按钮', key: 'magnetic' },
  { id: 73, name: '三维倾斜卡片', key: 'tilt' },
  { id: 74, name: '聚光灯悬停', key: 'spotlight' },
  { id: 75, name: '图片文字蒙版', key: 'text-mask' },
  { id: 76, name: '裁切揭示', key: 'clip-reveal' },
  { id: 77, name: '粒子动画', key: 'particles' },
  { id: 78, name: '视图过渡', key: 'view-trans' },
  { id: 79, name: '减少动态', key: 'reduce-motion' },
] as const;

/**
 * 高级效果实验场
 * 第 8 章的 9 个进阶视觉与交互效果，每个都在独立卡片内可直接体验
 */
export default function AdvancedLabSection() {
  const [viewMode, setViewMode] = useState<'gallery' | 'compare'>('gallery');

  useEffect(() => {
    const onSwitch = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.section !== 'advanced-lab') return;
      if (detail.view === 'gallery' || detail.view === 'gallery-focus') setViewMode('gallery');
      else if (detail.view === 'compare') setViewMode('compare');
    };
    window.addEventListener('concept-view-switch', onSwitch);
    return () => window.removeEventListener('concept-view-switch', onSwitch);
  }, []);

  return (
    <section id="advanced-lab" className="relative w-full bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center md:mb-12"
        >
          <div className="mb-3 text-sm font-medium text-primary">ADVANCED FX</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">高级效果实验场</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            9 种进阶视觉与交互效果，从自定义光标到粒子动画，全部可直接上手体验
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
                <Layers className="mr-1.5 h-3.5 w-3.5" />
                并排对比
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </motion.div>

        {viewMode === 'gallery' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DEMOS.map((d, idx) => (
              <DemoBlock key={d.key} id={d.id} name={d.name} index={idx} demoKey={d.key} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 md:grid-cols-9">
            {DEMOS.map((d) => (
              <CompareMini key={d.key} id={d.id} name={d.name} demoKey={d.key} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DemoBlock({
  id,
  name,
  index,
  demoKey,
}: {
  id: number;
  name: string;
  index: number;
  demoKey: string;
}) {
  return (
    <motion.div
      data-concept-id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="overflow-hidden rounded-2xl border border-border/40 bg-card transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-center justify-between border-b border-border/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {String(id).padStart(2, '0')}
          </Badge>
          <span className="text-sm font-semibold">{name}</span>
        </div>
        <InteractiveDot label="悬停体验" />
      </div>
      <div className="relative h-48 overflow-hidden bg-muted/20">
        <DemoRenderer demoKey={demoKey} />
      </div>
    </motion.div>
  );
}

function CompareMini({ id, name, demoKey }: { id: number; name: string; demoKey: string }) {
  const ICONS: Record<string, typeof MousePointer2> = {
    cursor: MousePointer2,
    magnetic: Magnet,
    tilt: Layers,
    spotlight: Lightbulb,
    'text-mask': Type,
    'clip-reveal': Scissors,
    particles: Sparkles,
    'view-trans': Eye,
    'reduce-motion': Ban,
  };
  const Icon = ICONS[demoKey] ?? MousePointer2;

  return (
    <div
      data-concept-id={id}
      className="flex aspect-square flex-col justify-between rounded-lg border border-border/40 p-2 transition-all hover:border-primary/30"
    >
      <span className="font-mono text-[9px] text-muted-foreground">
        {String(id).padStart(2, '0')}
      </span>
      <div className="flex flex-1 items-center justify-center">
        <Icon className="h-6 w-6 text-primary/60" />
      </div>
      <span className="truncate text-[10px] font-medium">{name}</span>
    </div>
  );
}

function DemoRenderer({ demoKey }: { demoKey: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  switch (demoKey) {
    case 'cursor':
      return <CursorDemo />;
    case 'magnetic':
      return (
        <div className="flex h-full items-center justify-center">
          <MagneticButton
            onClick={() => toast.success('磁吸按钮被点击')}
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Magnet className="mr-2 h-4 w-4" />
            靠近试试
          </MagneticButton>
        </div>
      );
    case 'tilt':
      return <TiltDemo isDark={isDark} />;
    case 'spotlight':
      return <SpotlightDemo isDark={isDark} />;
    case 'text-mask':
      return <TextMaskDemo isDark={isDark} />;
    case 'clip-reveal':
      return <ClipRevealDemo isDark={isDark} />;
    case 'particles':
      return <ParticlesDemo isDark={isDark} />;
    case 'view-trans':
      return <ViewTransitionDemo />;
    case 'reduce-motion':
      return <ReduceMotionDemo />;
    default:
      return null;
  }
}

/** 71 自定义光标 */
function CursorDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  return (
    <div
      ref={containerRef}
      onMouseMove={(e: MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setPos({ x: -100, y: -100 })}
      className="relative h-full w-full cursor-none bg-gradient-to-br from-primary/10 to-secondary/20"
    >
      <motion.div
        className="pointer-events-none absolute z-20"
        animate={{ x: pos.x - 12, y: pos.y - 12 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.1 }}
      >
        <div
          className={`rounded-full border-2 border-primary transition-all ${
            hovering ? 'h-10 w-10 bg-primary/20' : 'h-6 w-6'
          }`}
        />
      </motion.div>
      <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
        <MousePointer2 className="h-7 w-7 text-primary/60" />
        <p className="text-xs text-muted-foreground">移动鼠标，光标变成自定义圆环</p>
        <button
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => toast('这是一个可交互元素')}
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
        >
          悬停我看看
        </button>
      </div>
    </div>
  );
}

/** 73 三维倾斜卡片 */
function TiltDemo({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  return (
    <div className="flex h-full items-center justify-center" style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        onMouseMove={(e: MouseEvent) => {
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          x.set(e.clientX - (rect.left + rect.width / 2));
          y.set(e.clientY - (rect.top + rect.height / 2));
        }}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
        className={`w-44 overflow-hidden rounded-xl border shadow-xl ${
          isDark ? 'border-white/10 bg-white/5' : 'border-border/50 bg-card'
        }`}
      >
        <div
          className="h-20 bg-gradient-to-br from-primary/40 to-secondary/60"
          style={{ transform: 'translateZ(20px)' }}
        />
        <div className="space-y-1 p-4" style={{ transform: 'translateZ(30px)' }}>
          <div className="text-sm font-bold">3D Tilt Card</div>
          <div className="text-[10px] text-muted-foreground">移动鼠标体验三维倾斜</div>
        </div>
      </motion.div>
    </div>
  );
}

/** 74 聚光灯悬停 */
function SpotlightDemo({ isDark }: { isDark: boolean }) {
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
      className={`relative flex h-full w-full items-center justify-center ${
        isDark ? 'bg-[#12160F]' : 'bg-muted/50'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle 90px at ${pos.x}% ${pos.y}%, color-mix(in srgb, var(--primary) 35%, transparent), transparent 70%)`,
        }}
      />
      <div className="relative z-10 text-center">
        <Lightbulb className="mx-auto mb-2 h-6 w-6 text-primary/70" />
        <p className="text-xs text-muted-foreground">移动鼠标感受聚光灯</p>
      </div>
    </div>
  );
}

/** 75 图片文字蒙版 */
function TextMaskDemo({ isDark }: { isDark: boolean }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-background'
      }`}
    >
      <div
        className="text-center text-5xl font-black leading-none tracking-tight"
        style={{
          backgroundImage:
            'linear-gradient(135deg, var(--primary) 0%, #3370FF 50%, #FFD60A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        MASK
      </div>
      <div className="mt-2 text-[11px] font-semibold tracking-[0.3em] text-muted-foreground">
        BACKGROUND-CLIP: TEXT
      </div>
    </div>
  );
}

/** 76 裁切揭示 */
function ClipRevealDemo({ isDark }: { isDark: boolean }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${
        isDark ? 'bg-[#0A0A0A]' : 'bg-background'
      }`}
    >
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="hidden"
            initial={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 100% 0 0)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full w-full items-center justify-center"
          >
            <Button variant="outline" size="sm" onClick={() => setRevealed(true)}>
              <Scissors className="mr-1.5 h-3.5 w-3.5" />
              点击揭示
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            exit={{ clipPath: 'inset(0 0 0 100%)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary/25 via-secondary/30 to-primary/10"
          >
            <div className="text-sm font-semibold text-foreground">Clip Path Reveal</div>
            <p className="px-6 text-center text-[10px] text-muted-foreground">
              用 clip-path 从一侧擦除，比淡入更有方向感
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

/** 77 粒子动画（Canvas 2D 实现，含连线） */
function ParticlesDemo({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // 尊重系统的减少动态偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
    }));
    const rgb = isDark ? '255,255,255' : '26,95,62';
    let raf = 0;

    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 55) {
            ctx.strokeStyle = `rgba(${rgb}, ${0.18 * (1 - dist / 55)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > rect.width) p.vx *= -1;
        if (p.y < 0 || p.y > rect.height) p.vy *= -1;
        ctx.fillStyle = `rgba(${rgb}, 0.45)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(raf);
  }, [isDark]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] text-muted-foreground">
        60 个粒子 + 邻近连线
      </div>
    </div>
  );
}

/** 78 视图过渡 */
function ViewTransitionDemo() {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(() => setExpanded((v) => !v));
    } else {
      setExpanded((v) => !v);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-muted/20">
      <AnimatePresence mode="wait">
        {!expanded ? (
          <motion.button
            key="small"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggle}
            className="rounded-full bg-primary px-5 py-2 text-xs font-medium text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Eye className="mr-1 inline h-3.5 w-3.5" />
            点击展开
          </motion.button>
        ) : (
          <motion.div
            key="large"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-4 rounded-xl border border-primary/30 bg-card p-4 text-center shadow-xl"
          >
            <div className="mb-2 text-sm font-bold text-primary">View Transition</div>
            <p className="mb-3 text-[11px] text-muted-foreground">
              支持 View Transitions API 的浏览器会自动获得更连续的形变过渡
            </p>
            <Button size="sm" variant="outline" onClick={toggle}>
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
  const [manualReduce, setManualReduce] = useState(false);
  const reduce = systemReduce || manualReduce;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemReduce(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemReduce(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-muted/20 px-4">
      <motion.div
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          reduce ? 'bg-muted' : 'bg-primary/20'
        }`}
      >
        <Ban className={`h-6 w-6 ${reduce ? 'text-muted-foreground' : 'text-primary'}`} />
      </motion.div>
      <div className="text-center">
        <div className="text-xs font-semibold">
          {reduce ? '已开启减少动态' : '动画正常播放中'}
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          {systemReduce ? '来自系统 prefers-reduced-motion' : '自动读取系统无障碍偏好'}
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-7 text-xs"
        onClick={() => setManualReduce((v) => !v)}
        disabled={systemReduce}
      >
        {manualReduce ? '恢复动画' : '手动模拟关闭'}
      </Button>
    </div>
  );
}
