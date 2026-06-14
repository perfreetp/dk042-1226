import { Profile, Review } from '@/types/profile';

export const profiles: Profile[] = [
  {
    id: 'u1',
    name: '墨白·摄影师',
    avatar: 'https://picsum.photos/id/64/200/200',
    city: '杭州',
    size: {
      height: 178,
      weight: 68,
      bust: 96,
      waist: 82,
      hip: 94,
      shoeSize: 42
    },
    styles: ['宋制', '唐风', '魏晋', '清雅', '夜景'],
    works: [
      'https://picsum.photos/id/1015/600/800',
      'https://picsum.photos/id/1018/600/800',
      'https://picsum.photos/id/1025/600/800',
      'https://picsum.photos/id/1036/600/800'
    ],
    bio: '汉服摄影5年，擅长宋制清雅风格，作品曾被多家汉服杂志收录。合作过30+知名汉服品牌。',
    rating: 4.9,
    reviewCount: 128,
    verified: true,
    tags: ['资深摄影师', '杂志合作', '修图精湛']
  },
  {
    id: 'u2',
    name: '锦绣·妆娘',
    avatar: 'https://picsum.photos/id/177/200/200',
    city: '西安',
    size: {
      height: 165,
      weight: 50,
      bust: 86,
      waist: 66,
      hip: 88,
      shoeSize: 37
    },
    styles: ['唐制', '明制', '新娘妆', '舞台妆', '复原妆'],
    works: [
      'https://picsum.photos/id/225/600/800',
      'https://picsum.photos/id/230/600/800',
      'https://picsum.photos/id/250/600/800'
    ],
    bio: '高级化妆师，国家职业资格认证。专研唐代复原妆造，曾参与多部古装影视剧造型设计。',
    rating: 5.0,
    reviewCount: 256,
    verified: true,
    tags: ['资深化妆师', '复原妆', '影视合作']
  },
  {
    id: 'u3',
    name: '子轩·模特',
    avatar: 'https://picsum.photos/id/1012/200/200',
    city: '北京',
    size: {
      height: 183,
      weight: 70,
      bust: 98,
      waist: 80,
      hip: 96,
      shoeSize: 43
    },
    styles: ['魏晋', '明制', '男装', '道袍', '侠客风'],
    works: [
      'https://picsum.photos/id/1012/600/800',
      'https://picsum.photos/id/1015/600/800',
      'https://picsum.photos/id/1036/600/800',
      'https://picsum.photos/id/1039/600/800',
      'https://picsum.photos/id/1044/600/800'
    ],
    bio: '专业汉服男模，与多家头部汉服品牌保持长期合作。身形挺拔，镜头感强，擅长各类男装形制。',
    rating: 4.8,
    reviewCount: 89,
    verified: true,
    tags: ['职业模特', '品牌合作', '身形优']
  },
  {
    id: 'u4',
    name: '绾青丝·妆娘',
    avatar: 'https://picsum.photos/id/91/200/200',
    city: '上海',
    size: {
      height: 162,
      weight: 48,
      bust: 84,
      waist: 64,
      hip: 86,
      shoeSize: 36
    },
    styles: ['宋制', '明制', '日常妆', '发型全盘'],
    works: [
      'https://picsum.photos/id/220/600/800',
      'https://picsum.photos/id/230/600/800'
    ],
    bio: '热爱宋制美学，追求素雅大方的妆造风格。擅长根据脸型设计最适合的发髻。',
    rating: 4.7,
    reviewCount: 64,
    verified: true,
    tags: ['宋制专长', '性价比高', '细心']
  },
  {
    id: 'u5',
    name: '糖糖·模特',
    avatar: 'https://picsum.photos/id/1027/200/200',
    city: '成都',
    size: {
      height: 155,
      weight: 42,
      bust: 80,
      waist: 60,
      hip: 82,
      shoeSize: 34
    },
    styles: ['明制', '宋制', '汉元素', '娇小型', '可爱风'],
    works: [
      'https://picsum.photos/id/1027/600/800',
      'https://picsum.photos/id/1025/600/800',
      'https://picsum.photos/id/292/600/800'
    ],
    bio: '娇小型汉服模特，特别适合少女感、可爱风的汉服展示。有15+套汉服可用于拍摄。',
    rating: 4.6,
    reviewCount: 45,
    verified: false,
    tags: ['娇小型', '可爱', '性价比高']
  },
  {
    id: 'u6',
    name: '丹青·妆娘',
    avatar: 'https://picsum.photos/id/64/200/200',
    city: '南京',
    size: {
      height: 170,
      weight: 55,
      bust: 88,
      waist: 70,
      hip: 90,
      shoeSize: 38
    },
    styles: ['魏晋', '明制', '男妆', '侠女', '中性风'],
    works: [
      'https://picsum.photos/id/250/600/800',
      'https://picsum.photos/id/312/600/800'
    ],
    bio: '少见专攻男妆和中性风的妆娘，造型风格独特，大胆创新。',
    rating: 4.5,
    reviewCount: 32,
    verified: false,
    tags: ['男妆专长', '风格独特']
  },
  {
    id: 'u7',
    name: '忆江南·摄影师',
    avatar: 'https://picsum.photos/id/1012/200/200',
    city: '苏州',
    size: {
      height: 175,
      weight: 65,
      bust: 92,
      waist: 78,
      hip: 90,
      shoeSize: 41
    },
    styles: ['园林', '宋制', '明制', '水墨风', '旅拍'],
    works: [
      'https://picsum.photos/id/1018/600/800',
      'https://picsum.photos/id/1036/600/800',
      'https://picsum.photos/id/1039/600/800'
    ],
    bio: '土生土长苏州人，对园林光影的把握堪称一绝。提供妆造+摄影+服装一条龙服务。',
    rating: 4.9,
    reviewCount: 188,
    verified: true,
    tags: ['本地通', '一条龙服务', '光影大师']
  },
  {
    id: 'u8',
    name: '流光·摄影师',
    avatar: 'https://picsum.photos/id/338/200/200',
    city: '西安',
    size: {
      height: 180,
      weight: 72,
      bust: 96,
      waist: 82,
      hip: 96,
      shoeSize: 42
    },
    styles: ['唐风', '夜景', '西域风', '敦煌', '大气'],
    works: [
      'https://picsum.photos/id/1036/600/800',
      'https://picsum.photos/id/1080/600/800'
    ],
    bio: '专攻夜景与唐风摄影，不夜城最佳机位全知道。作品大气磅礴，还原盛唐气象。',
    rating: 4.8,
    reviewCount: 156,
    verified: true,
    tags: ['夜景专长', '唐风', '机位全']
  }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    profileId: 'u1',
    reviewer: {
      name: '清风徐来',
      avatar: 'https://picsum.photos/id/1012/200/200'
    },
    rating: 5,
    content: '墨白老师太专业了！构图、用光都非常讲究，后期修图也很自然，不会过度磨皮。宋制那组清雅感拍得绝了，强烈推荐！',
    createTime: '2026-06-10',
    verified: true
  },
  {
    id: 'r2',
    profileId: 'u1',
    reviewer: {
      name: '素衣飘飘',
      avatar: 'https://picsum.photos/id/1027/200/200'
    },
    rating: 5,
    content: '第二次合作了，每次都很满意。拍摄过程很放松，会引导动作，不会摆拍的小白也不用担心。',
    createTime: '2026-05-28',
    verified: true
  },
  {
    id: 'r3',
    profileId: 'u2',
    reviewer: {
      name: '长安月',
      avatar: 'https://picsum.photos/id/64/200/200'
    },
    rating: 5,
    content: '锦绣老师的唐妆真的是西安一绝！复原妆做得细致入微，发包盘得也很牢，一天都没塌。结婚就找她了！',
    createTime: '2026-06-08',
    verified: true
  },
  {
    id: 'r4',
    profileId: 'u3',
    reviewer: {
      name: '古韵新风',
      avatar: 'https://picsum.photos/id/338/200/200'
    },
    rating: 5,
    content: '子轩模特非常专业，动作到位，配合度高。魏晋那组飘逸感拍得特别好，后续还会合作。',
    createTime: '2026-06-05',
    verified: true
  },
  {
    id: 'r5',
    profileId: 'u2',
    reviewer: {
      name: '芙蓉园主',
      avatar: 'https://picsum.photos/id/91/200/200'
    },
    rating: 4,
    content: '妆面很精致，就是时间有点长，等了快三个小时。不过效果是真的好，朋友都说像穿越了。',
    createTime: '2026-05-20',
    verified: true
  }
];

export const safetyTips = [
  '线下见面前请务必告知亲友去向和见面地点',
  '建议首次见面选择公共场所（咖啡厅、景区等），避免去偏僻场所',
  '不要轻易透露个人隐私信息（家庭住址、身份证号、银行卡等）',
  '涉及费用请当面确认，避免提前大额转账',
  '如遇骚扰或危险，请立即报警并保留证据',
  '平台举报通道：我的 → 帮助与反馈 → 举报'
];
