// pages/shop/cart/cart.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 160,
    list: [],
    token: '',
    pageNo: 1,
    totalPrice: '',
    tag: 0,
    cartIds: []
  },
  init() {
    wx.request({
      url: config.cartList_url,
      data: {
        token: vm.data.token,
        // pageNo: vm.data.pageNo,
        // pageSize: 8
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "采购单列表")
        if (res.data.status == 1) {
          setTimeout(function () {
            wx.hideLoading()
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
          }, 1500);
          var cartIds = []
          vm.setData({
            list: res.data.data.validGoodsList,
            totalPrice: res.data.data.totalPrice,
            tag: res.data.data.tag
          })
          for (let i = 0; i < vm.data.list.length; i++) {
            if (vm.data.list[i].is_select == 1) {
              cartIds.push(vm.data.list[i].cart_id)
            }
          }
          vm.setData({
            cartIds: cartIds
          })
          // console.log(vm.data.cartIds)

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })
  },
  //   采购单添加数量
  add(e) {
    var id = e.currentTarget.dataset.id
    wx.request({
      url: config.addToCart_url,
      data: {
        token: vm.data.token,
        cartId: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "采购单加数量")
        if (res.data.status == 1) {
          vm.init();
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
  //   采购单减数量
  minus(e) {
    var id = e.currentTarget.dataset.id
    // console.log(id)
    wx.request({
      url: config.minusToCart_url,
      data: {
        token: vm.data.token,
        cartId: id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "采购单减数量")
        if (res.data.status == 1) {
          vm.init();
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
  // 单选与取消单选
  selectBox(e) {
    var id = e.currentTarget.dataset.id
    var idx = e.currentTarget.dataset.idx
    var list = vm.data.list
    var isSelect = null
    if (list[idx].is_select == 1) {
      list[idx].is_select = 0
    } else {
      list[idx].is_select = 1
    }
    vm.setData({
      list: list,
    })
    isSelect = vm.data.list[idx].is_select
    console.log(vm.data.list[idx].is_select)
    wx.request({
      url: config.checkOneCart_url,
      data: {
        token: vm.data.token,
        cartId: id,
        isSelect: isSelect
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "单选和取消勾选")
        if (res.data.status == 1) {
          vm.init();

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })
  },
  // 全选与全不选
  allCheck() {
    var tag = vm.data.tag
    if (tag == 1) {
      vm.setData({
        tag: 0
      })
    } else {
      vm.setData({
        tag: 1
      })
    }
    wx.request({
      url: config.selectCart_url,
      data: {
        token: vm.data.token,
        tag: vm.data.tag
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {
        console.log(res, "全选")
        if (res.data.status == 1) {
          vm.init();
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      },
    })

  },
  // 删除购物车
  del(e) {
    var cartId = ''
    var id = []
    // id=id.push(e.currentTarget.dataset.id)
    var status = e.currentTarget.dataset.status
    if (status == 1) {
      cartId = vm.data.cartIds.join(",")
    } else {
      // cartId=id.join(",")
    }
    console.log(vm.data.cartIds.length < 1)
    if (vm.data.cartIds.length < 1) {
      wx.showToast({
        title: "请选择要删除的商品",
        icon: "none"
      })
      return
    }
    wx.showModal({
      title: '删除采购单',
      content: '确认删除所选商品吗？',
      success(ret) {
        console.log(ret)
        if (ret.confirm) {
          wx.request({
            url: config.cartDelete_url,
            data: {
              token: vm.data.token,
              cartId: cartId
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
                setTimeout(() => {
                  vm.cartNum();
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
        } else if (ret.cancel) {}
      }
    })

  },
  detail(e) {
    var id = e.currentTarget.dataset.id

    wx.navigateTo({
      url: '/pages/shop/shoDetail/shoDetail?id=' + id,
    })


  },
  tjOrder() {
    var k=0;
    for (let index = 0; index < vm.data.list.length; index++) {
      if (vm.data.list[index].is_select == 0) {
          k++;
      }
    }
    if(k==vm.data.list.length){
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
      })
      return
    }
    wx.showModal({
      title: '提交订单',
      content: '确定提交订单吗？',
      success(ret) {
        console.log(ret)
        if (ret.confirm) {
          console.log(vm.data.cartIds)
          wx.navigateTo({
            url: '/pages/shop/orderQr/orderQr?cartId=' + vm.data.cartIds + '&type=1',
          })
        } else if (ret.cancel) {

        }
      }
    })
  },
  onLoad: function (options) {
   

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
    vm = this;
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请登录/注册',
        icon: "none"
      })
      return
    }

    var token = wx.getStorageSync('token')
    vm.setData({
      token: token
    })
    vm.init();
    vm.cartNum();
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
      } else {
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
    vm.init()
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