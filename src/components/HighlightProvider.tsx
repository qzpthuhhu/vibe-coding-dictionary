import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  memo,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Copy, Check, Pin, PinOff, Square, MousePointer2 } from 'lucide-react';
import { CONCEPTS, type IConcept } from '@/data/concepts';
import { CONCEPT_DETAILS, type IConceptDetail } from '@/data/conceptDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ========== Context ==========
interface HighlightContextValue {
  highlight: (conceptId: number, opts?: { scroll?: boolean }) => void;
  clearHighlight: () => void;
  activeConceptId: number | null;
  // 探索模式
  exploreMode: boolean;
  toggleExploreMode: () => void;
  setExploreMode: (v: boolean) => void;
  // 钉住
  pinned: boolean;
  togglePinned: () => void;
  // hover 触发（探索模式使用）
  hoverConcept: (conceptId: number, rect: DOMRect, sourceEl: HTMLElement) => void;
  leaveConcept: () => void;
}

const HighlightContext = createContext<HighlightContextValue | null>(null);

// ========== 常量 ==========
const HIGHLIGHT_COLOR = '#FFD60A';
const HIGHLIGHT_PADDING = 6;
const AUTO_CLOSE_MS = 60000; // 60 秒自动关闭
const SCROLL_CLOSE_THRESHOLD = 400; // 滚动超过 400px 自动关闭讲解卡

/** 卡片宽度：响应式，根据视口宽度计算 */
const getCardWidth = () => {
  if (typeof window === 'undefined') return 400;
  const vw = window.innerWidth;
  return Math.min(420, Math.max(320, vw * 0.26));
};

// ========== 概念 → 视图映射 ==========
// 点击左侧索引概念时，自动切换到对应区域的对应视图
interface ViewSwitch {
  section: string;
  view: string;
}

const CONCEPT_VIEW_MAP: Record<number, ViewSwitch> = {
  // 关键数据区
  3: { section: 'metrics', view: 'bento' },
  8: { section: 'metrics', view: 'gauge' },
  // 产品矩阵区
  1: { section: 'products', view: 'card' },
  2: { section: 'products', view: 'masonry' },
  45: { section: 'products', view: 'horizontal' },
  // 发展时间线区
  18: { section: 'timeline', view: 'vertical' },
  44: { section: 'timeline', view: 'horizontal' },
  // 生态区
  4: { section: 'feishu', view: 'split' },
  25: { section: 'feishu', view: 'tab' },
  // 概念词典区（卡片风格）
  63: { section: 'dictionary', view: 'swiss' },
  65: { section: 'dictionary', view: 'brutalist' },
  67: { section: 'dictionary', view: 'mono' },
  70: { section: 'dictionary', view: 'neumorphic' },
  // 视觉风格画廊
  61: { section: 'style-gallery', view: 'gallery' },
  64: { section: 'style-gallery', view: 'gallery-focus' },
  66: { section: 'style-gallery', view: 'gallery-focus' },
  68: { section: 'style-gallery', view: 'gallery-focus' },
};

/**
 * 派发视图切换自定义事件，各 section 监听自己的事件
 * 返回 Promise，等待两帧渲染完成后 resolve
 */
function requestViewSwitch(conceptId: number): Promise<void> {
  const mapping = CONCEPT_VIEW_MAP[conceptId];
  if (!mapping) return Promise.resolve();
  const event = new CustomEvent('concept-view-switch', {
    detail: { section: mapping.section, view: mapping.view, conceptId },
  });
  window.dispatchEvent(event);
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

/**
 * 等待滚动结束：连续 3 帧 scrollY 变化 < 1px 判定为稳定，最长等待 1500ms 兜底
 */
function waitForScrollEnd(): Promise<void> {
  return new Promise((resolve) => {
    let lastY = window.scrollY;
    let stableFrames = 0;
    const MAX_WAIT_MS = 1500;
    const startTime = performance.now();

    const check = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastY) < 1) {
        stableFrames += 1;
        if (stableFrames >= 3) {
          resolve();
          return;
        }
      } else {
        stableFrames = 0;
      }
      lastY = currentY;
      if (performance.now() - startTime > MAX_WAIT_MS) {
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });
}

// ========== Provider ==========
export function HighlightProvider({ children }: { children: ReactNode }) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [activeConceptId, setActiveConceptId] = useState<number | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const isMobile = useIsMobile();

  const [exploreMode, setExploreMode] = useState(false);
  const [pinned, setPinned] = useState(false);
  const leaveTimerRef = useRef<number | null>(null);
  const modeRef = useRef<'click' | 'hover'>('click');
  const hoverElRef = useRef<HTMLElement | null>(null);
  const scrollStartRef = useRef<number>(0);

  // ===== 清理所有状态 =====
  const clearHighlight = useCallback(() => {
    setRect(null);
    setActiveConceptId(null);
    setCardVisible(false);
    setPinned(false);
    hoverElRef.current = null;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  // ===== 切换探索模式 =====
  const toggleExploreMode = useCallback(() => {
    setExploreMode((prev) => {
      const next = !prev;
      if (!next && modeRef.current === 'hover') {
        setCardVisible(false);
        setRect(null);
        setActiveConceptId(null);
      }
      return next;
    });
  }, []);

  const togglePinned = useCallback(() => {
    setPinned((p) => !p);
  }, []);

  // ===== 点击高亮（核心方法）=====
  const highlight = useCallback(async (conceptId: number, opts?: { scroll?: boolean }) => {
    const shouldScroll = opts?.scroll !== false;
    modeRef.current = 'click';
    setPinned(false);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    // Step 1: 先切换到对应视图
    await requestViewSwitch(conceptId);

    // Step 2: 查找目标元素（视图切换后重新查）
    const selector = `[data-concept-id="${conceptId}"]`;
    let el = document.querySelector<HTMLElement>(selector);

    // fallback：找不到精准元素时退到 section
    if (!el) {
      const concept = CONCEPTS.find((c) => c.id === conceptId);
      if (concept) {
        const sectionEl = document.getElementById(concept.section);
        if (sectionEl) {
          const candidates = Array.from(
            sectionEl.querySelectorAll<HTMLElement>(
              'button, [role="button"], .rounded-xl, .rounded-lg',
            ),
          );
          for (const c of candidates) {
            if (c.offsetWidth > 50 && c.offsetHeight > 30) {
              el = c;
              break;
            }
          }
          if (!el) el = sectionEl;
        }
      }
    }

    if (!el) return;

    if (shouldScroll) {
      // Step 3: 滚动到视口中央
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      // Step 4: 等待滚动结束
      await waitForScrollEnd();
    }

    // Step 5: 重新计算位置并显示
    setRect(el.getBoundingClientRect());
    setActiveConceptId(conceptId);
    setCardVisible(true);

    timerRef.current = window.setTimeout(() => {
      setRect(null);
      setActiveConceptId(null);
      setCardVisible(false);
    }, AUTO_CLOSE_MS);
  }, []);

  // ===== 探索模式 hover 触发 =====
  const hoverConcept = useCallback(
    (conceptId: number, _rect: DOMRect, sourceEl: HTMLElement) => {
      if (pinned) return;
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
      // 正在点击模式展示时，不被 hover 打断
      if (modeRef.current === 'click' && activeConceptId !== null) return;

      modeRef.current = 'hover';
      hoverElRef.current = sourceEl;
      setRect(sourceEl.getBoundingClientRect());
      setActiveConceptId(conceptId);
      setCardVisible(true);

      // 记录当前滚动位置，用于滚动距离检测
      scrollStartRef.current = window.scrollY;

      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (modeRef.current === 'hover' && !pinned) {
          setCardVisible(false);
          setRect(null);
          setActiveConceptId(null);
          hoverElRef.current = null;
        }
      }, AUTO_CLOSE_MS);
    },
    [pinned, activeConceptId],
  );

  // ===== 鼠标离开：不立即消失，由 60 秒倒计时 + 滚动距离控制 =====
  const leaveConcept = useCallback(() => {
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const concept = activeConceptId
    ? (CONCEPTS.find((c) => c.id === activeConceptId) as IConcept | undefined)
    : undefined;
  const detail = activeConceptId ? CONCEPT_DETAILS[activeConceptId] : undefined;

  // ===== 滚动超过 400px 自动关闭讲解卡 =====
  useEffect(() => {
    if (!exploreMode || !cardVisible || pinned) return;
    if (modeRef.current !== 'hover') return;

    const onScroll = () => {
      const dist = Math.abs(window.scrollY - scrollStartRef.current);
      if (dist > SCROLL_CLOSE_THRESHOLD) {
        setCardVisible(false);
        setRect(null);
        setActiveConceptId(null);
        hoverElRef.current = null;
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [exploreMode, cardVisible, pinned]);

  // ===== 全局事件委托：探索模式下 hover 任意 [data-concept-id] 元素弹出讲解卡 =====
  useEffect(() => {
    if (!exploreMode) return;

    const onMouseOver = (e: MouseEvent) => {
      if (pinned) return;
      if (modeRef.current === 'click' && activeConceptId !== null) return;
      const target = e.target as HTMLElement;
      const el = target.closest('[data-concept-id]') as HTMLElement | null;
      if (!el) return;
      const idStr = el.getAttribute('data-concept-id');
      if (!idStr) return;
      const conceptId = parseInt(idStr, 10);
      if (Number.isNaN(conceptId)) return;
      if (conceptId === activeConceptId && modeRef.current === 'hover') return;
      hoverConcept(conceptId, el.getBoundingClientRect(), el);
    };

    document.body.addEventListener('mouseover', onMouseOver);
    return () => document.body.removeEventListener('mouseover', onMouseOver);
  }, [exploreMode, pinned, activeConceptId, hoverConcept]);

  // ===== 探索模式：body class 控制自定义光标与元素提示 =====
  useEffect(() => {
    if (exploreMode) {
      document.body.classList.add('explore-mode-active');
    } else {
      document.body.classList.remove('explore-mode-active');
    }
    return () => document.body.classList.remove('explore-mode-active');
  }, [exploreMode]);

  // ===== 快捷键 E 切换探索模式 =====
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if ((e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === 'e' || e.key === 'E') {
        toggleExploreMode();
      }
      if (e.key === 'Escape') {
        clearHighlight();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleExploreMode, clearHighlight]);

  return (
    <HighlightContext.Provider
      value={{
        highlight,
        clearHighlight,
        activeConceptId,
        exploreMode,
        toggleExploreMode,
        setExploreMode,
        pinned,
        togglePinned,
        hoverConcept,
        leaveConcept,
      }}
    >
      {children}
      <HighlightOverlay
        rect={rect}
        concept={concept}
        detail={detail}
        visible={cardVisible}
        isMobile={isMobile}
        pinned={pinned}
        togglePinned={togglePinned}
        onClose={clearHighlight}
      />
    </HighlightContext.Provider>
  );
}

export function useHighlight() {
  const ctx = useContext(HighlightContext);
  if (!ctx) throw new Error('useHighlight must be used within HighlightProvider');
  return ctx;
}

// ========== HighlightOverlay ==========
interface HighlightOverlayProps {
  rect: DOMRect | null;
  concept: IConcept | undefined;
  detail: IConceptDetail | undefined;
  visible: boolean;
  isMobile: boolean;
  pinned: boolean;
  togglePinned: () => void;
  onClose: () => void;
}

const HighlightOverlay = memo(function HighlightOverlay({
  rect,
  concept,
  detail,
  visible,
  isMobile,
  pinned,
  togglePinned,
  onClose,
}: HighlightOverlayProps) {
  const level = concept?.level ?? 'element';
  const isRegion = level === 'region';

  const [cardX, setCardX] = useState(280);
  const [cardY, setCardY] = useState<number | null>(null); // null = 未拖拽，使用计算居中
  const [computedTop, setComputedTop] = useState('50%');
  const [computedMaxHeight, setComputedMaxHeight] = useState('calc(100vh - 48px)');
  const [isDragging, setIsDragging] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  // ===== 左侧默认位置：读取侧边栏实际宽度 + 24px 间距 =====
  const getDefaultLeft = useCallback(() => {
    if (typeof window === 'undefined') return 280;
    if (window.innerWidth < 1024) return 24;
    const sidebar = document.querySelector('aside[data-sidebar-index]');
    const sidebarWidth = sidebar ? sidebar.getBoundingClientRect().width : 260;
    return sidebarWidth + 24;
  }, []);
  const defaultLeft = getDefaultLeft();

  // ===== 垂直居中计算 =====
  const recalcCenter = useCallback(() => {
    if (!cardRef.current) return;
    const cardHeight = cardRef.current.getBoundingClientRect().height;
    const viewportHeight = window.innerHeight;
    const topPadding = 24;
    const availableHeight = viewportHeight - topPadding * 2;

    if (cardHeight > availableHeight) {
      // 卡片过高：贴顶 + 限制最大高度，内容区自行滚动
      setComputedTop(`${topPadding}px`);
      setComputedMaxHeight(`${availableHeight}px`);
    } else {
      // 正常高度：真正垂直居中
      const top = (viewportHeight - cardHeight) / 2;
      setComputedTop(`${Math.max(topPadding, top)}px`);
      setComputedMaxHeight(`${availableHeight}px`);
    }
  }, []);

  // ===== 每次打开新卡片时重置位置并重新居中 =====
  useEffect(() => {
    if (visible && concept) {
      setCardX(getDefaultLeft());
      setCardY(null);
      setCardKey((k) => k + 1);
      const raf1 = requestAnimationFrame(() => {
        requestAnimationFrame(() => recalcCenter());
      });
      return () => cancelAnimationFrame(raf1);
    }
  }, [visible, concept?.id, recalcCenter, getDefaultLeft]);

  // ===== ResizeObserver 监听卡片高度变化 + window resize 重算 =====
  useEffect(() => {
    if (!visible || !cardRef.current) return;

    const ro = new ResizeObserver(() => {
      if (cardY === null) recalcCenter();
    });
    ro.observe(cardRef.current);

    const onResize = () => {
      if (cardY === null) recalcCenter();
    };
    window.addEventListener('resize', onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [visible, cardY, recalcCenter]);

  // ===== 拖拽处理 =====
  const handleDragStart = useCallback((clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const cardRect = cardRef.current.getBoundingClientRect();
    dragOffset.current = { x: clientX - cardRect.left, y: clientY - cardRect.top };
    setIsDragging(true);
  }, []);

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !cardRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cardRect = cardRef.current.getBoundingClientRect();

      let newX = clientX - dragOffset.current.x;
      let newY = clientY - dragOffset.current.y;

      // 边界约束：不让卡片拖出视口
      newX = Math.max(0, Math.min(newX, vw - cardRect.width));
      newY = Math.max(0, Math.min(newY, vh - cardRect.height));

      setCardX(newX);
      setCardY(newY);
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // 拖拽结束后自动钉住，避免 hover 模式下意外消失
    if (!pinned) togglePinned();
  }, [pinned, togglePinned]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => handleDragMove(e.clientX, e.clientY);
    const onUp = () => handleDragEnd();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onEnd = () => handleDragEnd();
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!rect || !concept || !detail) {
    return <div className="pointer-events-none fixed inset-0 z-[9999]" />;
  }

  // ===== 卡片位置样式 =====
  const cardStyle: CSSProperties = isMobile
    ? { position: 'fixed', left: 8, right: 8, bottom: 8, maxWidth: 'none' }
    : cardY === null
      ? {
          position: 'fixed',
          left: defaultLeft,
          top: computedTop,
          width: getCardWidth(),
          maxHeight: computedMaxHeight,
        }
      : {
          position: 'fixed',
          left: cardX,
          top: cardY,
          width: getCardWidth(),
          maxHeight: computedMaxHeight,
        };

  // ===== 复制提示词 =====
  const handleCopyPrompt = async () => {
    if (!detail.prompt) return;
    try {
      await navigator.clipboard.writeText(detail.prompt);
      setCopied(true);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // 兜底：创建临时 textarea
      const ta = document.createElement('textarea');
      ta.value = detail.prompt;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success('已复制到剪贴板');
        setTimeout(() => setCopied(false), 1800);
      } catch {
        toast.error('复制失败，请手动选择文本复制');
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence>
        {visible && (
          <>
            {/* ========== 高亮框 ========== */}
            <motion.div
              key={`frame-${concept.id}-${level}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                left: rect.left - HIGHLIGHT_PADDING,
                top: rect.top - HIGHLIGHT_PADDING,
                width: rect.width + HIGHLIGHT_PADDING * 2,
                height: rect.height + HIGHLIGHT_PADDING * 2,
                borderRadius: isRegion
                  ? Math.min(18, rect.height * 0.1 + 8)
                  : Math.min(10, rect.height * 0.15 + 4),
                border: `3px ${isRegion ? 'dashed' : 'solid'} ${isRegion ? HIGHLIGHT_COLOR : '#FF9F0A'}`,
                boxShadow: isRegion
                  ? '0 0 0 2px rgba(255, 214, 10, 0.12), 0 0 16px rgba(255, 214, 10, 0.35)'
                  : '0 0 0 2px rgba(255, 159, 10, 0.15), 0 0 24px rgba(255, 159, 10, 0.5)',
                pointerEvents: 'none',
              }}
            >
              {/* 层级标签 */}
              <div
                className={cn(
                  'absolute -top-3 left-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                  isRegion ? 'bg-[#FFD60A] text-black' : 'bg-[#FF9F0A] text-white',
                )}
                style={{
                  boxShadow: isRegion
                    ? '0 2px 8px rgba(255,214,10,0.4)'
                    : '0 2px 8px rgba(255,159,10,0.4)',
                }}
              >
                {isRegion ? (
                  <Square className="h-2.5 w-2.5" />
                ) : (
                  <MousePointer2 className="h-2.5 w-2.5" />
                )}
                {isRegion ? '区域级 · REGION' : '元素级 · ELEMENT'}
              </div>

              {/* 呼吸动画内边 */}
              <motion.div
                animate={{ opacity: isRegion ? [0.3, 0.7, 0.3] : [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: isRegion
                    ? Math.min(22, rect.height * 0.1 + 12)
                    : Math.min(14, rect.height * 0.15 + 8),
                  border: `1.5px ${isRegion ? 'dashed' : 'solid'} rgba(255, 214, 10, ${
                    isRegion ? 0.4 : 0.6
                  })`,
                }}
              />
            </motion.div>

            {/* ========== 讲解卡片 ========== */}
            <motion.div
              key={`card-${concept.id}-${cardKey}`}
              initial={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: isMobile ? 0 : -20, y: isMobile ? 20 : 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
              className="pointer-events-auto"
              style={{
                ...cardStyle,
                zIndex: isDragging ? 10001 : 10000,
                cursor: isDragging ? 'grabbing' : 'auto',
              }}
              ref={cardRef}
            >
              <div
                className="flex h-full w-full flex-col overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  background: '#1A1A1A',
                  border: `2px solid ${isRegion ? HIGHLIGHT_COLOR : '#FF9F0A'}`,
                  color: '#fff',
                }}
              >
                {/* 顶部层级标签条 */}
                <div
                  className={cn(
                    'flex items-center justify-between gap-2 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-wider',
                    isRegion ? 'bg-[#FFD60A]/15 text-[#FFD60A]' : 'bg-[#FF9F0A]/15 text-[#FF9F0A]',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {isRegion ? (
                      <Square className="h-3 w-3" />
                    ) : (
                      <MousePointer2 className="h-3 w-3" />
                    )}
                    {isRegion ? '区域级概念 · REGION' : '元素级概念 · ELEMENT'}
                  </div>
                  <span className="text-[10px] font-normal opacity-70">
                    {isRegion ? '覆盖整个内容区域' : '单个交互/组件'}
                  </span>
                </div>

                {/* 拖拽手柄头部 */}
                <div
                  onMouseDown={(e) => {
                    if (isMobile) return;
                    e.preventDefault();
                    handleDragStart(e.clientX, e.clientY);
                  }}
                  onTouchStart={(e) => {
                    if (e.touches.length > 0) {
                      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
                    }
                  }}
                  className="flex items-start justify-between gap-3 px-5 pb-2 pt-4"
                  style={{ cursor: isMobile ? 'default' : 'grab', userSelect: 'none' }}
                >
                  <div className="flex flex-1 items-center gap-3">
                    <span
                      className="rounded-md px-2.5 py-1 font-mono text-base font-bold"
                      style={{ background: HIGHLIGHT_COLOR, color: '#1A1A1A' }}
                    >
                      {String(concept.id).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="text-[22px] font-bold leading-tight text-white">
                        {concept.name}
                      </div>
                      <div className="mt-0.5 text-[14px] font-medium uppercase tracking-widest text-white/50">
                        {detail.en}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={togglePinned}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110',
                        pinned
                          ? 'bg-[#FFD60A] text-black'
                          : 'bg-white/10 text-white/70 hover:bg-white/25 hover:text-white',
                      )}
                      aria-label={pinned ? '取消钉住' : '钉住卡片'}
                      title={pinned ? '取消钉住' : '钉住卡片（拖拽后自动钉住）'}
                    >
                      {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:scale-110 hover:bg-white/25 hover:text-white"
                      aria-label="关闭讲解"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 内容可滚动区域 */}
                <div className="relative flex-1 overflow-y-auto pb-4 pl-6 pr-5">
                  {/* 左侧层级边条 */}
                  <div
                    className={cn(
                      'absolute left-0 top-0 h-full',
                      isRegion ? 'w-1.5 bg-[#FFD60A]' : 'w-1 bg-[#FF9F0A]',
                    )}
                  />

                  {/* 概念说明 */}
                  <div className="mb-4 mt-3">
                    <div className="mb-1.5 text-[15px] font-bold text-[#FFD60A]">概念说明</div>
                    <p className="text-[15px] leading-7 text-white/90">{detail.desc}</p>
                  </div>

                  {/* 适合场景 */}
                  <div className="mb-4">
                    <div className="mb-1.5 text-[15px] font-bold text-[#FFD60A]">适合场景</div>
                    <p className="text-[14px] leading-6 text-white/80">{detail.scene}</p>
                  </div>

                  {/* AI 提示词 —— 本项目核心交付内容 */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[15px] font-bold text-[#FFD60A]">AI 提示词</div>
                      <button
                        onClick={handleCopyPrompt}
                        className="flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[12px] text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? '已复制' : '复制'}
                      </button>
                    </div>
                    <div className="max-h-[200px] overflow-y-auto rounded-lg border border-white/10 bg-black/40 p-3">
                      <p className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-white/85">
                        {detail.prompt}
                      </p>
                    </div>
                  </div>

                  {/* 此处体现 */}
                  <div className="rounded-lg border border-[#FFD60A]/30 bg-[#FFD60A]/10 p-3.5">
                    <div className="mb-1.5 flex items-center gap-1.5 text-[15px] font-bold text-[#FFD60A]">
                      <span>💡</span>
                      <span>此处体现</span>
                    </div>
                    <p className="text-[14px] leading-6 text-white/85">{detail.here}</p>
                  </div>
                </div>

                {/* 底部信息栏 */}
                <div
                  className="flex items-center justify-between border-t px-5 py-2.5 text-[13px] text-white/45"
                  style={{ borderColor: 'rgba(255, 214, 10, 0.2)' }}
                >
                  <span>
                    第{concept.chapter}章 · {concept.chapterName}
                  </span>
                  <span>{pinned ? '已钉住' : '60s 后自动关闭'}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});
