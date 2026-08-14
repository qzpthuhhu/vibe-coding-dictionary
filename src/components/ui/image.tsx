import { forwardRef, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * 轻量图片组件：默认懒加载 + 加载失败兜底
 * 懒加载 · 概念 52
 */
export const Image = forwardRef<HTMLImageElement, ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, loading = 'lazy', alt = '', ...props }, ref) => {
    return (
      <img
        ref={ref}
        alt={alt}
        loading={loading}
        decoding="async"
        className={cn('select-none', className)}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.opacity = '0.25';
        }}
        {...props}
      />
    );
  },
);

Image.displayName = 'Image';
