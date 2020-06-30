var common = require('../../../common.js');
var config = common.getconfig();
var WxParse = require("../../../wxParse/wxParse.js");
var article = "";
var vm = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:''

  },
 
  init(){
    wx.request({
      url: config.activityDetails_url,
      data: {
        id:vm.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "通知详情")
        if (res.data.status == 1) {
           WxParse.wxParse('article', 'html', res.data.activity.content, vm, 5)  
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
  var id=options.id
  console.log(id)
  vm.setData({
    id:id
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