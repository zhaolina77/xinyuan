// pages/index/index/index.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//banner列表
    categoryList: [], //首页分类
    prList: [], //专区列表
    supplierList: [], //首页供应商列表
    activityList:[],//通知列表
    totalRow: 0,
    pageNo: 1,
    show: 1,
    // search:0,
    val: '',
    id: -2,
  },

  bannerJump(e){
    
    var id=e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/shop/shoDetail/shoDetail?id='+id,
    })
  },
  zx_detail(e){
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/gonggaoList/gonggaoList?id='+id,
    })

  },


  init() {
    wx.request({
      url: config.storeGoodsCategoryList_url,
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "首页分类")
        if (res.data.status == 1) {
          vm.setData({
            categoryList: res.data.categoryList
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })
    wx.request({
      url: config.bannerList_url,
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "banner列表")
        if (res.data.status == 1) {
          vm.setData({
            bannerList: res.data.bannerList
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })

   


    wx.request({
      url: config.activityList_url,
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "通知列表")
        if (res.data.status == 1) {
          vm.setData({
            activityList: res.data.activityList
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })

    wx.request({
      url: config.prefectureList_url,
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "专区列表")
        if (res.data.status == 1) {
          vm.setData({
            prList: res.data.prList
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

  // 首页供应商列表
  supplierList() {
    wx.request({
      url: config.supplierList_url,
      data: {
        pageNo: vm.data.pageNo,
        pageSize: 8
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "首页供应商列表")
        setTimeout(function () {
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
        if (res.data.status == 1) {
          vm.setData({
            supplierList: vm.data.supplierList.concat(res.data.page.list),
            totalRow: res.data.page.totalRow
          })
          var list = vm.data.supplierList
          for (var i = 0; i < list.length; i++) {
            list[i].shows = 0
            list[i].idx = i
          }
          vm.setData({
            supplierList: list
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
  listShow(e) {
    var idx = e.currentTarget.dataset.idx
    console.log(idx)
    var list = vm.data.supplierList
    for (var i = 0; i < list.length; i++) {
      if (idx == i) {
        if (list[idx].shows == 0) {
          list[idx].shows = 1
        } else {
          list[idx].shows = 0
          console.log(list[idx].shows)
        }
      }
    }
    // console.log(list)
    vm.setData({
      supplierList: list
    })
  },

  fenlei(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var name=e.currentTarget.dataset.name
    if (index == 0 || index == 1) {
      wx.navigateTo({
        url: '/pages/index/zhuanquList/zhuanquList?id=' + id+'&name='+name,
      })
    } else {
      if (!wx.getStorageSync('token')) {
        wx.navigateTo({
          url: '/pages/login/login/login',
        })
        return
      }
      wx.navigateTo({
        url: '/pages/shop/chgList/chgList',
      })
    }

  },
  detail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/tejiaDetail/tejiaDetail?id=' + id,
    })
  },

  search() {
    wx.navigateTo({
      url:'/pages/search/searchJl/searchJl'
    })
  },
  zhuanqu(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '/pages/shop/fenleiDetail/fenleiDetail?id=' + id + "&name=" + name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    vm.init()
    vm.supplierList();

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
    if(wx.getStorageSync('token')){
      this.cartNum()
    }
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
    wx.showLoading({
      title: '数据加载中',
    })
    vm.setData({
      supplierList: [],
      pageNo: 1
    })
    vm.init();
    vm.supplierList()
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (vm.data.totalRow == vm.data.supplierList.length) {
      return;
    }
    ++vm.data.pageNo;
    vm.supplierList();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})