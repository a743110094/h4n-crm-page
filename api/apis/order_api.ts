import $api from "~/request/request";
import url from "../url";

// 向购物车添加商品
const addGoodsIntoCartApi = (goodsId: any, qty: any) => postApi(url.order.addGoodsIntoCartUrl, null, {
    goodsId: goodsId,
    qty: qty
})

// 获取用户的购物车信息
const getUserCartGoodsApi = () => getApi(url.order.getUserCartGoodsUrl, null, null);

// 删除一条购物车记录
const deleteCartGoodsByIdApi = (cartId: any) => postApi(url.order.deleteCartGoodsByIdUrl, {id: cartId}, null)

// 批量删除购物车记录
const deleteCartGoodsByIdBatchApi = (cartIdList: any) => postApi(url.order.deleteCartGoodsByIdBatchUrl, null, cartIdList)

// 批量删除购物车记录
const updateCarteGoodsQtyByIdApi = (cartList: any) => postApi(url.order.updatCarteGoodsQtyByIdUrl, null, cartList)

// 下单
const placeOrderApi = (body: any) => postApi(url.order.placeOrderUrl, null, body)

/////////////////////////////////////////////////////////////////////////////////////////////////////////公共方法
const getApi = (url: any, params: any, body: any) => defaultApi(url, params, body, 3, 'get');
const postApi = (url: any, params: any, body: any) => defaultApi(url, params, body, 3, 'post');
const defaultApi = (url: any, params: any, body: any, retry: number, method: any) => $api(url, {
    body: body,
    method: method,
    retry: retry,
    retryDelay: 200, // Milliseconds
    query: params
}).then(res => {
    if (res && res.code === 2000) {
        return res;
    }
    const errMsg = res?.message;
    VMessage.warning(`Fetch Warning:${errMsg}`)
})
    .catch((err) => VMessage.error(`Fetch Error:${err}`));
/////////////////////////////////////////////////////////////////////////////////////////////////////////公共方法

export default {
    addGoodsIntoCartApi,
    getUserCartGoodsApi,
    deleteCartGoodsByIdApi,
    deleteCartGoodsByIdBatchApi,
    updateCarteGoodsQtyByIdApi,
    placeOrderApi
}