import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2,
  Search,
  RefreshCw,
  UploadCloud,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  ThumbsUp,
  Mail,
  Play,
  Bell,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import InteractiveDot from '@/components/InteractiveDot';

/**
 * 状态反馈实验室
 * 第 6 章的加载 / 状态 / 反馈概念，以及表单、Toast、无限滚动的独立可交互演示
 */
export default function StatusLabSection() {
  return (
    <section id="status-lab" className="relative w-full bg-muted/30 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:mb-14"
        >
          <div className="mb-3 text-sm font-medium text-primary">FEEDBACK LAB</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">状态反馈实验室</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            13 种加载、状态与反馈模式的完整交互演示，点击即可体验效果差异          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ToastCard />
          <FormCard />
          <InfiniteScrollCard />
          <SkeletonCard />
          <LazyLoadCard />
          <SpinnerCard />
          <ProgressBarCard />
          <LoadingButtonCard />
          <EmptyStateCard />
          <ErrorStateCard />
          <RetryStateCard />
          <OptimisticUiCard />
          <InlineValidationCard />
        </div>
      </div>
    </section>
  );
}

/** 35. 轻提示 Toast */
function ToastCard() {
  return (
    <DemoCard conceptId={35} title="轻提示 Toast" desc="短暂浮层反馈，不打断当前操作">
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={() => toast.success('操作成功')}>
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
          成功
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.error('操作失败，请重试')}>
          <XCircle className="mr-1.5 h-3.5 w-3.5" />
          错误
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.warning('存储空间即将用尽')}>
          <AlertCircle className="mr-1.5 h-3.5 w-3.5" />
          警告
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast('有 3 条新消息')}>
          <Bell className="mr-1.5 h-3.5 w-3.5" />
          普通
        </Button>
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Toast 出现在页面角落，几秒后自动消失，适合非阻塞式的结果告知。
      </p>
    </DemoCard>
  );
}

/** 38. 表单 */
function FormCard() {
  const [submitting, setSubmitting] = useState(false);

  return (
    <DemoCard conceptId={38} title="表单" desc="标签、输入、选择、提交的完整结构">
      <form
        className="space-y-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          setTimeout(() => {
            setSubmitting(false);
            toast.success('表单已提交');
          }, 1200);
        }}
      >
        <div>
          <label className="mb-1 block text-xs font-medium" htmlFor="demo-name">
            姓名 <span className="text-destructive">*</span>
          </label>
          <Input id="demo-name" required placeholder="请输入姓名" className="h-8 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium" htmlFor="demo-role">
            角色
          </label>
          <select
            id="demo-role"
            className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
          >
            <option>设计师</option>
            <option>前端工程师</option>
            <option>产品经理</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium" htmlFor="demo-note">
            备注
          </label>
          <textarea
            id="demo-note"
            rows={2}
            placeholder="想说点什么…"
            className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm placeholder:text-muted-foreground"
          />
        </div>
        <Button type="submit" size="sm" className="h-8 w-full text-xs" disabled={submitting}>
          {submitting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
          {submitting ? '提交中…' : '提交表单'}
        </Button>
      </form>
    </DemoCard>
  );
}

/** 46. 无限滚动 */
function InfiniteScrollCard() {
  const [items, setItems] = useState(() => Array.from({ length: 8 }, (_, i) => i + 1));
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && items.length < 40) {
          setLoading(true);
          setTimeout(() => {
            setItems((prev) => [
              ...prev,
              ...Array.from({ length: 8 }, (_, i) => prev.length + i + 1),
            ]);
            setLoading(false);
          }, 700);
        }
      },
      { root: container, threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, items.length]);

  return (
    <DemoCard conceptId={46} title="无限滚动" desc="滚到底部自动加载下一批，无需翻页">
      <div ref={containerRef} className="h-[200px] space-y-1.5 overflow-y-auto pr-1">
        {items.map((i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-md border border-border/40 bg-card px-3 py-2 text-xs"
          >
            <span className="w-6 font-mono text-primary">{String(i).padStart(2, '0')}</span>
            <span className="text-foreground">列表项 {i}</span>
          </div>
        ))}
        <div ref={sentinelRef} className="flex items-center justify-center py-2">
          {items.length >= 40 ? (
            <span className="text-[11px] text-muted-foreground">已经到底了</span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              加载中…
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">已加载 {items.length} 项 / 共 40 项</p>
    </DemoCard>
  );
}

/** 51. 骨架屏 */
function SkeletonCard() {
  const [loading, setLoading] = useState(false);

  return (
    <DemoCard
      conceptId={51}
      title="骨架屏"
      desc="内容加载前显示占位轮廓，降低等待焦虑"
      actionLabel="模拟加载"
      onAction={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2400);
      }}
    >
      <div className="space-y-3">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-lg border border-border/30 bg-card p-4">
            {loading ? (
              <div className="space-y-3">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-semibold">AI 产品矩阵全线升级</div>
                <div className="text-xs leading-5 text-muted-foreground">
                  最新能力发布，支持多模态理解与智能体编排。
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-8 w-8 rounded-full bg-primary/20" />
                  <span className="text-xs text-muted-foreground">产品团队 · 2 小时前</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

/** 53. 加载转圈 */
function SpinnerCard() {
  const [loading, setLoading] = useState(false);

  return (
    <DemoCard
      conceptId={53}
      title="加载转圈"
      desc="三种不同样式的 Spinner"
      actionLabel="触发加载"
      onAction={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1800);
      }}
    >
      <div className="flex items-center justify-around py-3">
        <div className="flex flex-col items-center gap-2">
          <div
            className={`h-6 w-6 rounded-full border-2 border-muted border-t-primary ${
              loading ? 'animate-spin' : ''
            }`}
          />
          <span className="text-[10px] text-muted-foreground">环形</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={loading ? { scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] } : {}}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                className="h-2 w-2 rounded-full bg-primary"
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">弹跳</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={loading ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-6 w-6 rounded border-2 border-dashed border-primary"
          />
          <span className="text-[10px] text-muted-foreground">虚线</span>
        </div>
      </div>
    </DemoCard>
  );
}

/** 54. 进度条 */
function ProgressBarCard() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState('准备上传');

  const start = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    setStage('准备上传');
    let p = 0;
    const timer = window.setInterval(() => {
      p += Math.random() * 12 + 3;
      if (p >= 100) {
        setProgress(100);
        setStage('完成');
        setRunning(false);
        window.clearInterval(timer);
        toast.success('上传完成');
        return;
      }
      setProgress(p);
      if (p < 40) setStage('准备上传');
      else if (p < 80) setStage('传输中');
      else setStage('校验文件');
    }, 300);
  };

  return (
    <DemoCard
      conceptId={54}
      title="进度条"
      desc="0 → 100% 带阶段名称，完成后给出结果"
      actionLabel={running ? stage : '开始上传'}
      onAction={running ? undefined : start}
      secondaryLabel="重置"
      onSecondary={() => {
        setProgress(0);
        setStage('准备上传');
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{stage}</span>
          <span className="font-mono text-base font-semibold text-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-3" />
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary"
          >
            <CheckCircle className="h-5 w-5" />
            <span>文件上传成功，共 2.4 MB</span>
          </motion.div>
        )}
      </div>
    </DemoCard>
  );
}

/** 55. 加载按钮 */
function LoadingButtonCard() {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submit = () => {
    if (state === 'loading') return;
    setState('loading');
    setTimeout(() => {
      setState(Math.random() > 0.4 ? 'success' : 'error');
      setTimeout(() => setState('idle'), 2000);
    }, 1500);
  };

  return (
    <DemoCard conceptId={55} title="加载按钮" desc="点击后进入 Loading，再转为成功或失败">
      <div className="space-y-3">
        <Input placeholder="your@email.com" className="h-8 text-sm" />
        <Button
          onClick={submit}
          disabled={state === 'loading'}
          className="h-9 w-full text-sm"
          variant={state === 'error' ? 'destructive' : 'default'}
        >
          {state === 'loading' && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
          {state === 'success' && <CheckCircle className="mr-2 h-3.5 w-3.5" />}
          {state === 'error' && <XCircle className="mr-2 h-3.5 w-3.5" />}
          {state === 'idle' && '立即订阅'}
          {state === 'loading' && '提交中…'}
          {state === 'success' && '订阅成功'}
          {state === 'error' && '提交失败'}
        </Button>
        <p className="text-[11px] text-muted-foreground">
          按钮自身承载状态，避免用户重复点击。
        </p>
      </div>
    </DemoCard>
  );
}

/** 56. 空状态 */
function EmptyStateCard() {
  const [query, setQuery] = useState('xyz');
  const items = ['抖音', '飞书', '剪映', '今日头条', '西瓜视频'];
  const filtered = items.filter((i) => i.includes(query));

  return (
    <DemoCard conceptId={56} title="空状态" desc="搜索无结果时给出解释和引导操作">
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索产品…"
            className="h-8 pl-7 text-sm"
          />
        </div>
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-6 text-center"
          >
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted/60">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-sm font-medium">没有找到相关产品</div>
            <div className="mt-1 text-xs text-muted-foreground">试试其他关键词？</div>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 h-7 text-xs"
              onClick={() => setQuery('')}
            >
              <RotateCcw className="mr-1 h-3 w-3" /> 清除筛选
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-1">
            {filtered.map((item) => (
              <div
                key={item}
                className="rounded-md border border-border/40 px-3 py-1.5 text-xs"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </DemoCard>
  );
}

/** 57. 错误状态 */
function ErrorStateCard() {
  const [error, setError] = useState(true);

  return (
    <DemoCard
      conceptId={57}
      title="错误状态"
      desc="说明原因 + 错误码 + 重试和退路"
      actionLabel={error ? '恢复正常' : '模拟失败'}
      onAction={() => setError(!error)}
    >
      {error ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-destructive">数据暂时无法加载</div>
              <p className="mt-1 text-xs text-muted-foreground">
                网络连接不稳定，请检查网络后重试。错误码：NETWORK_TIMEOUT
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-7 text-xs"
                  onClick={() => setError(false)}
                >
                  <RefreshCw className="mr-1 h-3 w-3" /> 重新加载
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  返回首页
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-lg border border-border/40 p-4 text-center text-xs text-muted-foreground">
          当前状态正常，点击下方按钮可查看错误状态设计
        </div>
      )}
    </DemoCard>
  );
}

/** 58. 重试状态 */
function RetryStateCard() {
  const [files, setFiles] = useState([
    { name: '产品设计稿.fig', size: '12.4 MB', status: 'uploading' as string },
    { name: '营销素材.zip', size: '8.2 MB', status: 'failed' as string },
    { name: '白皮书.pdf', size: '2.1 MB', status: 'done' as string },
  ]);

  const retry = (idx: number) => {
    setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, status: 'uploading' } : f)));
    setTimeout(() => {
      setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, status: 'done' } : f)));
      toast.success('重传成功');
    }, 1200);
  };

  return (
    <DemoCard conceptId={58} title="重试状态" desc="失败项保留在列表中，就地提供重试入口">
      <div className="space-y-2">
        {files.map((f, idx) => (
          <div
            key={f.name}
            className="flex items-center gap-2 rounded-md border border-border/40 p-2"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted">
              <UploadCloud
                className={`h-3.5 w-3.5 ${
                  f.status === 'failed'
                    ? 'text-destructive'
                    : f.status === 'done'
                      ? 'text-primary'
                      : 'text-muted-foreground'
                }`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium">{f.name}</div>
              <div className="text-[10px] text-muted-foreground">{f.size}</div>
            </div>
            {f.status === 'uploading' && (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
            )}
            {f.status === 'done' && <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary" />}
            {f.status === 'failed' && (
              <div className="flex shrink-0 items-center gap-1">
                <span className="text-[10px] text-destructive">失败</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => retry(idx)}>
                  <RefreshCw className="h-3 w-3 text-primary" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </DemoCard>
  );
}

/** 59. 乐观更新 */
function OptimisticUiCard() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [mode, setMode] = useState<'success' | 'fail'>('success');
  const [pending, setPending] = useState(false);

  const toggleLike = () => {
    if (pending) return;
    setPending(true);
    const next = !liked;
    // 先更新 UI，不等服务端
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));

    setTimeout(() => {
      if (mode === 'fail') {
        // 失败回滚
        setLiked(!next);
        setCount((c) => c + (next ? -1 : 1));
        toast.error('操作失败，已回滚');
      } else {
        toast.success(next ? '收藏成功' : '已取消收藏');
      }
      setPending(false);
    }, 800);
  };

  return (
    <DemoCard conceptId={59} title="乐观更新" desc="点击立即更新界面，失败后自动回滚">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={liked ? 'default' : 'outline'}
              className="h-8 gap-1 text-xs"
              onClick={toggleLike}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${pending ? 'animate-pulse' : ''}`} />
              {liked ? '已收藏' : '收藏'}
            </Button>
            <motion.span
              key={count}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-sm font-medium"
            >
              {count}
            </motion.span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setMode('success')}>
              <Badge variant={mode === 'success' ? 'default' : 'outline'} className="cursor-pointer text-[10px]">
                模拟成功
              </Badge>
            </button>
            <button onClick={() => setMode('fail')}>
              <Badge variant={mode === 'fail' ? 'destructive' : 'outline'} className="cursor-pointer text-[10px]">
                模拟失败
              </Badge>
            </button>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {mode === 'fail'
            ? '当前为失败模式：点击后界面先变化，随后回滚到原状态'
            : '当前为成功模式：点击立即响应，服务端确认后保持'}
        </p>
      </div>
    </DemoCard>
  );
}

/** 60. 行内验证 */
function InlineValidationCard() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [touched, setTouched] = useState({ email: false, phone: false });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = /^1[3-9]\d{9}$/.test(phone);

  return (
    <DemoCard conceptId={60} title="行内验证" desc="失焦即校验，正确与错误就地反馈">
      <div className="space-y-2.5">
        <div>
          <label className="mb-1 block text-xs font-medium" htmlFor="v-email">
            邮箱 <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="v-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="your@email.com"
              className={`h-8 pl-7 pr-7 text-sm ${
                touched.email && email
                  ? emailValid
                    ? 'border-primary/50'
                    : 'border-destructive/50'
                  : ''
              }`}
            />
            {touched.email &&
              email &&
              (emailValid ? (
                <CheckCircle className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
              ) : (
                <XCircle className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-destructive" />
              ))}
          </div>
          {touched.email && email && !emailValid && (
            <p className="mt-1 text-[11px] text-destructive">请输入有效的邮箱地址</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium" htmlFor="v-phone">
            手机号 <span className="text-destructive">*</span>
          </label>
          <Input
            id="v-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            placeholder="请输入 11 位手机号"
            className={`h-8 text-sm ${
              touched.phone && phone
                ? phoneValid
                  ? 'border-primary/50'
                  : 'border-destructive/50'
                : ''
            }`}
          />
          {touched.phone && phone && !phoneValid && (
            <p className="mt-1 text-[11px] text-destructive">请输入正确的 11 位手机号</p>
          )}
        </div>
        <Button size="sm" className="h-8 w-full text-xs" disabled={!emailValid || !phoneValid}>
          提交
        </Button>
      </div>
    </DemoCard>
  );
}

/** 52. 懒加载（图片按需加载） */
function LazyLoadCard() {
  const [loaded, setLoaded] = useState([1, 2]);
  const total = 6;

  return (
    <DemoCard
      conceptId={52}
      title="懒加载"
      desc="进入视口才加载资源，节省带宽"
      actionLabel="加载更多"
      onAction={() => {
        if (loaded.length >= total) return;
        setTimeout(() => {
          setLoaded((prev) =>
            Array.from({ length: Math.min(prev.length + 2, total) }, (_, i) => i + 1),
          );
        }, 700);
      }}
    >
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            已加载 {loaded.length} / {total}
          </span>
          {loaded.length < total && <Loader2 className="h-3 w-3 animate-spin" />}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: total }, (_, i) => i + 1).map((i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-md bg-muted/60"
            >
              {loaded.includes(i) ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-medium text-primary"
                >
                  图 {i}
                </motion.div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                  <ImageIcon className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DemoCard>
  );
}

/** 统一演示卡片容器 */
function DemoCard({
  conceptId,
  title,
  desc,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  children,
}: {
  conceptId: number;
  title: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  children: ReactNode;
}) {
  return (
    <Card
      data-concept-id={conceptId}
      className="flex min-h-[360px] flex-col overflow-hidden border-border/50 transition-shadow hover:shadow-md"
    >
      <CardContent className="flex h-full flex-1 flex-col p-6">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="shrink-0 font-mono text-xs">
                {String(conceptId).padStart(2, '0')}
              </Badge>
              <span className="text-base font-semibold">{title}</span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{desc}</p>
          </div>
          <InteractiveDot label="可交互演示" />
        </div>

        <div className="flex-1 rounded-xl border border-border/30 bg-muted/20 p-5">{children}</div>

        {(actionLabel || secondaryLabel) && (
          <div className="mt-4 flex gap-2">
            {actionLabel && onAction && (
              <Button
                size="sm"
                variant="secondary"
                className="h-9 flex-1 text-sm"
                onClick={onAction}
              >
                <Play className="mr-1.5 h-4 w-4" />
                {actionLabel}
              </Button>
            )}
            {secondaryLabel && onSecondary && (
              <Button size="sm" variant="outline" className="h-9 px-4 text-sm" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

