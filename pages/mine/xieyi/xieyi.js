// pages/mine/xieyi/xieyi.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
var WxParse = require("../../../wxParse/wxParse.js");
var article = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:1,
    name:''

  },
  init(){
    wx.request({
      url: config.agreementList_url, //服务协议
      data: {
        status:vm.data.status
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res,'服务协议')
        if (res.data.status == 1) {
          WxParse.wxParse('article', 'html', res.data.dic.content, vm, 5)
          vm.setData({
            name:res.data.dic.name
          })
          wx.setNavigationBarTitle({
            title: vm.data.name,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm=this;
    var status=options.status
    vm.setData({
      status:status
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