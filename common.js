var base_url = "http://192.168.3.95:8000";
// var base_url = "https://xiny.yunxiaochengxu.top";
function getconfig() {
  var config = {
    // 注册
    authorization_url: base_url + "/app/login/authorization", //授权登录
    binding_phone_url: base_url + "/app/login/binding_phone", //绑定手机号
    biography_url: base_url + '/app/index/biography', //解析json
    // 首页
    bannerList_url:base_url + "/app/index/bannerList",//首页banner
    storeGoodsCategoryList_url:base_url + "/app/index/storeGoodsCategoryList",//首页一级分类
    storeGoodsCategoryTwoList_url:base_url + "/app/index/storeGoodsCategoryTwoList",//点击一级分类查询二级分类
    prefectureList_url:base_url + "/app/index/prefectureList",//专区列表
    prefectureSupplierList_url:base_url + "/app/index/prefectureSupplierList",//专区商品列表
    supplierList_url:base_url + "/app/index/supplierList",//首页供应商列表
    prefectureSupplierList_url:base_url + "/app/index/prefectureSupplierList",//专区供应商列表
    supplierDetails_url:base_url + "/app/index/supplierDetails",//供应商详情
    supplierCategoryGoodsList_url:base_url + "/app/index/supplierCategoryGoodsList",//供应商/商城分类商品列表
    goodsDetails_url:base_url + "/app/index/goodsDetails",//商品详情
    classifyDetails_url:base_url + "/app/index/classifyDetails",//分类详情
    activityList_url:base_url + "/app/index/activityList",//通知列表
    activityDetails_url:base_url + "/app/index/activityDetails",//通知详情
    // 我的
    personData_url:base_url + "/app/my/personData",//个人资料
    agreementList_url:base_url + "/app/my/agreementList",//1:服务协议 2:公司简介3:注销协议
    feedBack_url:base_url + "/app/my/feedBack",//意见反馈
    updateAccount_url:base_url + "/app/my/updateAccount",//修改资料保存
    informationChangeGetMobileCode_url:base_url + "/app/login/informationChangeGetMobileCode",//信息变更发送验证码
    newPhoneSave_url:base_url + "/app/login/newPhoneSave",//绑定新手机号点击保存
    updatePassword_url:base_url + "/app/login/updatePassword",//修改密码
    logout_url:base_url + "/app/my/logout",//注销账号
    // 地址
    addressList_url: base_url + "/app/address/addressList", //地址列表
    addAddress_url: base_url + "/app/address/addAddress", //添加收货地址
    addressDel_url: base_url + "/app/address/addressDel", //删除收货地址
    addressUpdate_url: base_url + "/app/address/addressUpdate", //地址修改 
    // 采购单
    cartList_url:base_url + "/app/cart/cartList",//采购单列表
    cartAdd_url:base_url + "/app/cart/cartAdd",//加入采购单
    cartNum_url:base_url + "/app/cart/cartNum",//采购单数量
    addToCart_url:base_url + "/app/cart/addToCart",//采购单添加数量
    minusToCart_url:base_url + "/app/cart/minusToCart",//采购单减数量
    checkOneCart_url:base_url + "/app/cart/checkOneCart",//单选和取消勾选
    selectCart_url:base_url + "/app/cart/selectCart",//购物车全选与全不选 默认全选
    cartDelete_url:base_url + "/app/cart/cartDelete",//清空商品和删除单个商品  
    storeCartSubmit_url:base_url + "/app/cart/storeCartSubmit",//采购单提交到确认订单页面
    goodsSubmit_url:base_url + "/app/index/goodsSubmit",//立即购买到确认订单页面
    // 常购清单
    keepCartList_url: base_url + "/app/cart/keepCartList", //常购单列表
    selectKeepCart_url: base_url + "/app/cart/selectKeepCart", //常购清单全选与不全选
    checkOneKeepCart_url: base_url + "/app/cart/checkOneKeepCart", //常购清单单选和取消勾选
    addToKeepCart_url:base_url + "/app/cart/addToKeepCart",//常购清单添加数量
    minusToKeepCart_url:base_url + "/app/cart/minusToKeepCart",//常购清单减数量
    keepCartDelete_url:base_url + "/app/cart/keepCartDelete",//清空商品和删除单个商品
    addStoreCart_url:base_url + "/app/cart/addStoreCart",//常购清单加入采购单
    keepCartSubmit_url:base_url + "/app/cart/keepCartSubmit",//常购清单提交到确认订单页面
    // 下单
    keepCartOrderSubmit_url:base_url + "/app/cart/keepCartOrderSubmit",//常购清单直接下单
    storeCartOrderSubmit_url:base_url + "/app/cart/storeCartOrderSubmit",//购物车直接下单
    goodsOrderSubmit_url:base_url + "/app/index/goodsOrderSubmit",//商城中的商品直接下单
    // 订单
    storeOrderList_url:base_url + "/app/my/storeOrderList",//订单列表
    cancelOrder_url:base_url + "/app/my/cancelOrder",//取消订单
    delOrder_url:base_url + "/app/my/delOrder",//删除订单
    confirmReceipt_url:base_url + "/app/my/confirmReceipt",//确认收货
    orderDetails_url:base_url + "/app/my/orderDetails",//订单详情
    // 图片上传
    imgs_url:base_url + "/common/imgs",//图片上传  
    // 消息推送
    message_url:base_url + "/app/message/index",//消息推送
  }
  return config;
};
getconfig();
module.exports = {
  getconfig: getconfig
}