const app = getApp()

Page({
  data: {
    user: {},
    todos: []
  },

  onLoad() {
    this.setData({ user: app.globalData.user })
    this.loadTodos()
  },

  onShow() {
    // 从其他页面返回时同步最新数据（技能币可能已扣减）
    this.setData({ user: app.globalData.user })
  },

  // 今日待办 —— 留存抓手：让用户每天有理由打开小程序
  loadTodos() {
    this.setData({
      todos: [
        { id: 't1', text: '与「小林」的互试课：吉他弹唱', time: '今天 19:00 · 待开始', done: false },
        { id: 't2', text: '确认「阿哲」的互换申请', time: '对方等了你 6 小时', done: false },
        { id: 't3', text: '完成摄影构图第 2 次课', time: '已完成', done: true }
      ]
    })
  },

  goMatch() {
    wx.navigateTo({ url: '/pages/match/match' })
  },

  onTodoTap(e) {
    const id = e.currentTarget.dataset.id
    if (id === 't1') {
      wx.showToast({ title: '互试课提醒已设定', icon: 'none' })
    } else if (id === 't2') {
      wx.showModal({
        title: '确认互换申请',
        content: '对方想用「视频剪辑」交换你的「吉他弹唱」，确认后进入互试课环节。',
        confirmText: '确认',
        success: res => {
          if (res.confirm) {
            wx.showToast({ title: '已确认', icon: 'success' })
          }
        }
      })
    } else {
      wx.showToast({ title: '这次课已完成', icon: 'none' })
    }
  },

  // 订阅消息 —— 必须在点击行为中调用
  onSubscribe() {
    app.requestSubscribe(['trialRemind', 'confirmRemind'], res => {
      if (res.configured && res.accepted) {
        console.log('用户已订阅模板：', res.accepted)
      }
    })
  }
})
