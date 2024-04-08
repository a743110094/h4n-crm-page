export default {
    //新增商品
    createGoodsUrl: 'goods_service/base/v1/add',
    // 分页查询商品信息
    getGoodsBaseInfoPageUrl: 'goods_service/base/v1/page',
    // 删除商品
    deleteGoodsUrl: 'goods_service/base/v1/delete',
    // 修改商品
    updateGoodsUrl: 'goods_service/base/v1/update',
    // 根据id获取商品基础信息
    getGoodsByIdUrl: 'goods_service/base/v1/getBaseInfoById',
    // 获取商品的分类树状信息
    getCategoryTreeDataUrl: 'goods_service/category/v1/tree',
    // 修改分类数据
    updateCategoryUrl: 'goods_service/category/v1/update',
    // 新增分类数据
    createCategoryUrl: 'goods_service/category/v1/add',
    // 删除分类数据
    deleteCategoryUrl: 'goods_service/category/v1/deleteByIds',
    // 商品上架
    stockUpUrl: 'goods_service/base/v1/shelves',
    // 商品下架
    stockDownUrl: 'goods_service/base/v1/takeOffShelves',
}