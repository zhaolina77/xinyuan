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
    tag: 0,
    cartIds: [],
    cartNum: 0
  },

  //   常购清单列表
  init() {
    wx.request({
      url: config.keepCartList_url,
      data: {
        token: vm.data.token,
        pageNo: vm.data.pageNo,
        pageSize: 8
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: (res) => {

        setTimeout(function () {
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }, 1500);
        console.log(res, "常购清单列表")
        if (res.data.status == 1) {
          var cartIds = []
          vm.setData({
            list: res.data.data.validGoodsList,
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
      url: config.checkOneKeepCart_url,
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
      url: config.selectKeepCart_url,
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

  //   采购单添加数量
  add(e) {
    var id = e.currentTarget.dataset.id
    wx.request({
      url: config.addToKeepCart_url,
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
      url: config.minusToKeepCart_url,
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
            url: config.keepCartDelete_url,
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
          wx.showToast({
            title: "取消删除",
            icon: "none"
          })
        }
      }
    })
  },
  //  商品详情
  detail(e) {
    var id = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    console.log(num)
    wx.navigateTo({
      url: '/pages/shop/shoDetail/shoDetail?id=' + id + '&num=' + num,
    })
  },
  // 购物车
  cart() {
    wx.switchTab({
      url: '/pages/shop/cart/cart',
    })
  },

  // 加入采购单
  addCart() {
    if(vm.data.cartIds.length<=0){
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
      })
        return
    }
    wx.request({
      url: config.addStoreCart_url,
      data: {
        cartId: vm.data.cartIds
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
  // 提交订单
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
          wx.navigateTo({
            url: '/pages/shop/orderQr/orderQr?cartId=' + vm.data.cartIds + '&type=2',
          })
        } else if (ret.cancel) {

        }
      }
    })
  },

  cartNum() {
    app.init()
    setTimeout(() => {
      var cartNum = wx.getStorageSync('cartNum')
      vm.setData({
        cartNum: cartNum
      })
      console.log(cartNum)
    }, 200);
  },
  onLoad: function (options) {
    vm = this;
    if (!wx.getStorageSync('token')) {
      wx.showToast({
        title: '请登录/注册',
        icon: "none"
      })
      return
    }
    var token = wx.getStorageSync('token')
    var cartNum = wx.getStorageSync('cartNum')
    vm.setData({
      token: token,
      cartNum: cartNum
    })
    vm.init()


    //   wx.getSystemInfo({
    //       success: function (res) {
    //           vm.setData({
    //               windowHeight: res.windowHeight
    //           });
    //       }
    //   });
  },



  //   drawStart: function (e) {
  //       // console.log("drawStart");  
  //       var touch = e.touches[0]

  //       for (var index in this.data.data) {
  //           var item = this.data.data[index]
  //           item.right = 0
  //       }
  //       this.setData({
  //           data: this.data.data,
  //           startX: touch.clientX,
  //       })

  //   },
  //   drawMove: function (e) {
  //       var touch = e.touches[0]
  //       var item = this.data.data[e.currentTarget.dataset.index]
  //       var disX = this.data.startX - touch.clientX

  //       if (disX >= 20) {
  //           if (disX > this.data.delBtnWidth) {
  //               disX = this.data.delBtnWidth
  //           }
  //           item.right = disX
  //           this.setData({
  //               isScroll: false,
  //               data: this.data.data
  //           })
  //       } else {
  //           item.right = 0
  //           this.setData({
  //               isScroll: true,
  //               data: this.data.data
  //           })
  //       }
  //   },
  //   drawEnd: function (e) {
  //       var item = this.data.data[e.currentTarget.dataset.index]
  //       if (item.right >= this.data.delBtnWidth / 2) {
  //           item.right = this.data.delBtnWidth
  //           this.setData({
  //               isScroll: true,
  //               data: this.data.data,
  //           })
  //       } else {
  //           item.right = 0
  //           this.setData({
  //               isScroll: true,
  //               data: this.data.data,
  //           })
  //       }
  //   },

  delItem: function (e) {

  },
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
})