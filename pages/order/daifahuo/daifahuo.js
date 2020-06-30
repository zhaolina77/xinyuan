// pages/order/daifahuo/daifahuo.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 5

  },
  init() {
    wx.request({
      url: config.orderDetails_url, //立即购买提交到确认订单页面
      data: {
        id: vm.data.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res)
        if (res.data.status == 1) {
          vm.setData({
            list: res.data.data.goods_list,
            order: res.data.data.order
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
  // 取消订单
  qxOrder() {
    wx.showModal({
      title: '取消订单',
      content: '确定取消该订单吗？',
      success(ret) {
        console.log(ret)
        if (ret.confirm) {
          wx.request({
            url: config.cancelOrder_url,
            data: {
              id: vm.data.id
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            success: (res) => {
              console.log(res)
              if (res.data.status == 1) {
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                })
                let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
                let prevPage = pages[pages.length - 2];
                prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
                  status:4,
                  list: [],
                  pageNo: 1
                })
                prevPage.init();
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1  // 返回上一级页面。
                  })
                }, 500);
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                })
              }
            },
          })
        } else if (ret.cancel) {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    vm = this;
    var id = options.id
    console.log(id)
    vm.setData({
      id: id
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