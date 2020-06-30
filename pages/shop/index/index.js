// pages/shop/index/index.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],
    supplier: {},
    list: [], //商品列表
    classfyList:[],
    show: 0,
    classifyId: 1,
    pageNo: 1,
    totalRow: 0,
    name: '',
    search:0,
    token: '',
    type:0,
    focus:''

  },
  classfyTwo(){
    wx.request({
      url: config.storeGoodsCategoryTwoList_url,//二级分类
      data: {
        id: vm.data.classifyId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, '二级分类')
        setTimeout(function () {
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
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
  shopDetail(e){
    wx.navigateTo({
      url: '/pages/shop/shop/shop?classifyId='+vm.data.classifyId+'&id='+e.currentTarget.dataset.id,
    })
  },
  changeOne(e) {
    var id = e.currentTarget.dataset.id
    vm.setData({
      classfyList:[],
      pageNo:1,
      classifyId: id
    })
    vm.classfyTwo();
    // vm.list()

  },

  init() {
    wx.request({
      url: config.supplierDetails_url,
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "供应商详情")
        if (res.data.status == 1) {
          vm.setData({
            categoryList:res.data.data.categoryList,
          })
          if(vm.data.categoryList.length>0){
            vm.setData({
              classifyId:res.data.data.categoryList[0].id
            })
          }
          vm.classfyTwo();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })
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
        num:goodsnum
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
  //  商品详情
  detail(e) {
    var id = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    console.log(num)
    wx.navigateTo({
      url: '/pages/shop/shoDetail/shoDetail?id='+ id+'&num='+num,
    })
  },
// 数量加
  add(e){
    var id=e.currentTarget.dataset.id
    var index=e.currentTarget.dataset.index
    var list=vm.data.list
    for (let i = 0; i < list.length; i++) {
      if(i==index){
        list[index].goodsnum++;
      }
    }
    vm.setData({
      list:list
    })
    console.log(vm.data.list)
  },
  // 数量减
  minus(e){
    var id=e.currentTarget.dataset.id
    var index=e.currentTarget.dataset.index
    var list=vm.data.list
    for (let i = 0; i < list.length; i++) {
      if(i==index){
        if(list[index].goodsnum>1){
          list[index].goodsnum--;
        }else{
          wx.showToast({
            title: '该商品不能减少了~',
            icon:'none'
          })
        }
      }
    }
    vm.setData({
      list:list
    })
    console.log(vm.data.list)
  },
  search() {
    wx.navigateTo({
      url:'/pages/search/searchJl/searchJl'
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    vm.init();
    
    
    // vm.list();
    

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var token = wx.getStorageSync('token')
    this.setData({
      token: token,
    })
    this.cartNum()
   
  },
  cartNum(){
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
      list: [],
      pageNo: 1
    })
    vm.classfyTwo();
  // vm.list()
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