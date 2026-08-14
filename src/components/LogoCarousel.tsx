import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Image } from '@/components/ui/image';

const LOGOS = [
  { name: '抖音', url: 'https://aka.doubaocdn.com/s/bXe8m2A5MW' },
  { name: 'TikTok', url: 'https://aka.doubaocdn.com/s/9Viy2uJyF4' },
  { name: '飞书', url: 'https://aka.doubaocdn.com/s/V2fT6UzYP7' },
  { name: '豆包', url: 'https://aka.doubaocdn.com/s/QyhyP33ST0' },
  { name: '剪映', url: 'https://aka.doubaocdn.com/s/DJKUDp6dkr' },
  { name: '火山引擎', url: 'https://aka.doubaocdn.com/s/SWlsqUykzg' },
  { name: '今日头条', url: 'https://aka.doubaocdn.com/s/ASqZTwESVG' },
  { name: 'PICO', url: 'https://aka.doubaocdn.com/s/s7mjz4eBt3' },
];

/** 单个 Logo 槽位：固定宽度是关键，原因见下方组件注释 */
const SLOT_CLASS =
  'flex h-8 w-16 shrink-0 items-center justify-center grayscale transition-all hover:grayscale-0 md:h-10 md:w-20';

/**
 * Logo 轮播 · 概念 36
 *
 * 横向无缝滚动轨道：LOGOS 复制两份首尾相接，轨道从 0% 匀速移动到 -50%，
 * 恰好走完第一份的宽度，视觉上形成无限循环。
 *
 * ⚠️ 槽位的固定宽度 `w-16 md:w-20` 不能改成 `w-auto`：
 * 图片是懒加载的，若宽度完全依赖图片自然尺寸，图片加载完成前
 * 外层 `w-max` 容器会算出偏小的宽度，动画的 -50% 位移也按这个偏小值计算，
 * 结果整条轨道被压缩在左侧、右侧留下大片空白。
 *
 * 同时尊重 prefers-reduced-motion：降级为静态居中排列，信息不丢失。
 */
export default function LogoCarousel() {
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // 减少动态：不滚动，静态居中展示一份 Logo
  if (reduced) {
    return (
      <div className="flex w-full flex-wrap items-center justify-center gap-8 py-2 md:gap-12">
        {LOGOS.map((logo) => (
          <div key={logo.name} className={SLOT_CLASS}>
            <Image
              src={logo.url}
              alt={logo.name}
              title={logo.name}
              className="h-full w-auto max-w-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    );
  }

  const items = [...LOGOS, ...LOGOS];

  return (
    <div
      className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        animate={paused ? {} : { x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex w-max items-center gap-8 py-2 md:gap-12"
      >
        {items.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            className={SLOT_CLASS}
            /* 第二份仅用于视觉衔接，对屏幕阅读器隐藏，避免重复播报 */
            aria-hidden={i >= LOGOS.length}
          >
            <Image
              src={logo.url}
              alt={logo.name}
              title={logo.name}
              className="h-full w-auto max-w-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
