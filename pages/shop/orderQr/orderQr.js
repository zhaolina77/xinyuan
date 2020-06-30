// pages/shop/orderQr/orderQr.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: '',
    type: 2,
    goods_num: 0, //采购数量
    paid_money: '', //支付金额
    //地址信息
    address: null,
    name: '',
    mobile: '',
    address_id: 5,
    full_address: '',
    address_info: '',
    cartIds: '',
    // 立即购买提交到确认订单页面
    id: 0,
    count: 0,
    goods: "",
    //采购单提交到确认订单页面
    cartPist: [],
    cartIda: 0


  },
  init() {
    if (vm.data.type == 3) {
      wx.request({
        url: config.goodsSubmit_url, //立即购买提交到确认订单页面
        data: {
          token: vm.data.token,
          id: vm.data.id,
          count: vm.data.count
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: (res) => {
          console.log(res)
          if (res.data.status == 1) {
            var address = res.data.data.address
            var goods = res.data.data.goods
            vm.setData({
              address: address,
              goods: goods,
              goods_num: goods.goods_num,
              paid_money: goods.paid_money
            })
            if (address != null) {
              vm.setData({
                address_info: address.address_info,
                full_address: address.full_address,
                address_id: address.id,
                mobile: address.mobile,
                name: address.name,
                address_id: address.id
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
      })
    } else {
      var url = ''
      if (vm.data.type == 2) {
        url = config.keepCartSubmit_url
      } else {
        url = config.storeCartSubmit_url
      }
      wx.request({
        url: url, //常购清单/采购单提交到确认订单页面
        data: {
          token: vm.data.token,
          cartId: vm.data.cartIds,
          // addressId: vm.data.address_id
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: (res) => {
          console.log(res)
          if (res.data.status == 1) {
            var address = res.data.data.address
            vm.setData({
              address: address,
              cartPist: res.data.data.cartPist,
              goods_num: res.data.data.totalNum,
              paid_money: res.data.data.totalPrice
            })
            if (address != null) {
              vm.setData({
                address_info: address.address_info,
                full_address: address.full_address,
                address_id: address.id,
                mobile: address.mobile,
                name: address.name,
                address_id: address.id
              })
            }
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
      })
    }

  },


  order() {
    wx.showModal({
      title: '提交订单',
      content: '确定提交该订单吗？',
      success(ret) {
        console.log(ret)
        if (ret.confirm) {
          var url = ''
          if (vm.data.type == 3) {
            wx.request({
              url: config.goodsOrderSubmit_url, //商城中的商品直接下单
              data: {
                token: vm.data.token,
                id: vm.data.id,
                count: vm.data.count,
                addressId: vm.data.address_id
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: (res) => {
                console.log(res)
                if (res.data.status == 1) {
                  wx.redirectTo({
                    url: '/pages/shop/tijiaoCg/tijiaoCg',
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              },
            })
          } else {
            var url = ''
            if (vm.data.type == 1) {
              url = config.storeCartOrderSubmit_url
            } else {
              url = config.keepCartOrderSubmit_url
            }
            wx.request({
              url: url, //商城中的商品直接下单
              data: {
                token: vm.data.token,
                cartId: vm.data.cartIds,
                addressId: vm.data.address_id
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: "POST",
              success: (res) => {
                console.log(res)
                if (res.data.status == 1) {
                  wx.redirectTo({
                    url: '/pages/shop/tijiaoCg/tijiaoCg',
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  })
                }
              },
            })
          }
        }
      }
    })
  },
  addadress() {
    wx.navigateTo({
      url: '/pages/mine/address/address?type=2',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    vm = this;
    var token = wx.getStorageSync('token')
    var type = options.type
    vm.setData({
      token: token,
      type: type
    })
    console.log()
    if (type == 3) {
      var id = options.id
      var count = options.num
      console.log(count)
      vm.setData({
        id: id,
        count: count,
      })
    } else {
      var cartIds = options.cartId
      vm.setData({
        cartIds: cartIds,
      })
    }
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
    console.log(this.data.name)

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