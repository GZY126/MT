// app.js —— 技能环小程序端
// 说明：本雏形用本地缓存模拟数据，真实版本将 user / match 替换为后端接口即可。

App({
  globalData: {
    // 当前用户（本地模拟；真机接入后端后由 wx.login 换取）
    user: {
      nickname: '小环',
      credit: 4.8,                                  // 双向信用分
      coins: 3,                                     // 技能币余额
      taught: 2,                                    // 已教次数
      learned: 1,                                   // 已学次数
      canTeach: ['吉他弹唱', '摄影构图'],            // 我能教
      wantLearn: ['Python 入门', '视频剪辑']         // 我想学
    },
    // 订阅消息模板 ID
    // ⚠️ 必须替换：到 微信公众平台 → 功能 → 订阅消息 申请模板后填入
    // 未替换时点击订阅会提示配置，不会静默失败
    templates: {
      trialRemind: 'REPLACE_WITH_YOUR_TMPL_ID',    // 互试课开始提醒
      confirmRemind: 'REPLACE_WITH_YOUR_TMPL_ID'   // 对方确认 / 履约提醒
    }
  },

  onLaunch() {
    const cached = wx.getStorageSync('skillloop_user')
    if (cached) {
      Object.assign(this.globalData.user, cached)
    }
  },

  // 把用户状态写回本地缓存（雏形阶段的"持久化"）
  saveUser() {
    wx.setStorageSync('skillloop_user', this.globalData.user)
  },

  /**
   * 订阅消息（留存关键能力）
   * 注意：wx.requestSubscribeMessage 必须在用户点击行为中调用，不能自动触发。
   * @param {string[]} keys globalData.templates 中的键名
   * @param {function} cb 结果回调
   */
  requestSubscribe(keys, cb) {
    const tpl = this.globalData.templates
    const ids = keys.map(k => tpl[k]).filter(Boolean)

    if (ids.length === 0 || ids.some(id => id.indexOf('REPLACE') === 0)) {
      wx.showModal({
        title: '模板 ID 待配置',
        content: '订阅消息模板需在微信公众平台申请后填入 app.js 的 templates 字段。' +
                 '本雏形已保留完整调用逻辑，配置后即可生效。',
        showCancel: false,
        confirmText: '知道了'
      })
      if (cb) cb({ configured: false })
      return
    }

    wx.requestSubscribeMessage({
      tmplIds: ids,
      success: res => {
        const accepted = Object.keys(res).filter(k => res[k] === 'accept')
        wx.showToast({
          title: accepted.length ? '提醒已开启' : '你拒绝了订阅',
          icon: accepted.length ? 'success' : 'none'
        })
        if (cb) cb({ configured: true, accepted, raw: res })
      },
      fail: err => {
        wx.showToast({ title: '订阅失败', icon: 'none' })
        if (cb) cb({ configured: true, error: err })
      }
    })
  }
})
