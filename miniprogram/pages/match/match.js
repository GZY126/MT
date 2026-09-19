const app = getApp()

// 三层匹配策略演示数据
const LAYERS = [
  {
    level: 'L1',
    name: '精准互匹',
    desc: '对方能教的正好是你想学的，你能教的也正好是 TA 想学的 —— 双边完美互补。',
    partner: { initial: '林', name: '小林', credit: 4.9, teach: 'Python 入门', learn: '吉他弹唱' }
  },
  {
    level: 'L2',
    name: '技能币匹配',
    desc: '不要求双边互补。你教 TA 赚技能币，再用技能币去学别人 —— 把双边易货降级为多边交易。',
    partner: { initial: '哲', name: '阿哲', credit: 4.7, teach: '视频剪辑', learn: '摄影构图' }
  },
  {
    level: 'L3',
    name: '技能环撮合',
    desc: '冷启动兜底：A 教 B、B 教 C、C 教 A，三人成环，不需要任何两人直接互补。',
    partner: { initial: '晶', name: '小晶', credit: 4.6, teach: 'PPT 设计', learn: '摄影构图' }
  }
]

Page({
  data: {
    step: 0,
    layers: [],
    statusText: '',
    finished: false,
    coinsUsed: 0,
    user: {}
  },

  onLoad() {
    this.setData({ user: app.globalData.user })
  },

  startMatch() {
    this.setData({ step: 1, layers: [], finished: false, coinsUsed: 0 })
    this.runLayer(0)
  },

  // 依次"跑"三层匹配：L1 未命中 → 降级 L2 → 命中
  runLayer(i) {
    if (i >= LAYERS.length) {
      this.setData({ statusText: '匹配完成', finished: true })
      return
    }

    const cur = LAYERS[i]
    this.setData({ statusText: '正在执行 ' + cur.level + ' · ' + cur.name + '…' })

    setTimeout(() => {
      const isHit = i === 1          // 演示：L1 未命中，L2 命中
      const item = Object.assign({}, cur, {
        state: isHit ? 'hit' : 'miss',
        stateText: isHit ? '命中' : '未命中',
        matched: isHit
      })

      const layers = this.data.layers.concat([item])
      this.setData({ layers })

      if (isHit) {
        // L2 命中：演示技能币扣减（3 → 1）
        const user = app.globalData.user
        user.coins = Math.max(0, user.coins - 2)
        app.saveUser()
        this.setData({ user, coinsUsed: 2 })
        setTimeout(() => {
          this.setData({ statusText: '匹配完成', finished: true })
        }, 600)
      } else {
        this.runLayer(i + 1)
      }
    }, 700)
  },

  goExchange() {
    wx.switchTab({ url: '/pages/exchange/exchange' })
  },

  reset() {
    this.setData({ step: 0, layers: [], finished: false, coinsUsed: 0, statusText: '' })
  }
})
