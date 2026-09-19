const app = getApp()

Page({
  data: {
    user: {},
    settings: [
      { key: 'trialRemind', name: '互试课提醒', desc: '课程开始前 30 分钟通过服务通知提醒' },
      { key: 'confirmRemind', name: '确认与履约提醒', desc: '对方确认、打卡节点、被鸽预警' }
    ]
  },

  onShow() {
    this.setData({ user: app.globalData.user })
  },

  onToggle(e) {
    const key = e.currentTarget.dataset.key
    app.requestSubscribe([key])
  }
})
