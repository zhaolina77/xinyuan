//app.js
var common = require('common.js');
var config = common.getconfig();

App({
  onLaunch: function () {
    var vm = this;
    console.log(common)
    if (!wx.getStorageSync('token')) {
      vm.init()
    }



    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  init:function (){
    if(!wx.getStorageSync('token')){
      wx.setStorageSync('cartNum', 0)
    }
    var vm=this;
    wx.request({
      url: config.cartNum_url,
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "采购单数量")
        if (res.data.status == 1) {
          // vm.globalData.cartNum = res.data.count
          wx.setStorageSync('cartNum', res.data.count)
        }
      },
    })
  },
  
  globalData: {
    userInfo: null,
    cartNum: 0,
    search:0
  }
})