// 80 个 Vibe Coding 网页视觉概念的基础数据
// EXPORTS: ConceptLevel, IConcept, CHAPTERS, CONCEPTS

export type ConceptLevel = 'region' | 'element';

export interface IConcept {
  id: number;
  name: string;
  chapter: number;
  chapterName: string;
  /** 所属页面区域 id */
  section: string;
  description: string;
  /** 仅在概念词典区/实验室集中演示 */
  demoOnly?: boolean;
  /** 概念层级：region 区域级 / element 元素级 */
  level: ConceptLevel;
}

export const CHAPTERS = [
  { id: 1, name: '页面布局', range: '1-10' },
  { id: 2, name: '页面结构', range: '11-20' },
  { id: 3, name: '导航与切换', range: '21-30' },
  { id: 4, name: '常用组件', range: '31-40' },
  { id: 5, name: '滚动与动作', range: '41-50' },
  { id: 6, name: '提示与加载', range: '51-60' },
  { id: 7, name: '视觉风格', range: '61-70' },
  { id: 8, name: '高级效果', range: '71-80' },
];

export const CONCEPTS: IConcept[] = [
  // 第 1 章 · 页面布局
  { id: 1, name: '卡片式布局', chapter: 1, chapterName: '页面布局', section: 'products', description: '信息封装在独立卡片中，视觉清晰、易扫描、响应式友好。', level: 'region' },
  { id: 2, name: '瀑布流', chapter: 1, chapterName: '页面布局', section: 'products', description: '多列不等高卡片自然排列，充分利用垂直空间。', level: 'region' },
  { id: 3, name: 'Bento Grid', chapter: 1, chapterName: '页面布局', section: 'metrics', description: '便当盒式网格布局，大小格子错落有致，信息层级丰富。', level: 'region' },
  { id: 4, name: '分屏布局', chapter: 1, chapterName: '页面布局', section: 'feishu', description: '左右分屏，一侧导航一侧内容，适合分类浏览。', level: 'region' },
  { id: 5, name: 'CSS Grid', chapter: 1, chapterName: '页面布局', section: 'dictionary', description: '二维网格布局系统，精准控制行列，构建复杂排版。', level: 'region' },
  { id: 6, name: 'Flexbox', chapter: 1, chapterName: '页面布局', section: 'header', description: '一维弹性布局，导航栏页脚等线性排列的最佳选择。', level: 'element' },
  { id: 7, name: '侧边栏布局', chapter: 1, chapterName: '页面布局', section: 'sidebar', description: '左侧固定索引面板，右侧滚动内容，快速定位。', level: 'region' },
  { id: 8, name: '仪表盘布局', chapter: 1, chapterName: '页面布局', section: 'metrics', description: '数据卡片 + 图表 + 指标，一览全局数据状态。', level: 'region' },
  { id: 9, name: '响应式布局', chapter: 1, chapterName: '页面布局', section: 'mobile-demo', description: '适配桌面/平板/手机多端视口，布局自动重排。', level: 'region' },
  { id: 10, name: '全出血布局', chapter: 1, chapterName: '页面布局', section: 'hero', description: '背景铺满整个视口宽度，打破容器限制，视觉冲击力强。', level: 'region' },

  // 第 2 章 · 页面结构
  { id: 11, name: '单页网站', chapter: 2, chapterName: '页面结构', section: 'hero', description: '所有内容在一个页面内，滚动浏览，连贯流畅。', level: 'region' },
  { id: 12, name: '多页网站', chapter: 2, chapterName: '页面结构', section: 'dictionary', description: '分页浏览，URL 独立，适合内容量大的场景。', demoOnly: true, level: 'element' },
  { id: 13, name: '落地页', chapter: 2, chapterName: '页面结构', section: 'dictionary', description: '聚焦单一转化目标的页面，结构精简聚焦。', demoOnly: true, level: 'element' },
  { id: 14, name: '案例研究页', chapter: 2, chapterName: '页面结构', section: 'dictionary', description: '展示项目/案例的详情页，图文结合叙事。', demoOnly: true, level: 'element' },
  { id: 15, name: 'Hero Section', chapter: 2, chapterName: '页面结构', section: 'hero', description: '首屏大标题 + 副标题 + CTA，决定用户第一印象。', level: 'region' },
  { id: 16, name: '功能网格', chapter: 2, chapterName: '页面结构', section: 'culture', description: '3x2 / NxM 网格展示特性，条理清晰。', level: 'region' },
  { id: 17, name: '固定叙事', chapter: 2, chapterName: '页面结构', section: 'timeline', description: '左侧标题固定，右侧内容滚动，引导阅读节奏。', level: 'region' },
  { id: 18, name: '时间线', chapter: 2, chapterName: '页面结构', section: 'timeline', description: '垂直或横向时间轴展示事件发展顺序。', level: 'region' },
  { id: 19, name: 'FAQ', chapter: 2, chapterName: '页面结构', section: 'faq', description: '常见问题手风琴展开，节省空间便于查找。', level: 'region' },
  { id: 20, name: '页脚', chapter: 2, chapterName: '页面结构', section: 'footer', description: '多列底部信息，含导航、联系、版权等。', level: 'region' },

  // 第 3 章 · 导航与切换
  { id: 21, name: '固定导航', chapter: 3, chapterName: '导航与切换', section: 'header', description: '顶部导航栏固定不动，滚动时始终可达。', level: 'element' },
  { id: 22, name: '汉堡菜单', chapter: 3, chapterName: '导航与切换', section: 'mobile-demo', description: '移动端收起导航，点击展开侧边抽屉。', level: 'element' },
  { id: 23, name: '面包屑', chapter: 3, chapterName: '导航与切换', section: 'mobile-demo', description: '显示当前位置层级，支持快速返回上级。', level: 'element' },
  { id: 24, name: '锚点跳转', chapter: 3, chapterName: '导航与切换', section: 'sidebar', description: '点击导航平滑滚动到对应区域。', level: 'element' },
  { id: 25, name: '标签切换', chapter: 3, chapterName: '导航与切换', section: 'feishu', description: 'Tab 切换不同内容分类，节省空间。', level: 'element' },
  { id: 26, name: '侧边导航', chapter: 3, chapterName: '导航与切换', section: 'sidebar', description: '左侧固定概念索引，当前区域高亮。', level: 'element' },
  { id: 27, name: '超级菜单', chapter: 3, chapterName: '导航与切换', section: 'header', description: 'hover 导航项弹出多列大菜单，展示丰富子项。', level: 'element' },
  { id: 28, name: '底部导航', chapter: 3, chapterName: '导航与切换', section: 'mobile-demo', description: '移动端底部 Tab 导航，拇指可达。', level: 'element' },
  { id: 29, name: '分页', chapter: 3, chapterName: '导航与切换', section: 'dictionary', description: '大量内容分页浏览，可跳页。', demoOnly: true, level: 'element' },
  { id: 30, name: '返回顶部', chapter: 3, chapterName: '导航与切换', section: 'footer', description: '滚动到一定位置后出现，一键回到顶部。', level: 'element' },

  // 第 4 章 · 常用组件
  { id: 31, name: '模态框', chapter: 4, chapterName: '常用组件', section: 'products', description: '弹窗展示详情，遮罩背景聚焦内容。', level: 'element' },
  { id: 32, name: '抽屉', chapter: 4, chapterName: '常用组件', section: 'culture', description: '从侧边滑出面板，展示更多信息。', level: 'element' },
  { id: 33, name: '手风琴', chapter: 4, chapterName: '常用组件', section: 'faq', description: '折叠展开式列表，节省空间。', level: 'element' },
  { id: 34, name: '气泡提示', chapter: 4, chapterName: '常用组件', section: 'sidebar', description: 'hover 显示 Tooltip 补充说明。', level: 'element' },
  { id: 35, name: '轻提示 Toast', chapter: 4, chapterName: '常用组件', section: 'status-lab', description: '操作后右上角弹出短暂提示，不打断流程。', level: 'element' },
  { id: 36, name: '轮播图', chapter: 4, chapterName: '常用组件', section: 'hero', description: '多张图/Logo 自动轮播展示。', level: 'element' },
  { id: 37, name: '图片灯箱', chapter: 4, chapterName: '常用组件', section: 'products', description: '点击图片放大查看，遮罩聚焦。', level: 'element' },
  { id: 38, name: '表单', chapter: 4, chapterName: '常用组件', section: 'status-lab', description: '输入 + 验证 + 提交，收集用户信息。', level: 'element' },
  { id: 39, name: '命令面板', chapter: 4, chapterName: '常用组件', section: 'header', description: 'Cmd+K 弹出搜索跳转，快捷操作。', level: 'element' },
  { id: 40, name: '悬浮操作按钮 FAB', chapter: 4, chapterName: '常用组件', section: 'footer', description: '右下角悬浮按钮，展开快速操作。', level: 'element' },

  // 第 5 章 · 滚动与动作
  { id: 41, name: '滚动出现', chapter: 5, chapterName: '滚动与动作', section: 'metrics', description: '内容进入视口时淡入上移动画。', level: 'element' },
  { id: 42, name: '视差滚动', chapter: 5, chapterName: '滚动与动作', section: 'hero', description: '背景与前景不同速度滚动，营造层次感。', level: 'region' },
  { id: 43, name: '阅读进度条', chapter: 5, chapterName: '滚动与动作', section: 'header', description: '顶部进度条显示阅读进度。', level: 'element' },
  { id: 44, name: '滚动吸附', chapter: 5, chapterName: '滚动与动作', section: 'timeline', description: '横向滚动时自动吸附到卡片对齐位置。', level: 'element' },
  { id: 45, name: '横向滚动', chapter: 5, chapterName: '滚动与动作', section: 'products', description: '内容横向排列，左右滑动浏览。', level: 'element' },
  { id: 46, name: '无限滚动', chapter: 5, chapterName: '滚动与动作', section: 'status-lab', description: '滚动到底部自动加载更多内容。', level: 'element' },
  { id: 47, name: '跑马灯', chapter: 5, chapterName: '滚动与动作', section: 'hero', description: '文字/Logo 无限循环滚动展示。', level: 'element' },
  { id: 48, name: '悬停微交互', chapter: 5, chapterName: '滚动与动作', section: 'products', description: '卡片/按钮 hover 时缩放、阴影变化。', level: 'element' },
  { id: 49, name: '错峰动画', chapter: 5, chapterName: '滚动与动作', section: 'culture', description: '元素逐个延迟淡入，形成节奏感。', level: 'element' },
  { id: 50, name: '滚动驱动动画', chapter: 5, chapterName: '滚动与动作', section: 'hero', description: '动画进度与滚动位置绑定，滚动即播放。', level: 'element' },

  // 第 6 章 · 提示与加载
  { id: 51, name: '骨架屏', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '加载中显示内容轮廓，降低等待焦虑。', level: 'element' },
  { id: 52, name: '懒加载', chapter: 6, chapterName: '提示与加载', section: 'products', description: '图片滚动到附近才加载，节省带宽。', level: 'element' },
  { id: 53, name: '加载转圈', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '多种 Spinner 样式表示加载中。', level: 'element' },
  { id: 54, name: '进度条', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '显示任务完成百分比进度。', level: 'element' },
  { id: 55, name: '加载按钮', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '按钮点击后显示加载状态，防重复提交。', level: 'element' },
  { id: 56, name: '空状态', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '无数据时的友好展示和引导。', level: 'element' },
  { id: 57, name: '错误状态', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '操作失败时的提示和解决方案。', level: 'element' },
  { id: 58, name: '重试状态', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '加载失败提供重试按钮。', level: 'element' },
  { id: 59, name: '乐观更新', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '先更新 UI 再等待响应，失败则回滚。', level: 'element' },
  { id: 60, name: '行内验证', chapter: 6, chapterName: '提示与加载', section: 'status-lab', description: '表单输入时实时验证并提示。', level: 'element' },

  // 第 7 章 · 视觉风格
  { id: 61, name: '极简主义', chapter: 7, chapterName: '视觉风格', section: 'style-gallery', description: '大量留白，内容精炼，突出重点。', level: 'region' },
  { id: 62, name: '编辑杂志风', chapter: 7, chapterName: '视觉风格', section: 'style-gallery', description: '大标题 + 图文混排，杂志级排版。', level: 'region' },
  { id: 63, name: '瑞士风', chapter: 7, chapterName: '视觉风格', section: 'style-gallery', description: '网格系统 + 无衬线字体 + 克制用色。', level: 'element' },
  { id: 64, name: '玻璃拟态', chapter: 7, chapterName: '视觉风格', section: 'header', description: '毛玻璃效果 + 半透明背景，现代感强。', level: 'element' },
  { id: 65, name: '新野兽派', chapter: 7, chapterName: '视觉风格', section: 'style-gallery', description: '粗边框 + 高对比 + 大胆几何，视觉冲击。', level: 'element' },
  { id: 66, name: '深色模式', chapter: 7, chapterName: '视觉风格', section: 'style-gallery', description: '深色背景 + 浅色文字，护眼省电。', level: 'element' },
  { id: 67, name: '单色双色', chapter: 7, chapterName: '视觉风格', section: 'style-gallery', description: '仅用 1-2 种颜色构建视觉体系。', level: 'element' },
  { id: 68, name: '网格渐变', chapter: 7, chapterName: '视觉风格', section: 'hero', description: '网格 + 渐变背景，营造科技感。', level: 'region' },
  { id: 69, name: '颗粒噪点', chapter: 7, chapterName: '视觉风格', section: 'style-gallery', description: '全页面叠加细微噪点纹理，增加质感。', level: 'element' },
  { id: 70, name: '新拟态', chapter: 7, chapterName: '视觉风格', section: 'style-gallery', description: '柔和阴影营造凸起/凹陷的物理质感。', level: 'element' },

  // 第 8 章 · 高级效果
  { id: 71, name: '自定义光标', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: '桌面端自定义光标样式，hover 交互元素时变化。', level: 'element' },
  { id: 72, name: '磁吸按钮', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: '鼠标靠近时按钮被吸引，增强点击欲。', level: 'element' },
  { id: 73, name: '三维倾斜卡片', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: 'hover 时卡片 3D 倾斜跟随鼠标。', level: 'element' },
  { id: 74, name: '聚光灯悬停', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: '卡片 hover 时光晕跟随鼠标移动。', level: 'element' },
  { id: 75, name: '图片文字蒙版', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: '文字填充渐变/图片，视觉冲击力强。', level: 'element' },
  { id: 76, name: '裁切揭示', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: '图片用 clip-path 动画裁切揭示。', level: 'element' },
  { id: 77, name: 'WebGL 粒子动画', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: 'Canvas/WebGL 渲染的粒子系统。', level: 'element' },
  { id: 78, name: '视图过渡', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: 'View Transitions API 实现平滑页面过渡。', level: 'element' },
  { id: 79, name: '减少动态', chapter: 8, chapterName: '高级效果', section: 'advanced-lab', description: '尊重 prefers-reduced-motion，关闭动画。', level: 'element' },
  { id: 80, name: '性能预算', chapter: 8, chapterName: '高级效果', section: 'footer', description: '页脚展示 LCP/CLS/FID 真实性能指标。', level: 'element' },
];
