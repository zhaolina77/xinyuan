// pages/mine/userinfo/userinfo.js
var common = require("../../../common.js");
var WXBizDataCrypt = require('../../../utils/RdWXBizDataCrypt.js');
var config = common.getconfig();
var vm = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    appid: 'wxddbc8102b3c2821d',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    var token=options.token
    vm.setData({
      token:token
    })
  },
  getPhoneNumber(e) {
    console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:fail user deny") return;
    wx.showLoading()
    var vm = this;
    wx.login({
      success: (res) => {
        console.log(res,'获取手机号')
        wx.request({
          url: config.biography_url,
          data: {
            js_code: res.code
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          success: (ret) => {
            console.log(ret)
            var pc = new WXBizDataCrypt(vm.data.appid,ret.data.data.info);
            var data = pc.decryptData(e.detail.encryptedData,e.detail.iv);
            var phone = data.phoneNumber;
            console.log(phone);

            wx.request({
              url: config.binding_phone_url,
              data: {
                phone: phone,
                token: vm.data.token
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: (result) => {
                console.log(result)
                if (result.data.status == 1) {
                  wx.showToast({
                    title: result.data.msg,
                    icon: 'none',
                  })
                  wx.setStorageSync('token', vm.data.token)
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 2 // 返回上一级页面。
                    })
                  }, 500)
                } else {
                  wx.showToast({
                    title: result.data.msg,
                    icon: 'none',
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1 // 返回上一级页面。
                    })
                  }, 500)
                }

              },
            })
          },
        })
      },
    })






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