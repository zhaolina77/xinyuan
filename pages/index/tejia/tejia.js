// pages/index/tejia/tejia.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    supplierList:[],//供应商列表
    totalRow:0,
    pageNo:1,
    id:1,
    search:0,
    val:''

  },
  // 供应商列表
supplierList(){
  wx.request({
    url: config.prefectureSupplierList_url,
    data: {
      id:vm.data.id,
      name:vm.data.val,
      pageNo:vm.data.pageNo,
      pageSize:8
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    success: (res) => {
      console.log(res,"供应商列表")
      setTimeout(function(){
        wx.hideLoading()
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        },1500);
      if (res.data.status == 1) {
       
        vm.setData({
          supplierList:vm.data.supplierList.concat(res.data.page.list),
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
detail(e){
  var id=e.currentTarget.dataset.id
  wx.navigateTo({
    url: '/pages/index/tejiaDetail/tejiaDetail?id='+id,
  })
},
searchange(){
  vm.setData({
    search:1
  })
},

verification: function (e) {
  var val = e.detail.value;
  vm.setData({
    val: val
  })
},
search() {
  vm.search1()
},
search1() {
  console.log()
  vm.setData({
    supplierList:[]
  })
  vm.supplierList()
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm=this;
    var id=options.id
    vm.setData({
      id:id
    })
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
  vm.supplierList()
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(vm.data.totalRow==vm.data.supplierList){
        return
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