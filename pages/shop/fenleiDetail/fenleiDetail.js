// pages/shop/fenleiDetail/fenleiDetail.js
var common = require("../../../common.js");
var config = common.getconfig();
var vm = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    id: 1,
    token: '',
    prefectureId: 0, //0全部
    status: 0,
    pageNo: 1,
    name: '',
    list: [],
    totalRow: 0,
    search: 0,
    classfyList:[]
  },
  classfyTwo(){
    wx.request({
      url: config.storeGoodsCategoryTwoList_url,
      data: {
        id: vm.data.id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, '二级分类')
        if (res.data.status == 1) {
          vm.setData({
            classfyList: res.data.categoryList,
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
  init() {
    wx.request({
      url: config.classifyDetails_url,
      data: {
        token: vm.data.token,
        id: vm.data.id,
        classTwoId:vm.data.prefectureId,
        status: vm.data.status,
        pageNo: vm.data.pageNo,
        pageSize: 8,
        name: vm.data.name
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, '分类详情')
        setTimeout(function () {
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
        if (res.data.status == 1) {
          vm.setData({
            list: vm.data.list.concat(res.data.page.list),
            totalRow: res.data.page.totalRow
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
  verification(e) {
    var val = e.detail.value
    vm.setData({
      name: val
    })
  },
  search() {
    vm.search1()
  },
  search1(){
    vm.setData({
      list: []
    })
    vm.init()
  },
  searchange() {
    vm.setData({
      search: 1,
      focus: true
    })

  },
  blur(){
    vm.setData({
      search: 0,
      focus: false
    })
  },
  changeOne(e) {
    vm.setData({
      list: [],
      pageNo: 1,
      prefectureId: e.currentTarget.dataset.id
    })
    vm.init();
  },
  changeTwo(e) {
    var idx = e.currentTarget.dataset.idx
    if (idx == 0) {
      vm.setData({
        status: 0
      })
    } else if (idx == 1) {
      if (vm.data.status == 1) {
        vm.setData({
          status: 2
        })
      } else {
        vm.setData({
          status: 1
        })
      }
    } else {
      if (vm.data.status == 3) {
        vm.setData({
          status: 4
        })
      } else {
        vm.setData({
          status: 3
        })
      }
    }
    vm.setData({
      list: [],
      pageNo: 1,
    })
    vm.init();
  },

  // 数量加
  add(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var list = vm.data.list
    for (let i = 0; i < list.length; i++) {
      if (i == index) {
        list[index].goodsnum++;
      }
    }
    vm.setData({
      list: list
    })
  },
  // 数量减
  minus(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var list = vm.data.list
    for (let i = 0; i < list.length; i++) {
      if (i == index) {
        if (list[index].goodsnum > 1) {
          list[index].goodsnum--;
        } else {
          wx.showToast({
            title: '该商品不能减少了~',
            icon: 'none'
          })
        }
      }
    }
    vm.setData({
      list: list
    })
    console.log(vm.data.list)
  },

  // 加入采购单
  addCart(e) {
    var id = e.currentTarget.dataset.id
    var goodsnum = e.currentTarget.dataset.num
    console.log(goodsnum)
    wx.request({
      url: config.cartAdd_url,
      data: {
        token: vm.data.token,
        id: id,
        num: goodsnum
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
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })
  },
  //  商品详情
  detail(e) {

    var id = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    wx.navigateTo({
      url: '/pages/shop/shoDetail/shoDetail?id=' + id + '&num=' + num,
    })
  },
 



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    var id = options.id;
    var name = options.name
    var token = wx.getStorageSync('token')
    vm.setData({
      token: token,
      title: name,
      id: id
    })
    console.log(vm.data.id)
    vm.classfyTwo();
    vm.init();

    wx.setNavigationBarTitle({
      title: vm.data.title,
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
    wx.showLoading({
      title: '数据加载中',
    })
    vm.setData({
      list: [],
      pageNo: 1
    })
    vm.init()
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (vm.data.totalRow == vm.data.list.length) {
      return
    }
    ++vm.data.pageNo;
    vm.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})