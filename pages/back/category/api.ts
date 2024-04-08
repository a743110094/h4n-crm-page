import url from "~/api/url"
import $api from "~/request/request"

// 获取分类树状数据 已迁移
export const loadCategoryTreeDataApi = () => $api(url.goods.getCategoryTreeDataUrl, { method: 'get' })
// 修改分类数据
export const updateCategoryApi = (data: any) => $api(url.goods.updateCategoryUrl, { method: 'post', body: data })
// 新增分类数据
export const createCategoryApi = (data: any) => $api(url.goods.createCategoryUrl, { method: 'post', body: data })
// 删除分类数据
export const deleteCategoryApi = (idArray: any[]) => $api(url.goods.deleteCategoryUrl, {
    method: 'post', body: {
        ids: idArray
    }
})