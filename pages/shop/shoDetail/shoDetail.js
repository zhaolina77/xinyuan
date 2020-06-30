// pages/shop/shoDetail/shoDetail.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
const app = getApp()
var WxParse = require("../../../wxParse/wxParse.js");
var article = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    token: '',
    goodsDetails: {},
    supplier: {},
    content: "",
    cartCount: 0, //购物车数量
    num: 1
  },
  init() {
    wx.request({
      url: config.goodsDetails_url,
      data: {
        id: vm.data.id,
        token: vm.data.token
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "商品详情")
        if (res.data.status == 1) {
          if(res.data.data.goodsDetails.content){
            WxParse.wxParse('article', 'html', res.data.data.goodsDetails.content, vm, 5)
          }
          if(res.data.data.goodsDetails.bar_code){
          
          WxParse.wxParse('article1', 'html', res.data.data.goodsDetails.bar_code, vm, 5)
          }
          vm.setData({
            goodsDetails: res.data.data.goodsDetails,
            supplier: res.data.data.supplier,
            content: res.data.data.goodsDetails.content,
            cartCount: res.data.data.cartCount
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })
  },
  call: function (e) { //联系
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  cart() {
    wx.switchTab({
      url: '/pages/shop/cart/cart',
    })
  },
  // 加入采购单
  addCart() {
    wx.request({
      url: config.cartAdd_url,
      data: {
        token: vm.data.token,
        id: vm.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "加入购物车")
        if (res.data.status == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          vm.init();
          vm.cartNum();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })
  },
  tjOrder() {
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请登录/注册',
        icon: "none"
      })
      return
    }
    console.log(vm.data.num)
    wx.showModal({
      title: '提交订单',
      content: '确定提交订单吗？',
      success(ret) {
        console.log(ret)
        if (ret.confirm) {
          wx.navigateTo({
            url: '/pages/shop/orderQr/orderQr?id=' + vm.data.id + '&num=' + vm.data.num + '&type=3',
          })
        } else if (ret.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    var id = options.id
    var num = options.num
    vm.setData({
      num: num,
    })

    var token = wx.getStorageSync('token')
    vm.setData({
      id: id,
      token: token
    })
    vm.init()
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
    if (wx.getStorageSync('token')) {
      vm.cartNum()
    }
  },
  cartNum() {
    app.init()
    setTimeout(() => {
      var cartNum = wx.getStorageSync('cartNum')
      vm.setData({
        cartCount: cartNum
      })
      console.log(cartNum)

    }, 200);
  },

  address() {
    wx.openLocation({
      latitude: Number(vm.data.supplier.latitude),
      longitude: Number(vm.data.supplier.longitude),
      address: vm.data.supplier.address,
      name: vm.data.supplier.address,
      scale: 18,
    })
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