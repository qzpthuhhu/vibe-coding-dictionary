import { useHighlight } from './HighlightProvider';

/**
 * 可交互提示光点
 * 仅在探索模式开启时显示，标记「这里可以点」的黄色呼吸小圆点
 */
export default function InteractiveDot({ label }: { label: string }) {
  const { exploreMode } = useHighlight();

  if (!exploreMode) return null;

  return (
    <span
      className="absolute right-2 top-2 z-10 flex items-center gap-1"
      title={label}
      aria-hidden="true"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFD60A] opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FFD60A]" />
      </span>
    </span>
  );
}
