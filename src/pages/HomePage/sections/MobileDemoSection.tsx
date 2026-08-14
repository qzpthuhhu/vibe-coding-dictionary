import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronRight,
  Home,
  Search,
  Grid3X3,
  BookOpen,
  User,
  Smartphone,
  Monitor,
  Tablet,
  Sparkles,
  VolumeX,
} from 'lucide-react';
import { MOCK_PRODUCT_CATEGORIES } from '@/data/bytedance';

type DeviceView = 'mobile' | 'tablet' | 'desktop';

/**
 * 移动端专属组件演示区
 * 用设备模拟器真实还原汉堡菜单、面包屑、底部导航等仅在小屏出现的概念
 */
export default function MobileDemoSection() {
  const [deviceView, setDeviceView] = useState<DeviceView>('mobile');

  return (
    <section id="mobile-demo" className="relative w-full py-20 md:py-28">
      <div data-concept-id="9" className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:mb-14"
        >
          <div className="mb-3 text-sm font-medium text-primary">MOBILE COMPONENTS</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">移动端专属组件</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            这些概念只在小屏设备出现，此处用设备模拟器真实还原，可直接点击交互
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
          {/* 左侧说明 */}
          <div className="order-2 w-full max-w-sm lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold">桌面 / 平板 / 手机 三端自适应</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  概念 9「响应式布局」：同一套代码根据屏幕宽度自动调整布局、字号和组件形态。点击下方按钮切换设备。
                </p>
              </div>

              <div className="flex items-end gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                {(
                  [
                    { key: 'mobile', label: '手机', size: '375px', Icon: Smartphone },
                    { key: 'tablet', label: '平板', size: '768px', Icon: Tablet },
                    { key: 'desktop', label: '桌面', size: '1280px', Icon: Monitor },
                  ] as const
                ).map(({ key, label, size, Icon }) => {
                  const active = deviceView === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setDeviceView(key)}
                      className={`flex flex-1 flex-col items-center gap-2 rounded-md p-2 transition-all ${
                        active ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted/50'
                      }`}
                    >
                      <Icon
                        className={active ? 'text-primary' : 'text-muted-foreground'}
                        size={24}
                      />
                      <div
                        className={`text-xs font-medium ${
                          active ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {label}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{size}</div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4 text-sm">
                {[
                  { id: 22, name: '汉堡菜单', desc: '点击模拟器左上角 ☰ 按钮，展开侧滑抽屉' },
                  { id: 23, name: '面包屑导航', desc: '显示当前所在层级，可逐级返回或前进' },
                  { id: 28, name: '底部导航栏', desc: '5 个 Tab 切换，当前项高亮显示' },
                  { id: 79, name: '减少动态', desc: '系统级动画偏好开关，尊重用户健康需求' },
                ].map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {item.id}
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 右侧模拟器 */}
          <div className="order-1 flex items-start justify-center lg:order-2">
            <DeviceSimulator deviceView={deviceView} />
          </div>
        </div>
      </div>
    </section>
  );
}

function DeviceSimulator({ deviceView }: { deviceView: DeviceView }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [history, setHistory] = useState<string[][]>([['首页', '产品矩阵', 'AI 产品']]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [grainOn, setGrainOn] = useState(true);

  const breadcrumb = history[historyIndex];
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const navigateTo = (newPath: string[]) => {
    const next = history.slice(0, historyIndex + 1);
    next.push(newPath);
    setHistory(next);
    setHistoryIndex(next.length - 1);
  };

  const tabList = [
    { Icon: Home, label: '首页' },
    { Icon: Grid3X3, label: '产品' },
    { Icon: Search, label: '发现' },
    { Icon: BookOpen, label: '词典' },
    { Icon: User, label: '我的' },
  ];

  const drawerItems = [
    { Icon: Home, label: '首页' },
    { Icon: Grid3X3, label: '全部产品' },
    { Icon: Sparkles, label: 'AI 系列' },
    { Icon: BookOpen, label: '概念词典' },
    { Icon: User, label: '个人中心' },
  ];

  const displayProducts = MOCK_PRODUCT_CATEGORIES[2].products.slice(0, 4);

  const ToggleRow = ({
    conceptId,
    Icon,
    label,
    value,
    onToggle,
  }: {
    conceptId: string;
    Icon: typeof VolumeX;
    label: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <div
      data-concept-id={conceptId}
      className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-3"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          value ? 'bg-primary' : 'bg-muted'
        }`}
        aria-pressed={value}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="relative mx-auto"
    >
      <div
        className={`relative overflow-hidden rounded-[44px] border-[10px] border-foreground/90 bg-foreground/90 shadow-2xl transition-all duration-500 ${
          deviceView === 'mobile'
            ? 'h-[680px] w-[340px]'
            : deviceView === 'tablet'
              ? 'h-[620px] w-[480px]'
              : 'h-[520px] w-[760px]'
        }`}
      >
        {/* 刘海 */}
        <div className="absolute left-1/2 top-0 z-30 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-foreground/90" />

        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[34px] bg-background">
          {/* 状态栏 */}
          <div className="flex h-10 shrink-0 items-center justify-between px-6 pt-2 text-[11px] font-medium text-foreground">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>●●●</span>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          {/* 顶部导航栏 */}
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-border/40 px-4">
            <div className="w-8">
              {deviceView !== 'desktop' && (
                <button
                  data-concept-id="22"
                  onClick={() => setDrawerOpen(true)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted"
                  aria-label="打开菜单"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
            </div>
            <div className="text-sm font-semibold">产品矩阵</div>
            <div className="w-8" />
          </div>

          {/* 面包屑 · 概念 23 */}
          <div
            data-concept-id="23"
            className="flex shrink-0 items-center gap-1 border-b border-border/40 px-3 py-2 text-[11px] text-muted-foreground"
          >
            <button
              onClick={() => canGoBack && setHistoryIndex(historyIndex - 1)}
              disabled={!canGoBack}
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                canGoBack
                  ? 'hover:bg-muted hover:text-foreground'
                  : 'cursor-not-allowed opacity-30'
              }`}
              aria-label="后退"
            >
              <ChevronRight className="h-3 w-3 rotate-180" />
            </button>
            <button
              onClick={() => canGoForward && setHistoryIndex(historyIndex + 1)}
              disabled={!canGoForward}
              className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                canGoForward
                  ? 'hover:bg-muted hover:text-foreground'
                  : 'cursor-not-allowed opacity-30'
              }`}
              aria-label="前进"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
            <div className="ml-1 flex flex-1 items-center gap-1 overflow-hidden">
              {breadcrumb.map((b, i) => (
                <span key={`${b}-${i}`} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
                  <button
                    onClick={() => navigateTo(breadcrumb.slice(0, i + 1))}
                    className={`truncate transition-colors ${
                      i === breadcrumb.length - 1
                        ? 'font-medium text-foreground'
                        : 'hover:text-foreground'
                    }`}
                  >
                    {b}
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* 桌面模式：侧边栏 + 内容 */}
          {deviceView === 'desktop' ? (
            <div className="flex min-h-0 flex-1">
              <div className="flex w-40 shrink-0 flex-col border-r border-border/50 bg-card/50 py-3">
                <div className="px-3 pb-2 text-xs font-bold text-muted-foreground">导航</div>
                {drawerItems.map((item, i) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(i)}
                    className={`flex items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                      activeTab === i
                        ? 'bg-primary/10 font-medium text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                <div className="mb-2 text-xs font-semibold text-foreground">热门产品</div>
                <div className="grid grid-cols-3 gap-2">
                  {displayProducts.map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        !breadcrumb.includes(p.name) && navigateTo([...breadcrumb, p.name])
                      }
                      className="flex flex-col items-center gap-1.5 rounded-lg border border-border/50 bg-card p-2 text-center transition-colors hover:bg-muted/60"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                        {p.name.charAt(0)}
                      </div>
                      <div className="w-full truncate text-[10px] font-medium text-foreground">
                        {p.name}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  <ToggleRow
                    conceptId="79"
                    Icon={VolumeX}
                    label="减少动态"
                    value={reduceMotion}
                    onToggle={() => setReduceMotion(!reduceMotion)}
                  />
                  <ToggleRow
                    conceptId="69"
                    Icon={Sparkles}
                    label="颗粒噪点"
                    value={grainOn}
                    onToggle={() => setGrainOn(!grainOn)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                <div className="mb-2 text-xs font-semibold text-foreground">热门产品</div>
                <div className={deviceView === 'tablet' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}>
                  {displayProducts.map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        !breadcrumb.includes(p.name) && navigateTo([...breadcrumb, p.name])
                      }
                      className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-card p-2 text-left transition-colors hover:bg-muted/60"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
                        {p.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-foreground">
                          {p.name}
                        </div>
                        <div className="truncate text-[10px] text-muted-foreground">{p.stat}</div>
                      </div>
                      {deviceView === 'mobile' && (
                        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <ToggleRow
                    conceptId="79"
                    Icon={VolumeX}
                    label="减少动态"
                    value={reduceMotion}
                    onToggle={() => setReduceMotion(!reduceMotion)}
                  />
                  <ToggleRow
                    conceptId="69"
                    Icon={Sparkles}
                    label="颗粒噪点"
                    value={grainOn}
                    onToggle={() => setGrainOn(!grainOn)}
                  />
                </div>
              </div>

              {/* 底部导航栏 · 概念 28 */}
              <div
                data-concept-id="28"
                className="flex shrink-0 border-t border-border/50 bg-card/95 pb-2 backdrop-blur"
              >
                {tabList.map((tab, i) => {
                  const isActive = activeTab === i;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(i)}
                      className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-all"
                    >
                      <tab.Icon
                        className={`h-4 w-4 transition-transform ${
                          isActive ? 'scale-110 text-primary' : 'text-muted-foreground'
                        }`}
                      />
                      <span
                        className={
                          isActive ? 'font-medium text-primary' : 'text-muted-foreground'
                        }
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-foreground/30" />

          {/* 抽屉 */}
          <AnimatePresence>
            {drawerOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setDrawerOpen(false)}
                  className="absolute inset-0 z-40 bg-black/40"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute left-0 top-0 z-50 h-full w-[75%] bg-card shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                    <div className="text-sm font-semibold">菜单</div>
                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="关闭菜单"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-2">
                    {drawerItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setDrawerOpen(false)}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                      >
                        <item.Icon className="h-4 w-4 text-primary" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 px-4 text-[10px] text-muted-foreground">
                    Vibe Coding 视觉词典 · v1.0
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-muted-foreground">
        点击模拟器内各元素体验真实交互效果
      </div>
    </motion.div>
  );
}
