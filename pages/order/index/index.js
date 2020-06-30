// pages/order/index/index.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    pageNo:1,
    status:-1,//-1:全部 1:待发货 2:配送中 3:已完成 4:已取消 5:已关闭
    list:[],
    totalRow:0,
    goods_order_list:[]
  },
  change(e){
    var status=e.currentTarget.dataset.idx
    vm.setData({
      list:[],
      pageNo:1,
      status:status
    })
    vm.init();
  },
  init(){
    wx.request({
      url: config.storeOrderList_url, 
      data: {
        status:vm.data.status,
        token:vm.data.token,
        pageNo:vm.data.pageNo,
        pageSize:8
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        setTimeout(() => {
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
        console.log(res,'订单列表')
        if (res.data.status == 1) {
          vm.setData({
            list:vm.data.list.concat(res.data.page.list),
            totalRow:res.data.page.totalRow
          })
          // var list=vm.data.list
          // var lis=[]
          // for(var i=0;i<list.length;i++){
          //   if(list[i].goods_order_list.length>3){
          //       for (let index = 0; index < 3; index++) {
          //         lis.push(list[i].goods_order_list[index])
          //       }
          //       list[i].goods_order_list=lis
          //       console.log(list[i].goods_order_list)
          //   }
          // }
          // console.log(list)
          // vm.setData({
          //   list:list
          // })
          
          
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      },
    })
  },
  // 取消订单
  qxOrder(e){
    var id=e.currentTarget.dataset.id
    wx.showModal({
      title: '取消订单',
      content: '确定取消该订单吗？',
      success(ret) {
        console.log(ret)
        if (ret.confirm) {
          wx.request({
            url: config.cancelOrder_url,
            data: {
              id:id
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
                vm.setData({
                  status:4,
                  list:[],
                  pageNo:1,
                })
                setTimeout(() => {
                  vm.init()
                }, 500);
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                })
              }
            },
          })
        } else if (ret.cancel) {
        }
      }
    })
  },

   // 删除订单
   delete(e){
    var id=e.currentTarget.dataset.id
    wx.showModal({
      title: '删除订单',
      content: '确定删除该订单吗？',
      success(ret) {
        console.log(ret)
        if (ret.confirm) {
          wx.request({
            url: config.delOrder_url,
            data: {
              id:id
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
                vm.setData({
                  status:-1,
                  list:[],
                  pageNo:1,
                })
                setTimeout(() => {
                  vm.init()
                }, 500);
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                })
              }
            },
          })
        } else if (ret.cancel) {
          
        }
      }
    })
  },
   // 确认收货
   qrOrder(e){
    var id=e.currentTarget.dataset.id
    wx.showModal({
      title: '确认收货',
      content: '确定要确认收货吗？',
      success(ret) {
        console.log(ret)
        if (ret.confirm) {
          wx.request({
            url: config.confirmReceipt_url,
            data: {
              id:id
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
                vm.setData({
                  status:3,
                  list:[],
                  pageNo:1,
                })
                setTimeout(() => {
                  vm.init()
                }, 500);
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: "none"
                })
              }
            },
          })
        } else if (ret.cancel) {
        }
      }
    })
  },

  // 订单详情
  detail(e){
    var id=e.currentTarget.dataset.id
    var status=e.currentTarget.dataset.status
    console.log(status)
    if(status==1){
      wx.navigateTo({
        url: '/pages/order/daifahuo/daifahuo?id='+id,
      })
    }else if(status==2){
      wx.navigateTo({
        url: '/pages/order/peisong/peisong?id='+id,
      })
    }else if(status==3){
      wx.navigateTo({
        url: '/pages/order/wancheng/wancheng?id='+id,
      })
    }else if(status==4){
      wx.navigateTo({
        url: '/pages/order/quxiao/quxiao?id='+id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/order/guanbi/guanbi?id='+id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm=this;
    var token = wx.getStorageSync('token')
    var status=options.status
    var type = options.type
    vm.setData({
      token: token,
      // status:status,
      type: type
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
    if(vm.data.totalRow==vm.data.list.length){
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