// pages/mine/addressAdd/addressAdd.js
var common = require("../../../common.js");
var config = common.getconfig();
var vm = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: "",
    customItem: '',

    token: '',
    name: '',
    mobile: '',
    fullAddress: '',
    addressInfo: '',
    isDefault: 1,
    type: '1'

  },

  user(e) {
    vm.setData({
      name: e.detail.value
    })
  },
  phone(e) {
    vm.setData({
      mobile: e.detail.value
    })
  },
  address(e) {
    vm.setData({
      addressInfo: e.detail.value
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var x = e.detail.value.join("")
    // console.log(x)
    this.setData({
      region: x
    })
  },

 
  switch1Change(e) {
    console.log(e)
    if (e.detail.value) {
      vm.setData({
        isDefault: 0
      })
    } else {
      vm.setData({
        isDefault: 1
      })
    }
    console.log(vm.data.isDefault)
  },

  baocun() {
    // var region=vm.data.region.join("")
    if (vm.data.name == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
      })
      return
    }
    if (vm.data.mobile == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return
    }
    var mobile_res = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[0-9])\d{8}$/;
    if (!mobile_res.test(vm.data.mobile)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
      })
      return;
    }
    if (vm.data.region == '') {
      wx.showToast({
        title: '请选择地区',
        icon: 'none',
      })
      return
    }
    if (vm.data.addressInfo == '') {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
      })
      return
    }
    wx.request({
      url: config.addAddress_url,
      data: {
        token: vm.data.token,
        name: vm.data.name,
        mobile: vm.data.mobile,
        fullAddress: vm.data.region,
        addressInfo: vm.data.addressInfo,
        isDefault: vm.data.isDefault,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          setTimeout(function () {
            let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息
            let prevPage = pages[pages.length - 2];
            prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作
              type: vm.data.type
            })
            prevPage.address();
            wx.navigateBack({
              delta: 1 // 返回上一级页面
            })
          }, 300)
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
          setTimeout(function(){
            wx.navigateBack({
              delta: 1 // 返回上一级页面
            })
          },500)
        }
      },
    });
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    vm = this;
    
    var type = 1;
    if (options) {
      type = options.type
    } else {
      type = 1
    }
    vm.setData({
      token: wx.getStorageSync('token'),
      type: type
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