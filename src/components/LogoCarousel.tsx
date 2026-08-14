import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Image } from '@/components/ui/image';

const LOGOS = [
  { name: '抖音', src: 'https://aka.doubaocdn.com/s/bXe8m2A5MW' },
  { name: 'TikTok', src: 'https://aka.doubaocdn.com/s/9Viy2uJyF4' },
  { name: '今日头条', src: 'https://aka.doubaocdn.com/s/ASqZTwESVG' },
  { name: '飞书', src: 'https://aka.doubaocdn.com/s/V2fT6UzYP7' },
  { name: '豆包', src: 'https://aka.doubaocdn.com/s/QyhyP33ST0' },
  { name: '剪映', src: 'https://aka.doubaocdn.com/s/DJKUDp6dkr' },
  { name: '火山引擎', src: 'https://aka.doubaocdn.com/s/SWlsqUykzg' },
  { name: '即梦AI', src: 'https://aka.doubaocdn.com/s/nUQLKbHAf2' },
];

const GROUP_SIZE = 4;
const INTERVAL_MS = 3200;

/**
 * Logo 轮播 · 概念 36
 * 每组 4 个 Logo 循环切换，配指示点；可点击指示点直接跳组
 */
export default function LogoCarousel() {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const totalPages = Math.ceil(LOGOS.length / GROUP_SIZE);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [paused, totalPages]);

  const current = LOGOS.slice(page * GROUP_SIZE, page * GROUP_SIZE + GROUP_SIZE);

  return (
    <div
      className="flex flex-col items-center gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex h-10 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-8"
          >
            {current.map((logo) => (
              <Image
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                title={logo.name}
                className="h-7 w-7 object-contain grayscale transition-all hover:grayscale-0 md:h-8 md:w-8"
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 指示点 */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === page ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/30'
            }`}
            aria-label={`第 ${i + 1} 组`}
          />
        ))}
      </div>
    </div>
  );
}
