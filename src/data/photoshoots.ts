import { Photoshoot, ShootRole } from '@/types/photoshoot';

export const shootRoleTextMap: Record<ShootRole, string> = {
  photographer: '摄影师',
  stylist: '妆娘',
  model: '模特'
};

export const photoshoots: Photoshoot[] = [
  {
    id: 'p1',
    role: 'photographer',
    title: '寻宋韵·西湖边汉服摄影招募模特',
    coverImage: 'https://picsum.photos/id/1025/750/500',
    author: {
      id: 'u1',
      name: '墨白·摄影师',
      avatar: 'https://picsum.photos/id/64/200/200'
    },
    city: '杭州',
    date: '2026-06-25',
    budget: '300-500/组',
    description: '本人为资深汉服摄影师，作品多登汉服荟首页。本次想拍一组宋制清雅风格作品，地点西湖曲院风荷，时间6月25日上午。需要宋制汉服女模特一位，身高160+，五官清秀，有拍摄经验优先。费用根据出片质量结算，可商量。',
    style: ['宋制', '清雅', '外景'],
    contact: '微信：mobai_photo',
    createTime: '2026-06-12 10:30',
    viewCount: 328
  },
  {
    id: 'p2',
    role: 'stylist',
    title: '唐制新娘妆·资深妆娘接单',
    coverImage: 'https://picsum.photos/id/225/750/500',
    author: {
      id: 'u2',
      name: '锦绣·妆娘',
      avatar: 'https://picsum.photos/id/177/200/200'
    },
    city: '西安',
    date: '全月可约',
    budget: '688起',
    description: '从业6年，专研唐制明制古风妆容，承接汉服日常妆、婚妆、舞台妆。使用一线品牌化妆品，假发包、头饰齐全。可上门服务，西安市区免路费。提供试妆服务（收取定金）。',
    style: ['唐制', '新娘妆', '明制'],
    contact: '微信：jinxiu_zhuang',
    createTime: '2026-06-11 15:20',
    viewCount: 512
  },
  {
    id: 'p3',
    role: 'model',
    title: '汉服男模·寻找合作摄影师',
    coverImage: 'https://picsum.photos/id/1012/750/500',
    author: {
      id: 'u3',
      name: '子轩·模特',
      avatar: 'https://picsum.photos/id/1012/200/200'
    },
    city: '北京',
    date: '周末均可',
    budget: '费用可商/互勉',
    description: '身高183，体重70kg，汉服模特2年经验，多拍魏晋、明制男装，有圆领袍、道袍、直裰等多套汉服。接受互勉创作（需作品优秀），商拍报价合理。希望找长期合作的摄影师。',
    style: ['魏晋', '明制', '男装'],
    contact: '微信：zixuan_model',
    createTime: '2026-06-10 09:45',
    viewCount: 276
  },
  {
    id: 'p4',
    role: 'photographer',
    title: '夜景汉服·大唐不夜城',
    coverImage: 'https://picsum.photos/id/1036/750/500',
    author: {
      id: 'u4',
      name: '流光·摄影师',
      avatar: 'https://picsum.photos/id/338/200/200'
    },
    city: '西安',
    date: '2026-06-20',
    budget: '499/套',
    description: '大唐不夜城夜景拍摄，含精修9张，底片全送。自带服装，可推荐合作妆娘。拍摄时长约2小时。需要请提前3天预约。',
    style: ['唐风', '夜景', '旅拍'],
    contact: '微信：liuguang_photo',
    createTime: '2026-06-09 20:10',
    viewCount: 689
  },
  {
    id: 'p5',
    role: 'stylist',
    title: '上海·宋制日常妆/发型',
    coverImage: 'https://picsum.photos/id/230/750/500',
    author: {
      id: 'u5',
      name: '绾青丝·妆娘',
      avatar: 'https://picsum.photos/id/91/200/200'
    },
    city: '上海',
    date: '周末可约',
    budget: '288/次',
    description: '擅长宋制清雅妆容与古风发型，可做全盘假发造型。工作室在徐汇区，可预约到店。提供汉服租赁服务（另外收费）。',
    style: ['宋制', '日常妆', '发型'],
    contact: '微信：wanqingsi',
    createTime: '2026-06-08 14:00',
    viewCount: 198
  },
  {
    id: 'p6',
    role: 'model',
    title: '小个子汉服模特·155娇小型',
    coverImage: 'https://picsum.photos/id/1027/750/500',
    author: {
      id: 'u6',
      name: '糖糖·模特',
      avatar: 'https://picsum.photos/id/1027/200/200'
    },
    city: '成都',
    date: '灵活',
    budget: '互勉/300/场',
    description: '身高155，体重42kg，娇小可爱型。擅长明制马面裙、宋制褙子、汉元素。可接淘宝汉服模特、日常约拍。有10+套汉服可供拍摄。',
    style: ['明制', '宋制', '娇小型'],
    contact: '微信：tangtang_model',
    createTime: '2026-06-07 11:30',
    viewCount: 425
  },
  {
    id: 'p7',
    role: 'photographer',
    title: '苏州园林·专业汉服旅拍',
    coverImage: 'https://picsum.photos/id/1018/750/500',
    author: {
      id: 'u7',
      name: '忆江南·摄影师',
      avatar: 'https://picsum.photos/id/1012/200/200'
    },
    city: '苏州',
    date: '全月',
    budget: '599起',
    description: '苏州本地摄影师，熟悉各大园林最佳拍摄点与光线。拙政园、狮子林、留园任选。提供服装、妆造、摄影一条龙服务套餐。',
    style: ['园林', '旅拍', '套餐'],
    contact: '微信：yjn_photo',
    createTime: '2026-06-06 16:40',
    viewCount: 856
  },
  {
    id: 'p8',
    role: 'stylist',
    title: '男妆·魏晋名士/明仕大夫',
    coverImage: 'https://picsum.photos/id/250/750/500',
    author: {
      id: 'u8',
      name: '丹青·妆娘',
      avatar: 'https://picsum.photos/id/64/200/200'
    },
    city: '南京',
    date: '预约制',
    budget: '388/次',
    description: '少见专攻男妆的妆娘，擅长魏晋名士的飘逸感、明代士大夫的儒雅气质。可做简单的古风胡子造型。',
    style: ['魏晋', '明制', '男妆'],
    contact: '微信：danqing_zhuang',
    createTime: '2026-06-05 13:15',
    viewCount: 167
  }
];
