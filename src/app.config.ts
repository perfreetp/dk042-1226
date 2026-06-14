export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/calendar/index',
    'pages/square/index',
    'pages/profiles/index',
    'pages/my-activities/index',
    'pages/activity-detail/index',
    'pages/publish/index',
    'pages/profile-detail/index',
    'pages/messages/index',
    'pages/chat/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#8B4557',
    navigationBarTitleText: '同袍有约',
    navigationBarTextStyle: 'white',
    backgroundColor: '#FAF7F2'
  },
  tabBar: {
    color: '#A09383',
    selectedColor: '#8B4557',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/calendar/index',
        text: '活动日历'
      },
      {
        pagePath: 'pages/square/index',
        text: '约拍广场'
      },
      {
        pagePath: 'pages/profiles/index',
        text: '同袍名片'
      },
      {
        pagePath: 'pages/my-activities/index',
        text: '我的报名'
      }
    ]
  }
})
