import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="font-mono text-6xl font-black text-primary">404</div>
      <p className="mt-4 text-lg font-medium">页面不存在</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        这个地址没有对应的内容，回到首页可以浏览全部 80 个视觉概念。
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        返回首页
      </Link>
    </div>
  );
}
