// pages/cart/index/index.js
var common = require('../../../common.js');
var config = common.getconfig();
var vm = null;
Page({
  data: {
    delBtnWidth: 160,
    data: [{
      content: "1",
      right: 0
    }, {
      content: "1",
      right: 0
    }],
    addressList: [],
    type: 1, //2 地址选择

  },
  add() {
    wx.navigateTo({
      url: '/pages/mine/addressAdd/addressAdd?type='+vm.data.type,
    })
  },

  //   地址列表
  address() {
    wx.request({
      url: config.addressList_url,
      data: {
        token: vm.data.token
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {

          setTimeout(function () {
            wx.hideLoading()
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
          }, 1500);
          vm.setData({
            addressList: res.data.addressList,
          })
        }
      },
    });
  },
  // 删除地址
  del(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.request({
      url: config.addressDel_url,
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.status == 1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
          vm.address();
        }
      },
    });
  },

  // 编辑地址
  bianji(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    if(vm.data.type==2){
     
      setTimeout(() => {
        let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
        let prevPage = pages[pages.length - 2];
        prevPage.setData({ // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
          address:'address',
          name:e.currentTarget.dataset.name,
          mobile:e.currentTarget.dataset.mobile,
          address_id: e.currentTarget.dataset.id,
          full_address: e.currentTarget.dataset.full,
          address_info: e.currentTarget.dataset.info,
        })
        console.log(prevPage.data.name)
        wx.navigateBack({
          delta: 1 // 返回上一级页面
        })
        return
      });
    }else{
      var name = e.currentTarget.dataset.name
      var id = e.currentTarget.dataset.id
      var mobile = e.currentTarget.dataset.mobile
      var def = e.currentTarget.dataset.def
      var full = e.currentTarget.dataset.full
      var info = e.currentTarget.dataset.info
      wx.navigateTo({
        url: '/pages/mine/addressBj/addressBj?id=' + id + "&name=" + name + "&mobile=" + mobile + "&def=" + def + "&full=" + full + "&info=" + info,
      })
    }


  },
  onLoad: function (options) {
    vm = this;
    var token = wx.getStorageSync('token')
    var type=1
    if (options) {
      type = options.type
    } else {
      type = 1
    }
    vm.setData({
      token: token,
      type:type
    })
    console.log(vm.data.type)
    vm.address();
    wx.getSystemInfo({
      success: function (res) {
        vm.setData({
          windowHeight: res.windowHeight
        });
      }
    });
  },




  drawStart: function (e) {
    // console.log("drawStart");  
    var touch = e.touches[0]

    for (var index in this.data.addressList) {
      var item = this.data.addressList[index]
      item.right = 0
    }
    this.setData({
      addressList: this.data.addressList,
      startX: touch.clientX,
    })

  },
  drawMove: function (e) {
    var touch = e.touches[0]
    var item = this.data.addressList[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        addressList: this.data.addressList
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        addressList: this.data.addressList
      })
    }
  },
  drawEnd: function (e) {
    var item = this.data.addressList[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        addressList: this.data.addressList,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        addressList: this.data.addressList,
      })
    }
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
      addressList: [],
      pageNo: 1
    })
    this.address()
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