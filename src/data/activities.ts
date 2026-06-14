import { Activity, MyRegistration, RegisterStatus } from '@/types/activity';

export const activities: Activity[] = [
  {
    id: '1',
    title: '长安雅集·唐制汉服茶会',
    type: 'tea',
    coverImage: 'https://picsum.photos/id/1080/750/500',
    city: '西安',
    location: '曲江池遗址公园·雅集茶社',
    date: '2026-06-20',
    gatherTime: '14:00',
    dynasty: 'tang',
    maxPeople: 20,
    registeredPeople: 15,
    waitingPeople: 3,
    fee: 88,
    dressCode: '仅限唐制汉服入场，建议齐胸襦裙或圆领袍',
    description: '品香茗、赏古乐、体验唐风点茶技艺，同袍相聚共话长安风雅。现场设有唐风妆造体验区与诗词飞花令互动环节。',
    organizer: {
      name: '长安汉服社',
      avatar: 'https://picsum.photos/id/64/200/200',
      contact: '微信：changan_hfs'
    },
    tags: ['唐风', '品茶', '交友'],
    album: [
      'https://picsum.photos/id/292/400/400',
      'https://picsum.photos/id/312/400/400',
      'https://picsum.photos/id/326/400/400'
    ]
  },
  {
    id: '2',
    title: '西湖夏日·宋韵游园会',
    type: 'garden',
    coverImage: 'https://picsum.photos/id/1039/750/500',
    city: '杭州',
    location: '西湖风景名胜区·曲院风荷',
    date: '2026-06-22',
    gatherTime: '09:30',
    dynasty: 'song',
    maxPeople: 50,
    registeredPeople: 42,
    waitingPeople: 8,
    fee: 0,
    dressCode: '建议宋制汉服，褙子、宋裤皆可',
    description: '漫步西湖荷畔，体验投壶、射箭、团扇DIY等宋代传统游戏，专业摄影师全程跟拍。',
    organizer: {
      name: '杭州宋韵文化协会',
      avatar: 'https://picsum.photos/id/91/200/200',
      contact: '电话：0571-88886666'
    },
    tags: ['宋韵', '游园', '免费'],
    album: [
      'https://picsum.photos/id/1015/400/400',
      'https://picsum.photos/id/1018/400/400'
    ]
  },
  {
    id: '3',
    title: '明制妆造大师课·景泰蓝韵',
    type: 'makeup',
    coverImage: 'https://picsum.photos/id/225/750/500',
    city: '北京',
    location: '798艺术区·古韵工作室',
    date: '2026-06-25',
    gatherTime: '10:00',
    dynasty: 'ming',
    maxPeople: 12,
    registeredPeople: 10,
    waitingPeople: 5,
    fee: 298,
    dressCode: '课堂内提供明制服饰体验，也可自带',
    description: '国家高级化妆师亲授明代古典妆容，包含底妆、眉眼、唇妆全流程，赠送景泰蓝头饰制作体验。',
    organizer: {
      name: '古韵美妆学院',
      avatar: 'https://picsum.photos/id/177/200/200',
      contact: '微信：guyun_makeup'
    },
    tags: ['妆造', '明制', '教学'],
    album: [
      'https://picsum.photos/id/250/400/400',
      'https://picsum.photos/id/220/400/400'
    ]
  },
  {
    id: '4',
    title: '金陵汉风市集·非遗手作',
    type: 'market',
    coverImage: 'https://picsum.photos/id/431/750/500',
    city: '南京',
    location: '老门东历史文化街区',
    date: '2026-06-28',
    gatherTime: '15:00',
    dynasty: 'any',
    maxPeople: 200,
    registeredPeople: 86,
    waitingPeople: 0,
    fee: 0,
    dressCode: '欢迎各类形制汉服，无形制限制',
    description: '汇聚50+汉服与非遗手作摊位，簪花、团扇、香囊、苏绣应有尽有。穿汉服入场可享专属折扣。',
    organizer: {
      name: '南京汉服文化促进会',
      avatar: 'https://picsum.photos/id/338/200/200',
      contact: '公众号：金陵汉风'
    },
    tags: ['市集', '非遗', '免费'],
    album: [
      'https://picsum.photos/id/580/400/400',
      'https://picsum.photos/id/625/400/400'
    ]
  },
  {
    id: '5',
    title: '姑苏园林·魏晋风度雅集',
    type: 'tea',
    coverImage: 'https://picsum.photos/id/570/750/500',
    city: '苏州',
    location: '拙政园·远香堂',
    date: '2026-07-02',
    gatherTime: '13:30',
    dynasty: 'weiJin',
    maxPeople: 15,
    registeredPeople: 9,
    waitingPeople: 2,
    fee: 128,
    dressCode: '魏晋风格汉服，杂裾垂髾为佳',
    description: '在拙政园雅集，抚琴听竹，曲水流觞，体验魏晋名士的风雅生活。',
    organizer: {
      name: '吴门汉服社',
      avatar: 'https://picsum.photos/id/1027/200/200',
      contact: '微信：wumen_hfs'
    },
    tags: ['魏晋', '园林', '雅集'],
    album: []
  },
  {
    id: '6',
    title: '洛城牡丹·汉服摄影游园',
    type: 'garden',
    coverImage: 'https://picsum.photos/id/1036/750/500',
    city: '洛阳',
    location: '王城公园·牡丹园',
    date: '2026-07-05',
    gatherTime: '08:00',
    dynasty: 'tang',
    maxPeople: 30,
    registeredPeople: 25,
    waitingPeople: 6,
    fee: 66,
    dressCode: '唐制汉服，色彩可艳丽一些配合牡丹花',
    description: '国花园汉服巡游，专业摄影师免费跟拍，评选最佳牡丹仙子。',
    organizer: {
      name: '洛阳牡丹汉服社',
      avatar: 'https://picsum.photos/id/1027/200/200',
      contact: '电话：0379-66668888'
    },
    tags: ['唐风', '摄影', '牡丹'],
    album: []
  },
  {
    id: '7',
    title: '汉服发型基础班·古风云鬓',
    type: 'makeup',
    coverImage: 'https://picsum.photos/id/230/750/500',
    city: '上海',
    location: '徐汇区·云锦工作室',
    date: '2026-06-21',
    gatherTime: '14:00',
    dynasty: 'any',
    maxPeople: 8,
    registeredPeople: 8,
    waitingPeople: 12,
    fee: 198,
    dressCode: '无要求，可自带汉服做整体造型',
    description: '零基础入门教学，包含常用古风发型3款，赠送假发包套装。',
    organizer: {
      name: '云锦造型工作室',
      avatar: 'https://picsum.photos/id/64/200/200',
      contact: '微信：yunjin_style'
    },
    tags: ['发型', '教学', '基础'],
    album: []
  },
  {
    id: '8',
    title: '锦城汉服市集·端午特别场',
    type: 'market',
    coverImage: 'https://picsum.photos/id/835/750/500',
    city: '成都',
    location: '宽窄巷子·小洋楼广场',
    date: '2026-06-19',
    gatherTime: '10:00',
    dynasty: 'any',
    maxPeople: 300,
    registeredPeople: 156,
    waitingPeople: 0,
    fee: 0,
    dressCode: '欢迎各类汉服，端午元素为佳',
    description: '端午汉服市集，香囊DIY、包粽子体验、汉服巡游，还有传统射五毒游戏。',
    organizer: {
      name: '天府汉服联盟',
      avatar: 'https://picsum.photos/id/177/200/200',
      contact: '公众号：天府汉服'
    },
    tags: ['端午', '市集', '成都'],
    album: []
  },
  {
    id: '9',
    title: '汉制周制婚礼体验沙龙',
    type: 'tea',
    coverImage: 'https://picsum.photos/id/1080/750/500',
    city: '西安',
    location: '大明宫国家遗址公园',
    date: '2026-07-10',
    gatherTime: '14:30',
    dynasty: 'han',
    maxPeople: 20,
    registeredPeople: 11,
    waitingPeople: 4,
    fee: 168,
    dressCode: '建议汉制汉服，曲裾、直裾',
    description: '体验传统周制婚礼流程，包括沃盥礼、同牢礼、合卺礼等，感受华夏婚俗的庄重典雅。',
    organizer: {
      name: '华夏礼学馆',
      avatar: 'https://picsum.photos/id/338/200/200',
      contact: '微信：huaxia_lixue'
    },
    tags: ['汉制', '婚礼', '礼仪'],
    album: []
  },
  {
    id: '10',
    title: '魔都秋日汉服公园野餐',
    type: 'garden',
    coverImage: 'https://picsum.photos/id/1044/750/500',
    city: '上海',
    location: '世纪公园·银杏大道',
    date: '2026-07-08',
    gatherTime: '11:00',
    dynasty: 'any',
    maxPeople: 25,
    registeredPeople: 18,
    waitingPeople: 3,
    fee: 50,
    dressCode: '各类形制汉服均可，秋色系服装更佳',
    description: '汉服野餐聚会，分享美食，交流汉服穿搭心得，摄影爱好者请带相机。',
    organizer: {
      name: '海上汉服社',
      avatar: 'https://picsum.photos/id/91/200/200',
      contact: '微信：haishang_hfs'
    },
    tags: ['野餐', '交友', '摄影'],
    album: []
  }
];

export const myRegistrations: MyRegistration[] = [
  {
    id: 'reg1',
    activityId: '1',
    activity: activities[0],
    status: 'registered',
    registerTime: '2026-06-10 14:30'
  },
  {
    id: 'reg2',
    activityId: '2',
    activity: activities[1],
    status: 'checkedIn',
    registerTime: '2026-06-08 09:15',
    checkInTime: '2026-06-15 09:35'
  },
  {
    id: 'reg3',
    activityId: '7',
    activity: activities[6],
    status: 'waiting',
    registerTime: '2026-06-12 16:20'
  },
  {
    id: 'reg4',
    activityId: '4',
    activity: activities[3],
    status: 'completed',
    registerTime: '2026-05-20 10:00',
    checkInTime: '2026-05-28 15:10'
  },
  {
    id: 'reg5',
    activityId: '3',
    activity: activities[2],
    status: 'cancelled',
    registerTime: '2026-06-01 11:00'
  }
];

export const statusTextMap: Record<RegisterStatus, string> = {
  registered: '已报名',
  waiting: '候补中',
  cancelled: '已取消',
  checkedIn: '已签到',
  completed: '已完成'
};

export const statusColorMap: Record<RegisterStatus, string> = {
  registered: '#5A8F69',
  waiting: '#D4985A',
  cancelled: '#C9C0B3',
  checkedIn: '#8B4557',
  completed: '#86909C'
};

export const activityTypeTextMap: Record<string, string> = {
  tea: '茶会',
  garden: '游园',
  makeup: '妆造体验',
  market: '市集'
};

export const dynastyTextMap: Record<string, string> = {
  tang: '唐制',
  song: '宋制',
  ming: '明制',
  han: '汉制',
  weiJin: '魏晋',
  any: '不限'
};

export const cities = ['全部', '北京', '上海', '西安', '杭州', '南京', '苏州', '洛阳', '成都'];
export const activityTypes = [
  { value: 'all', label: '全部类型' },
  { value: 'tea', label: '茶会' },
  { value: 'garden', label: '游园' },
  { value: 'makeup', label: '妆造体验' },
  { value: 'market', label: '市集' }
];
export const dynasties = [
  { value: 'any', label: '全部朝代' },
  { value: 'tang', label: '唐制' },
  { value: 'song', label: '宋制' },
  { value: 'ming', label: '明制' },
  { value: 'han', label: '汉制' },
  { value: 'weiJin', label: '魏晋' }
];
