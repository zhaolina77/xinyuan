// pages/index/tejiaDetail/tejiaDetail.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1,//供应商id
    categoryList:[],
    supplier:{},
    list:[],//商品列表
    classfyList:[],
    show:0,
    classifyId:-1,//一级分类
    pageNo:1,
    totalRow:0,
    name:'',
    search:0,
    token:'',
    lat:'',
    lon:'',
    tab_list: [{
      "pagePath": "pages/index/index/index",
      "text": "首页",
      "iconPath": "/image/index-off.png",
      "selectedIconPath": "/image/index-on.png",
      dot: false
    },
    {
      "pagePath": "pages/shop/index/index",
      "text": "供应商",
      "iconPath": "/image/shop-off.png",
      "selectedIconPath": "/image/shop-on.png",
      dot: false
    },
    {
      "pagePath": "pages/shop/cart/cart",
      "text": "采购单",
      "iconPath": "/image/cart-off.png",
      "selectedIconPath": "/image/cart-on.png",
      badge: '1'
    },
    {
      "pagePath": "pages/mine/index/index",
      "text": "我",
      "iconPath": "/image/mine-off.png",
      "selectedIconPath": "/image/mine-on.png",
      dot: false
    }
  ]
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
    console.log(vm.data.id,e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/shop/shangjia/shangjia?classifyId='+e.currentTarget.dataset.id+'&id='+vm.data.id,
    })
  },
  verification(e){
    var val=e.detail.value
    vm.setData({
      name:val
    })
},
foc(){
  vm.setData({
    show:0,
  })
},
searchange(){
  vm.setData({
    search:1,
    focus:true
  })

},

search(){
  vm.search1();
},
  search1(){
    vm.setData({
      list: []
    })
    vm.list()
  },
  classfy(e){
    var id=e.currentTarget.dataset.id
    vm.setData({
      classfyList:[],
      pageNo:1,
      classifyId:id
    })
    vm.classfyTwo()

  },
  init(){
    wx.request({
      url: config.supplierDetails_url,
      data: {
        id:vm.data.id,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res,"供应商详情")
        if (res.data.status == 1) {
          vm.setData({
            categoryList:res.data.data.categoryList,
            supplier:res.data.data.supplier,
            lat:res.data.data.supplier.latitude,
            lon:res.data.data.supplier.longitude,
          })
          if(vm.data.categoryList.length>0){
            vm.setData({
              classifyId:res.data.data.categoryList[0].id
            })
          }
          vm.classfyTwo()
          // vm.list()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })
  },
  listShow(){
    if(vm.data.show==1){
      vm.setData({
        show:0
      })
    }else{
      vm.setData({
        show:1
      })
    }
  },
  list(){

    wx.request({
      url: config.supplierCategoryGoodsList_url,
      data: {
        id:vm.data.id,
        classifyId:vm.data.classifyId,
        pageNo:vm.data.pageNo,
        pageSize:8,
        name:vm.data.name
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        setTimeout(function(){
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          },1500);
        console.log(res,"供应商商品列表")
        if (res.data.status == 1) {
          var list=res.data.page.list
          
          vm.setData({
            list:vm.data.list.concat(list),
            totalRow:res.data.page.totalRow
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
  call:function(e){  //联系
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })
  },
  detail(e){
   
    var id=e.currentTarget.dataset.id
    var goodsnum=e.currentTarget.dataset.num
    wx.navigateTo({
      url: '/pages/shop/shoDetail/shoDetail?id='+id+'&num='+goodsnum,
    })
  },


 

 

  // 加入采购单
  addCart(e){
    
    var id=e.currentTarget.dataset.id
    var goodsnum = e.currentTarget.dataset.num
    wx.request({
      url: config.cartAdd_url,
      data: {
        token:vm.data.token,
        id:id,
        num:goodsnum
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res,"加入购物车")
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
  },
  address(){
    wx.openLocation({
      latitude:Number(vm.data.supplier.latitude),
      longitude:Number(vm.data.supplier.longitude),
      address:vm.data.supplier.address,
      name: vm.data.supplier.address,
      scale: 18,
    })
  },
  tabChange(e) {
    console.log(e)
    var idx=e.detail.index
    console.log(idx)
    if(idx==0){
      wx.switchTab({
        url: '/pages/index/index/index',
      })
    }else if(idx==2){
      wx.switchTab({
        url: '/pages/shop/cart/cart',
      })
    }else if(idx==3){
      wx.switchTab({
        url: '/pages/mine/index/index',
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm=this;

    var id=options.id
    var token=wx.getStorageSync('token')
    vm.setData({
      id:id,
      token:token
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
    if(wx.getStorageSync('token')){
      this.cartNum()
    }
    
    

  },
  cartNum() {
    app.init()
    setTimeout(() => {
      var cartNum = wx.getStorageSync('cartNum')
      console.log(cartNum)
      var lis=this.data.tab_list
      if (cartNum > 0) {
        for (let index = 0; index < lis.length; index++) {
          lis[2].badge="" + cartNum + ""
        }
        this.setData({
          tab_list:lis
        })
      }else{
        for (let index = 0; index < lis.length; index++) {
          lis[2].badge=false
        }
        this.setData({
          tab_list:lis
        })
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
  vm.list()
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