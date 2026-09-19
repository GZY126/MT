const app = getApp()

// 六阶段履约链路（与网页端设计一致）
const STEPS = ['破冰', '互试课', '定计划', '履约跟踪', '完成结算', '身份转化']

Page({
  data: {
    steps: STEPS,
    ongoing: [
      {
        id: 'e1',
        title: '吉他弹唱 ⇄ Python 入门',
        partner: '小林',
        credit: 4.9,
        stage: 3,
        stageText: '第 4 / 6 阶段',
        next: '今天 19:00 互试课'
      }
    ],
    pending: [
      { id: 'p1', title: '阿哲 想用「视频剪辑」换你的「摄影构图」', desc: '等待你确认 · 已等待 6 小时' },
      { id: 'p2', title: '小晶 邀请你加入技能环', desc: '三人循环：你教摄影 → 小晶教 PPT → 阿哲教你剪辑' }
    ],
    done: [
      { id: 'd1', title: 'PPT 设计 ⇄ 摄影构图', date: '2026-08-30', result: '双方互评 5.0 分' }
    ]
  },

  onRemind(e) {
    // 真实版本由服务端调 subscribeMessage.send 下发
    app.requestSubscribe(['trialRemind'], () => {
      wx.showToast({ title: '提醒已发送', icon: 'success' })
    })
  },

  onCheckin(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.ongoing.map(it => {
      if (it.id !== id) return it
      const stage = Math.min(STEPS.length - 1, it.stage + 1)
      return Object.assign({}, it, {
        stage,
        stageText: '第 ' + (stage + 1) + ' / 6 阶段'
      })
    })
    this.setData({ ongoing: list })
    wx.showToast({ title: '打卡成功', icon: 'success' })

    // 第 6 阶段：身份转化 —— 学会的技能进入「我能教」
    const cur = list.find(it => it.id === id)
    if (cur && cur.stage === 5) {
      const user = app.globalData.user
      if (user.wantLearn.length) {
        const learned = user.wantLearn.shift()
        user.canTeach.push(learned)
        user.coins += 2
        app.saveUser()
        wx.showModal({
          title: '身份转化完成',
          content: '你已掌握「' + learned + '」，它已加入你的「我能教」清单，' +
                   '同时获得 2 枚技能币。这就是增长飞轮：学员变成老师，供给池扩大。',
          showCancel: false,
          confirmText: '知道了'
        })
      }
    }
  },

  onAccept(e) {
    wx.showModal({
      title: '确认参与',
      content: '确认后将进入破冰阶段，双方可先聊聊彼此想学的内容。',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          wx.showToast({ title: '已进入破冰阶段', icon: 'success' })
        }
      }
    })
  }
})
