import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '@/data/bytedance';
import MagneticButton from '@/components/MagneticButton';
import Marquee from '@/components/Marquee';
import LogoCarousel from '@/components/LogoCarousel';

const BRANDS = [
  '抖音',
  'TikTok',
  '今日头条',
  '飞书',
  '豆包',
  '剪映',
  'CapCut',
  '火山引擎',
  '西瓜视频',
  '番茄小说',
  'PICO',
  '即梦AI',
  '扣子Coze',
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const titleScale = useSpring(useTransform(scrollYProgress, [0, 0.6], [1, 1.4]), {
    stiffness: 100,
    damping: 30,
  });

  const scrollToMetrics = () => {
    document.getElementById('metrics')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section
      id="hero"
      data-concept-id="11"
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden pt-14"
    >
      {/* 视差滚动 · 概念 42 */}
      <div data-concept-id="42" className="pointer-events-none absolute inset-0" aria-hidden="true" />
      {/* 滚动驱动动画 · 概念 50 */}
      <div data-concept-id="50" className="pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* 网格渐变背景 · 概念 68 */}
      <motion.div
        data-concept-id="68"
        style={reduceMotion ? {} : { y, scale }}
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            color: 'var(--primary)',
          }}
        />
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-info/10 blur-[100px]" />
      </motion.div>

      {/* 内容 */}
      <motion.div
        style={reduceMotion ? {} : { opacity, scale: titleScale as unknown as number }}
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-1.5 text-sm backdrop-blur"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-foreground/80">Vibe Coding 视觉词典 · 80 个概念一网打尽</span>
        </motion.div>

        {/* Hero Section · 概念 15 */}
        <motion.h1
          data-concept-id="15"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl lg:text-8xl"
        >
          {/* 图片文字蒙版 · 概念 75 */}
          <span
            data-concept-id="75"
            className="bg-gradient-to-br from-foreground via-foreground to-primary/40 bg-clip-text text-transparent"
            style={{ WebkitTextFillColor: 'transparent' }}
          >
            激发创造
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-info to-primary bg-clip-text text-transparent">
            丰富生活
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          {COMPANY_INFO.name} · {COMPANY_INFO.enName} —— 用科技和创新连接全球用户
          <br className="hidden md:block" />
          同时这是一份活的网页设计词典，80 个概念在你眼前真实上演
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {/* 磁吸按钮 · 概念 72 */}
          <div data-concept-id="72">
            <MagneticButton onClick={scrollToMetrics}>
              探索 80 个概念
              <ArrowDown className="ml-2 h-4 w-4" />
            </MagneticButton>
          </div>
          <button
            onClick={scrollToMetrics}
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5"
          >
            了解字节跳动 →
          </button>
        </motion.div>

        {/* 响应式布局 · 概念 9 */}
        <motion.div
          data-concept-id="9"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 md:gap-12"
        >
          {[
            { v: COMPANY_INFO.countries, l: '国家地区' },
            { v: COMPANY_INFO.employees, l: '全球员工' },
            { v: COMPANY_INFO.cities, l: '分布城市' },
          ].map((item) => (
            <div key={item.l} className="text-center">
              <div className="text-2xl font-bold tabular-nums md:text-3xl">{item.v}</div>
              <div className="mt-1 text-xs text-muted-foreground md:text-sm">{item.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* 跑马灯 · 概念 47 */}
      <div className="absolute bottom-20 left-0 right-0 md:bottom-24">
        <div data-concept-id="47">
          <Marquee items={BRANDS} />
        </div>
      </div>

      {/* Logo 轮播 · 概念 36 */}
      <div className="absolute bottom-4 left-0 right-0 opacity-60 md:bottom-6">
        <div data-concept-id="36">
          <LogoCarousel />
        </div>
      </div>

      {/* 全出血布局 · 概念 10 */}
      <motion.div
        data-concept-id="10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-0"
      >
        <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground/60">
          <span>向下滚动</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
