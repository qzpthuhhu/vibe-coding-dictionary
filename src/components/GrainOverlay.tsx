import { useTheme } from './ThemeProvider';

/**
 * 颗粒噪点纹理层 · 概念 69
 * 在纯色/渐变背景上叠加细小颗粒，减少数字画面的塑料感
 */
export default function GrainOverlay({ conceptId }: { conceptId?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      data-concept-id={conceptId}
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-overlay"
      style={{
        opacity: isDark ? 0.04 : 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }}
      aria-hidden="true"
    />
  );
}
