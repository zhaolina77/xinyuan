var common = require("../../../common.js");
var config = common.getconfig();
var vm = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val: '',
    is_search: 0,
    history: [],
    val: ''
  },
  init: function () {
    var history = wx.getStorageSync("history");
    if (history != "" && history != null) {
      console.log(JSON.parse(history))
      vm.setData({
        history: JSON.parse(history),
        is_search: 1
      })
    } else {
      vm.setData({
        is_search: 0
      })
    }
  },

  search: function (e) {
    var serchArr = []
    var vals = e.detail.value
    if (vals == '') {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }
    vm.jump(vals)
    let jsonStr = {
      name: vals
    };
    wx.getStorage({
      key: 'history',
      success: function (res) {
        console.log(res)
        var serchArr = JSON.parse(res.data);
        console.log(serchArr)
        for (let index = 0; index < serchArr.length; index++) {
          console.log(serchArr[index].name == vals)
          if (serchArr[index].name == vals) {
            return
          }
        }
        serchArr.push(jsonStr)
          console.log(JSON.stringify(serchArr))
          wx.setStorage({
            data: JSON.stringify(serchArr),
            key: 'history',
          })
      },
      fail: function () {
        serchArr.push(jsonStr);
        wx.setStorage({
          data: JSON.stringify(serchArr),
          key: 'history',
        })
      }
    })
  },
  jump(vals) {
    wx.navigateTo({
      url: '/pages/shop/shop/shop?name=' + vals+'&type=1',
    })
  },
  search1(){

    if (vm.data.val == '') {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: '/pages/shop/shop/shop?name=' + vm.data.val+'&type=1',
    })


  },
  jup(e){
    var vals=e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/shop/shop/shop?name=' + vals+'&type=1',
    })

  },
  verification(e) {
    var vals = e.detail.value
    vm.setData({
      val: vals
    })
  },
  close() {
    wx.showModal({
      title: '删除',
      content: '确认删除历史记录？',
      success(res) {
        if (res.confirm) {
          wx.removeStorageSync('history')
          vm.init();
        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
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
    this.init()

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