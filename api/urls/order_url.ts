export default {
    // 向购物车添加商品
    addGoodsIntoCartUrl: 'order_service/cart/v1/addGoodIntoCart',
    // 获取用户的购物车信息
    getUserCartGoodsUrl: 'order_service/cart/v1/getCartGoods',
    // 删除一条购物车记录
    deleteCartGoodsByIdUrl: 'order_service/cart/v1/deleteById',
    // 批量删除购物车记录
    deleteCartGoodsByIdBatchUrl: 'order_service/cart/v1/deleteByIds',
    // 按 ID 更新购物车记录数量
    updatCarteGoodsQtyByIdUrl: 'order_service/cart/v1/updateQtyById',

    /////////////////--------------订单相关
    // 下单 
    placeOrderUrl: 'order_service/base/v1/placeOrder',
}