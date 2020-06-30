var common = require("../../../common.js");
var config = common.getconfig();
var vm = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityId:1,
    list:[]
  },
  zixun(){
    wx.request({
      url: config.activityList_url,
      data: {
        cityId:vm.data.cityId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res)
        if(res.data.status==1){
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          vm.setData({
            list:res.data.activityList
          })
        }
      },
    })
  },

  detail(e){
    // console.log(e)
    wx.navigateTo({
      url: '/pages/index/gonggao/gonggao?id='+e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      vm=this;
      var cityId=wx.getStorageSync('city_id')
      vm.setData({
        cityId:cityId
      })
      vm.zixun();
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
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      list: [],
      pageNo: 1
    })
    this.zixun()
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();

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