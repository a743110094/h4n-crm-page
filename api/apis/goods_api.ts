import $api from "~/request/request";
import url from "../url"
import { version } from "vue";

// 获取商品分类树状数据
export const loadCategoryTreeDataApi = () => getApi(url.goods.getCategoryTreeDataUrl, null, null)

// 分页查询商品信息
export const getGoodsMainApi = (page: number, size: number, body: any) =>
    postApi(url.goods.getGoodsBaseInfoPageUrl, {
        page: page.toString(),
        size: size.toString()
    }, body)
// 上架

// 下架

// 新增商品
export const createGoodsApi = (mainData: any) => $api(url.goods.createGoodsUrl, { method: 'post', body: { goodsMain: mainData } })
    .then(res => {
        if (res.code && res.code !== 2000) {
            VMessage.warning(`${res.message}`)
        }
        return res
    })
    .catch(e => VMessage.error(`出错了: ${e}`))

// 删除商品
export const deleteGoodsApi = (goodsId: number) => $api(url.goods.deleteGoodsUrl, {
    method: 'post',
    query: {
        goodsId: goodsId
    }
})
    .then(res => {
        if (res.code && res.code !== 2000) {
            VMessage.warning(`${res.message}`)
        }
        return res
    })
    .catch(e => VMessage.error(`出错了: ${e}`))

// 修改商品
export const updateGoodsApi = (data: any) => $api(url.goods.updateGoodsUrl, { method: 'post', body: data })
    .then(res => {
        if (res.code && res.code !== 2000) {
            VMessage.warning(`${res.message}`)
        }
        return res
    })
    .catch(e => VMessage.error(`出错了: ${e}`))

// 根据id获取商品信息
export const getGoodsByIdApi = (goodsId: number) => $api(url.goods.getGoodsByIdUrl,
    {
        method: 'post',
        query: {
            goodsId: goodsId
        }
    })
    .then(res => {
        if (res.code && res.code !== 2000) {
            VMessage.warning(`${res.message}`)
        }
        return res
    })
    .catch(e => VMessage.error(`出错了: ${e}`))

// 商品上架或下架
export const stockUpOrDownApi = (row: { version: number, id: number, status: string }, operate: string) => {
    if ('UP' === operate || 'DOWN' === operate) {
        const urlReal = 'UP' === operate ? url.goods.stockUpUrl : url.goods.stockDownUrl
        $api(urlReal,
            {
                method: 'post',
                query: {
                    version: row.version,
                    goodsId: row.id
                }
            })
            .then(res => {
                if (res.code && res.code !== 2000) {
                    VMessage.warning(`${res.message}`)
                }
                return res
            })
            .catch(e => VMessage.error(`出错了: ${e}`))
    }


}



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
    .catch((err) => VMessage.error(`Fetch Error:${err.data}`));
/////////////////////////////////////////////////////////////////////////////////////////////////////////公共方法

export default {
    loadCategoryTreeDataApi, getGoodsMainApi, createGoodsApi, deleteGoodsApi, updateGoodsApi, getGoodsByIdApi, stockUpOrDownApi
}