var common = require("../../../common.js");
var config = common.getconfig();
var vm = null;
const app = getApp()
Page({


  data: {
    canIuse: wx.canIUse('button.open-type.getUserInfo'),
    open: "true",
    pid: '0'
  },

  bindGetUserInfo: function (e) {
    console.log(JSON.stringify(e));
    wx.showLoading({
      title: '加载中...',
    })
    if (e.detail.userInfo) {
      wx.getUserInfo({
        success: function (ret) {
          console.log(ret);
          wx.login({
            success: function (res) {
              console.log(res)
              if (res.code) {
                wx.request({
                  url: config.authorization_url,
                  data: {
                    "js_code": res.code,
                    "rawData": ret.rawData,
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: "POST",
                  success: function (info) {
                    console.log(info);
                    if (info.data.data.token == '') {
                      wx.showToast({
                        title: '登录失败',
                        icon: 'none',
                        duration: 1500
                      })
                    } else {
                      if (info.data.data.is_phone == 0) {
                        
                        wx.navigateTo({
                          url: '/pages/login/userinfo/userinfo?token='+info.data.data.token,
                        })
                      }else{
                        wx.setStorageSync('token', info.data.data.token)
                        wx.navigateBack({
                          delta: 1,
                        })
                      }
                    }

                  }
                })
              }

            }

          })

        }
      })


    } else {
      wx.hideLoading()
      console.log('拒绝');
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
            vm.setData({
              open: false
            })
          }
        }
      })

    }

  },

  onLoad: function (options) {
    vm = this;
    vm.setData({
      pid: options.pid != undefined ? options.pid : 0
    })
  },
})