// pages/mine/index/index.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    account: {},
    waitCount:0,
    deliveryCount:0,
    finishCount:0


  },
  ziliao() {
    wx.navigateTo({
      url: '/pages/mine/ziliao/ziliao',
    })
  },


  // 订单页面
  order(e) {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请登录/注册',
        icon: "none"
      })
      return
    }
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/order/index/index?status=' + index,
    })
  },
  // 地址列表
  address() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请登录/注册',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: '/pages/mine/address/address'
    })
  },

  // 服务协议
  fuwu() {
    wx.navigateTo({
      url: '/pages/mine/xieyi/xieyi?status=1'
    })
  },
  // 公司简介
  jianjie() {
    wx.navigateTo({
      url: '/pages/mine/xieyi/xieyi?status=2'
    })
  },
  // 意见反馈
  yijian() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请登录/注册',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: '/pages/mine/yijian/yijian'
    })
  },
  // 安全设置
  anquan() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请登录/注册',
        icon: "none"
      })
      return
    }
    wx.navigateTo({
      url: '/pages/mine/account/account'
    })

  },
  login() {
    wx.navigateTo({
      url: '/pages/login/login/login',
    })
  },
  init() {
    wx.request({
      url: config.personData_url, //个人资料
      data: {
        token: vm.data.token,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res,'个人资料')
        if (res.data.status == 1) {
          vm.setData({
            account:res.data.data.account,
            waitCount:res.data.data.waitCount,
            deliveryCount:res.data.data.deliveryCount,
            finishCount:res.data.data.finishCount
          })
        } else {
          
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    var token = wx.getStorageSync('token')
    vm.setData({
      token: token
    })
    vm.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var token = wx.getStorageSync('token')
    vm.setData({
      token: token
    })
    this.init();
    this.cartNum()
  },
  cartNum() {
    app.init()
    setTimeout(() => {
      var cartNum = wx.getStorageSync('cartNum')
      console.log(cartNum)
      if (cartNum > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: "" + cartNum + ""
        })
      }else{
        wx.removeTabBarBadge({
          index: 2,
        });
      }
    }, 200);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})