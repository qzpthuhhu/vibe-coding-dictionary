import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SECTIONS = [
  { id: 'hero', label: '首页 · Hero' },
  { id: 'metrics', label: '关键数据' },
  { id: 'products', label: '产品矩阵' },
  { id: 'mobile-demo', label: '移动端组件' },
  { id: 'feishu', label: '飞书生态' },
  { id: 'timeline', label: '发展时间线' },
  { id: 'culture', label: '企业文化' },
  { id: 'status-lab', label: '状态反馈实验室' },
  { id: 'style-gallery', label: '视觉风格画廊' },
  { id: 'advanced-lab', label: '高级效果实验场' },
  { id: 'dictionary', label: '概念词典' },
  { id: 'faq', label: 'FAQ' },
  { id: 'footer', label: '页脚' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
