// 网页内容载体数据：公司概览、关键数据、产品矩阵、生态产品、发展时间线、企业文化、FAQ
// EXPORTS: IMetric, IProduct, IProductCategory, IFeishuProduct, ITimelineStage,
//          ICultureValue, IFaq, COMPANY_INFO, MOCK_METRICS, MOCK_PRODUCT_CATEGORIES,
//          MOCK_FEISHU_PRODUCTS, MOCK_TIMELINE, MOCK_CULTURE, MOCK_FAQS

export interface IMetric {
  id: number;
  value: string;
  label: string;
  description: string;
  size: 'sm' | 'md' | 'lg';
}

export type ProductSize = 'large' | 'medium' | 'small';

export interface IProduct {
  name: string;
  enName?: string;
  logo: string;
  year: string;
  stat: string;
  description: string;
  /** 瀑布流高度参考值 */
  height: number;
  /** 卡片尺寸等级 */
  size: ProductSize;
  tags: string[];
  /** 附加数据点（large 3-4 条，medium 1-2 条，small 0 条） */
  extraStats: string[];
  /** 长描述（large 卡片使用） */
  longDesc: string;
  /** 大卡片顶部渐变色 */
  coverColor?: string;
}

export interface IProductCategory {
  id: string;
  name: string;
  icon: string;
  products: IProduct[];
}

export interface IFeishuProduct {
  name: string;
  category: 'base' | 'org' | 'ai' | 'platform';
  description: string;
  highlight?: string;
}

export interface ITimelineStage {
  period: string;
  years: string;
  events: { year: string; title: string; detail: string }[];
}

export interface ICultureValue {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

export interface IFaq {
  id: number;
  question: string;
  answer: string;
}

export const COMPANY_INFO = {
  name: '字节跳动',
  enName: 'ByteDance',
  founded: '2012年3月',
  founder: '张一鸣',
  ceo: '梁汝波',
  hq: '北京',
  mission: '激发创造，丰富生活',
  missionEn: 'Inspire Creativity, Enrich Life',
  countries: '150+',
  employees: '150,000+',
  cities: '120+',
};

export const MOCK_METRICS: IMetric[] = [
  { id: 1, value: '1860亿', label: '2025年全球营收', description: '美元 · 约1.3万亿人民币，净利润约3500亿', size: 'lg' },
  { id: 2, value: '1600亿', label: 'AI年投入', description: '人民币 · 持续加码大模型与AI应用', size: 'md' },
  { id: 3, value: '10亿', label: '抖音日活', description: '国内短视频绝对领先', size: 'lg' },
  { id: 4, value: '20亿+', label: 'TikTok 全球月活', description: '美国1.8亿 · 东南亚4.6亿', size: 'md' },
  { id: 5, value: '7.5亿+', label: '剪映/CapCut 用户', description: 'CapCut 海外月活5.8亿+', size: 'md' },
  { id: 6, value: '180万亿', label: '豆包日均 tokens', description: '较发布初期增长超1500倍', size: 'md' },
  { id: 7, value: '1.55亿', label: '豆包周活', description: '国民级 AI 助手', size: 'sm' },
  { id: 8, value: '50%', label: '火山引擎 MaaS 份额', description: '国内云厂商 MaaS 市场第一', size: 'sm' },
  { id: 9, value: '1000万', label: '飞书多维表格月活', description: '即将突破千万大关', size: 'sm' },
  { id: 10, value: '1亿+', label: '番茄小说用户', description: '免费阅读赛道领先', size: 'sm' },
  { id: 11, value: '31款', label: '字节AI应用', description: '覆盖7大核心赛道', size: 'sm' },
  { id: 12, value: '70%', label: 'TikTok Shop 增长', description: '2025年增长70%，连续两季度超Meta', size: 'sm' },
];

const LOGOS = {
  douyin: 'https://aka.doubaocdn.com/s/bXe8m2A5MW',
  tiktok: 'https://aka.doubaocdn.com/s/9Viy2uJyF4',
  toutiao: 'https://aka.doubaocdn.com/s/ASqZTwESVG',
  xigua: 'https://aka.doubaocdn.com/s/7e1oLUJ7pU',
  fanqie: 'https://aka.doubaocdn.com/s/T4QnfId6Hw',
  huoshan: 'https://aka.doubaocdn.com/s/SWlsqUykzg',
  jimeng: 'https://aka.doubaocdn.com/s/nUQLKbHAf2',
  coze: 'https://aka.doubaocdn.com/s/UwBBNpCN51',
  pico: 'https://aka.doubaocdn.com/s/s7mjz4eBt3',
  doubao: 'https://aka.doubaocdn.com/s/QyhyP33ST0',
  jianying: 'https://aka.doubaocdn.com/s/DJKUDp6dkr',
  feishu: 'https://aka.doubaocdn.com/s/V2fT6UzYP7',
  bytedance: 'https://aka.doubaocdn.com/s/cLf6wcmAzI',
};

export const MOCK_PRODUCT_CATEGORIES: IProductCategory[] = [
  {
    id: 'short-video',
    name: '短视频与社交',
    icon: '📹',
    products: [
      {
        name: '抖音',
        logo: LOGOS.douyin,
        year: '2016.09',
        stat: '日活 8-10 亿',
        description: '国内最大短视频平台',
        height: 420,
        size: 'large',
        tags: ['短视频', '国民应用', '兴趣电商'],
        extraStats: ['日均使用时长 120+ 分钟', '创作者 2 亿+', '直播 GMV 万亿级'],
        longDesc:
          '抖音是字节跳动旗下的短视频平台，通过算法推荐为用户提供个性化的短视频内容，现已发展为集短视频、直播、电商、本地生活于一体的超级 App，是中国互联网用户规模最大的应用之一。',
        coverColor: 'from-rose-500/20 via-pink-500/10 to-transparent',
      },
      {
        name: 'TikTok',
        logo: LOGOS.tiktok,
        year: '2017.05',
        stat: '月活 20 亿+',
        description: '全球短视频领导者',
        height: 400,
        size: 'large',
        tags: ['全球化', '短视频', 'Z世代'],
        extraStats: ['美国用户 1.8 亿', '东南亚 4.6 亿', 'TikTok Shop 增长 70%'],
        longDesc:
          'TikTok 是字节跳动旗下的全球短视频平台，已在 150 多个国家和地区上线，成为全球最受欢迎的社交媒体应用之一，深刻改变了全球内容消费和创作方式。',
        coverColor: 'from-cyan-500/20 via-pink-500/10 to-transparent',
      },
    ],
  },
  {
    id: 'content',
    name: '内容与信息',
    icon: '📰',
    products: [
      {
        name: '今日头条',
        logo: LOGOS.toutiao,
        year: '2012.08',
        stat: '算法推荐',
        description: '个性化资讯引擎，字节跳动首款产品',
        height: 280,
        size: 'medium',
        tags: ['资讯', '算法推荐'],
        extraStats: ['日活峰值过亿'],
        longDesc: '',
      },
      {
        name: '西瓜视频',
        logo: LOGOS.xigua,
        year: '中视频',
        stat: '3.5亿用户',
        description: '中视频内容平台',
        height: 180,
        size: 'small',
        tags: ['中视频'],
        extraStats: [],
        longDesc: '',
      },
      {
        name: '番茄小说',
        logo: LOGOS.fanqie,
        year: '2019',
        stat: '1亿+用户',
        description: '免费阅读赛道领先',
        height: 180,
        size: 'small',
        tags: ['网文', '免费阅读'],
        extraStats: [],
        longDesc: '',
      },
      {
        name: '懂车帝',
        logo: LOGOS.bytedance,
        year: '汽车',
        stat: '汽车资讯',
        description: '专业汽车内容与交易平台',
        height: 170,
        size: 'small',
        tags: ['汽车'],
        extraStats: [],
        longDesc: '',
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI产品与大模型',
    icon: '🤖',
    products: [
      {
        name: '豆包',
        logo: LOGOS.doubao,
        year: 'AI助手',
        stat: '周活 1.55 亿',
        description: '国民级 AI 助手',
        height: 380,
        size: 'large',
        tags: ['AI助手', '大模型', '国民应用'],
        extraStats: ['日均 tokens 180 万亿', '增长超 1500 倍', '覆盖 7 大核心赛道'],
        longDesc:
          '豆包是字节跳动推出的 AI 助手，基于 Seed 系列大模型，拥有超过 1.55 亿周活用户，日均处理 tokens 达 180 万亿，较发布初期增长超 1500 倍，是国内用户规模最大的 AI 助手产品。',
        coverColor: 'from-amber-400/20 via-orange-500/10 to-transparent',
      },
      {
        name: '即梦AI',
        logo: LOGOS.jimeng,
        year: 'AI创作',
        stat: 'Seedance 引擎',
        description: 'AI 视频创作平台',
        height: 290,
        size: 'medium',
        tags: ['AI视频', 'AIGC'],
        extraStats: ['Seedance 2.5 视频生成'],
        longDesc: '',
      },
      {
        name: '扣子 Coze',
        logo: LOGOS.coze,
        year: 'AI Agent',
        stat: 'Agent 平台',
        description: 'AI Agent 开发平台',
        height: 280,
        size: 'medium',
        tags: ['Agent', '低代码'],
        extraStats: ['Coze 2.0 已发布'],
        longDesc: '',
      },
      {
        name: '星绘AI',
        logo: LOGOS.bytedance,
        year: 'AI人像',
        stat: 'AI 人像生成',
        description: '专业级 AI 人像生成工具',
        height: 180,
        size: 'small',
        tags: ['AI图像'],
        extraStats: [],
        longDesc: '',
      },
    ],
  },
  {
    id: 'creation',
    name: '创作工具',
    icon: '🎨',
    products: [
      {
        name: '剪映 / CapCut',
        logo: LOGOS.jianying,
        year: '2019',
        stat: '7.5 亿+ 用户',
        description: '全能视频剪辑工具',
        height: 320,
        size: 'medium',
        tags: ['视频剪辑', '创作工具', '全球化'],
        extraStats: ['CapCut 海外月活 5.8 亿+', '全球最受欢迎的剪辑 App'],
        longDesc: '',
      },
      {
        name: 'Faceu 激萌',
        logo: LOGOS.bytedance,
        year: '相机',
        stat: '贴纸相机',
        description: '年轻人喜爱的自拍相机',
        height: 170,
        size: 'small',
        tags: ['相机'],
        extraStats: [],
        longDesc: '',
      },
    ],
  },
  {
    id: 'enterprise',
    name: '企业服务与云',
    icon: '💼',
    products: [
      {
        name: '飞书 Feishu',
        logo: LOGOS.feishu,
        year: '2019.08',
        stat: '企业协作平台',
        description: '一站式企业协作与管理平台',
        height: 400,
        size: 'large',
        tags: ['企业协作', 'OKR', '办公效率'],
        extraStats: ['多维表格月活近 1000 万', '8 大 AI 产品', '飞书妙记 M4 级'],
        longDesc:
          '飞书是字节跳动推出的一站式企业协作与管理平台，将即时消息、日历、文档、多维表格、视频会议等功能深度整合，帮助企业提升协同效率。2025 年全面拥抱 AI，发布飞书智能伙伴、飞书妙搭等 8 大 AI 产品。',
        coverColor: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      },
      {
        name: '火山引擎',
        logo: LOGOS.huoshan,
        year: '云服务',
        stat: 'MaaS 50% 份额',
        description: '企业级云服务与 AI 平台',
        height: 300,
        size: 'medium',
        tags: ['云计算', 'MaaS', '大模型'],
        extraStats: ['国内云厂商 MaaS 市场第一'],
        longDesc: '',
      },
      {
        name: '巨量引擎',
        logo: LOGOS.bytedance,
        year: '2019.01',
        stat: '商业品牌',
        description: '字节跳动商业化营销品牌',
        height: 200,
        size: 'small',
        tags: ['营销', '广告'],
        extraStats: [],
        longDesc: '',
      },
    ],
  },
  {
    id: 'ecommerce',
    name: '电商与交易',
    icon: '🛒',
    products: [
      {
        name: '抖音电商',
        logo: LOGOS.douyin,
        year: '2020',
        stat: '兴趣电商',
        description: '兴趣电商开创者，短视频+直播带货',
        height: 240,
        size: 'medium',
        tags: ['兴趣电商', '直播带货'],
        extraStats: ['GMV 万亿级规模'],
        longDesc: '',
      },
      {
        name: 'TikTok Shop',
        logo: LOGOS.tiktok,
        year: '跨境电商',
        stat: '增长 70%',
        description: '全球跨境电商平台',
        height: 200,
        size: 'small',
        tags: ['跨境电商'],
        extraStats: [],
        longDesc: '',
      },
    ],
  },
  {
    id: 'global',
    name: '海外产品',
    icon: '🌍',
    products: [
      {
        name: 'Lemon8',
        logo: LOGOS.bytedance,
        year: '生活社区',
        stat: '种草平台',
        description: '海外生活方式社区',
        height: 180,
        size: 'small',
        tags: ['生活方式'],
        extraStats: [],
        longDesc: '',
      },
      {
        name: 'Resso',
        logo: LOGOS.bytedance,
        year: '音乐',
        stat: '社交音乐',
        description: '全球社交音乐流媒体',
        height: 170,
        size: 'small',
        tags: ['音乐'],
        extraStats: [],
        longDesc: '',
      },
      {
        name: 'Dola',
        logo: LOGOS.bytedance,
        year: 'AI伴侣',
        stat: 'AI 应用',
        description: '海外 AI 伴侣应用',
        height: 180,
        size: 'small',
        tags: ['AI', '海外'],
        extraStats: [],
        longDesc: '',
      },
      {
        name: 'Gauth',
        logo: LOGOS.bytedance,
        year: 'AI学习',
        stat: '作业辅导',
        description: 'AI 学习辅导工具',
        height: 170,
        size: 'small',
        tags: ['AI', '教育'],
        extraStats: [],
        longDesc: '',
      },
    ],
  },
  {
    id: 'diversified',
    name: '教育健康硬件游戏',
    icon: '🎮',
    products: [
      {
        name: 'PICO',
        logo: LOGOS.pico,
        year: 'VR头显',
        stat: '自研芯片',
        description: 'VR/AR 硬件产品',
        height: 280,
        size: 'medium',
        tags: ['VR', '硬件', '自研芯片'],
        extraStats: ['自研 XR 芯片'],
        longDesc: '',
      },
      {
        name: '朝夕光年',
        logo: LOGOS.bytedance,
        year: '游戏',
        stat: '7 工作室',
        description: '12+ 款自研游戏',
        height: 260,
        size: 'medium',
        tags: ['游戏', '自研'],
        extraStats: ['《晶核》《航海王》等 12+ 款'],
        longDesc: '',
      },
      {
        name: '沐瞳科技',
        logo: LOGOS.bytedance,
        year: '游戏',
        stat: 'MLBB',
        description: 'Mobile Legends 开发商',
        height: 180,
        size: 'small',
        tags: ['MOBA'],
        extraStats: [],
        longDesc: '',
      },
      {
        name: '小荷健康',
        logo: LOGOS.bytedance,
        year: '健康',
        stat: '医疗健康',
        description: '互联网医疗健康平台',
        height: 170,
        size: 'small',
        tags: ['健康'],
        extraStats: [],
        longDesc: '',
      },
    ],
  },
];

export const MOCK_FEISHU_PRODUCTS: IFeishuProduct[] = [
  // 基础协作 12
  { name: '飞书消息', category: 'base', description: '即时通讯，高效沟通' },
  { name: '飞书文档', category: 'base', description: '在线协作文档' },
  { name: '飞书表格', category: 'base', description: '在线表格协作' },
  { name: '飞书多维表格 Base', category: 'base', description: '月活近1000万', highlight: '近1000万月活' },
  { name: '飞书知识库 Wiki', category: 'base', description: '企业知识沉淀' },
  { name: '飞书云盘', category: 'base', description: '企业文件管理' },
  { name: '飞书日历', category: 'base', description: '智能日程管理' },
  { name: '飞书会议', category: 'base', description: '高清视频会议' },
  { name: '飞书邮箱', category: 'base', description: '企业邮箱服务' },
  { name: '飞书画板', category: 'base', description: '在线协作白板' },
  { name: '飞书妙记', category: 'base', description: 'M4级会议纪要', highlight: 'M4级' },
  { name: '飞书幻灯片', category: 'base', description: '在线演示文稿' },
  // 组织管理 7
  { name: '飞书OKR', category: 'org', description: '目标管理工具' },
  { name: '飞书项目', category: 'org', description: '项目管理协作' },
  { name: '飞书审批', category: 'org', description: '流程审批系统' },
  { name: '飞书人事', category: 'org', description: '人力资源管理' },
  { name: '飞书招聘', category: 'org', description: '智能招聘系统' },
  { name: '飞书绩效', category: 'org', description: '绩效管理系统' },
  { name: '飞书服务台', category: 'org', description: 'IT服务管理' },
  // AI 产品 8
  { name: '飞书智能伙伴', category: 'ai', description: 'AI 办公助手', highlight: 'AI' },
  { name: '飞书知识问答', category: 'ai', description: 'M3级智能问答', highlight: 'M3级' },
  { name: '飞书 Aily', category: 'ai', description: 'Agent 形态常驻联系人', highlight: 'Agent' },
  { name: '飞书妙搭', category: 'ai', description: 'AI 原生低代码平台', highlight: 'AI' },
  { name: '多维表格 Agent', category: 'ai', description: '数据智能助手', highlight: 'AI' },
  { name: '飞书 AI 会议', category: 'ai', description: 'M4级智能会议', highlight: 'M4级' },
  { name: '飞书开发套件', category: 'ai', description: '开发者 AI 工具' },
  { name: '飞书 CLI', category: 'ai', description: '200+命令，MIT开源', highlight: '开源' },
  // 平台开放 4
  { name: '飞书应用引擎', category: 'platform', description: '低代码应用搭建' },
  { name: '飞书集成平台', category: 'platform', description: '系统集成连接' },
  { name: '飞书开放平台', category: 'platform', description: '开放API能力' },
  { name: '飞书工作台', category: 'platform', description: '统一工作入口' },
];

export const MOCK_TIMELINE: ITimelineStage[] = [
  {
    period: '初创期',
    years: '2012 - 2015',
    events: [
      { year: '2012.03', title: '公司成立', detail: '字节跳动在北京成立，创始人张一鸣。' },
      { year: '2012.08', title: '今日头条上线', detail: '第一款产品今日头条上线，开启算法推荐时代。' },
      { year: '2013', title: '日活100万', detail: '今日头条日活跃用户突破100万。' },
      { year: '2014', title: '日活1000万', detail: '一年十倍增长，日活突破1000万。' },
      { year: '2015', title: '启动全球化', detail: '开启海外扩张战略。' },
    ],
  },
  {
    period: '爆发期',
    years: '2016 - 2018',
    events: [
      { year: '2016.09', title: '抖音上线', detail: '抖音短视频上线，开启短视频时代。' },
      { year: '2017.05', title: 'TikTok 上线', detail: 'TikTok 出海，进军全球市场。' },
      { year: '2017.11', title: '收购 Musical.ly', detail: '收购美国短视频平台 Musical.ly。' },
      { year: '2018', title: '抖音 DAU 7000万', detail: '抖音日活突破7000万，全年营收500亿。' },
    ],
  },
  {
    period: '扩张期',
    years: '2019 - 2021',
    events: [
      { year: '2019.01', title: '巨量引擎', detail: '商业品牌巨量引擎发布。' },
      { year: '2019.08', title: '飞书上线', detail: '企业协作平台飞书正式发布。' },
      { year: '2019', title: '剪映 + 火山引擎', detail: '剪映App上线，火山引擎发布。' },
      { year: '2020', title: '抖音电商', detail: '抖音电商正式入局兴趣电商。' },
      { year: '2021.05', title: '梁汝波接任CEO', detail: '梁汝波接任字节跳动CEO。' },
    ],
  },
  {
    period: '成熟期',
    years: '2022 - 2024',
    events: [
      { year: '2022.06', title: '字节范更新6条', detail: '企业文化字节范更新为六条。' },
      { year: '2023', title: '即梦AI + 豆包 + 自研芯片', detail: '大模型与AI产品矩阵爆发，自研芯片落地。' },
      { year: '2024', title: 'Seed 1.5 + Seedance + Seedream', detail: '大模型能力持续突破，多模态全面布局。' },
    ],
  },
  {
    period: 'AI时代',
    years: '2025 - 至今',
    events: [
      { year: '2025', title: '营收1860亿 + AI投入1600亿', detail: '全球营收1860亿美元，AI年投入1600亿人民币。' },
      { year: '2025.05', title: '开源 Lance', detail: '开源30亿参数大模型 Lance。' },
      { year: '2025.07', title: '飞书AI全家桶', detail: '飞书全面拥抱AI，发布8大AI产品。' },
      { year: '2026', title: '31款AI应用', detail: '字节AI应用达31款，覆盖7大赛道。' },
    ],
  },
];

export const MOCK_CULTURE: ICultureValue[] = [
  { id: 1, title: '始终创业', subtitle: 'Always Day 1', description: '保持创业心态，敏捷有效，对外敏锐谦逊，持续进化。' },
  { id: 2, title: '多元兼容', subtitle: 'Champion Diversity and Inclusion', description: '欣赏个体多样性，全球视角，善意假设，和而不同。' },
  { id: 3, title: '坦诚清晰', subtitle: 'Be Candid and Clear', description: '表达真实想法，准确简洁直接，就事论事不绕弯。' },
  { id: 4, title: '求真务实', subtitle: 'Be Grounded', description: '独立思考刨根问底，直接体验拿一手数据，不自嗨。' },
  { id: 5, title: '敢为极致', subtitle: 'Aim for the Highest', description: '敢于明智冒险，尝试多种可能性，追求卓越高标准。' },
  { id: 6, title: '共同成长', subtitle: 'Grow Together', description: '相信使命愿景自驱，有耐心韧性，持续学习不设边界。' },
];

export const MOCK_FAQS: IFaq[] = [
  {
    id: 1,
    question: '这本视觉词典是做什么的？',
    answer:
      '这是一个「活的视觉词典」——网页本身真实演示 80 个网页设计与交互概念。开启探索模式后，鼠标移到任意区域即可看到该处运用了什么概念，并复制对应的 AI 提示词。',
  },
  {
    id: 2,
    question: '为什么用产品矩阵和数据作为内容载体？',
    answer:
      '因为要演示 Bento Grid、瀑布流、时间线、产品卡片等多种布局，就需要真实且有层级的内容。产品矩阵丰富、数据量大、发展历程有故事性，内容与形式相得益彰。',
  },
  {
    id: 3,
    question: '80 个概念都真实实现了吗？',
    answer:
      '是的。能全局展示的（布局、导航、滚动动画）直接在对应区域生效；不适合全局展示的（加载状态、空状态、表单验证、视觉风格、高级效果）集中在三大实验区用交互式演示块逐一呈现。',
  },
  {
    id: 4,
    question: '深色模式和减少动态怎么开启？',
    answer:
      '右上角导航栏和右下角悬浮按钮都可切换深浅色模式，选择会被记住。减少动效会自动读取系统的 prefers-reduced-motion 设置，高级效果实验场还提供了模拟开关可直接对比。',
  },
  {
    id: 5,
    question: '左侧索引和探索模式怎么用？',
    answer:
      '左侧索引列出全部区域和 8 章 80 个概念，点击可跳转并高亮对应位置，支持搜索过滤。点击左下角放大镜或按 E 键开启探索模式，之后鼠标 hover 任意区域都会弹出讲解卡。',
  },
  {
    id: 6,
    question: '性能指标是真实的吗？',
    answer:
      '是的，页脚的 LCP、CLS、FID 通过浏览器 Performance API 实时测量，不是写死的数据。FID 需要用户交互后才会有数值。',
  },
];
