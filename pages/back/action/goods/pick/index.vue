<template lang="pug">
div
  VRow 
    VColumn(:span="24")
      VH4( marker aligned marker-type="primary") {{ $t('back.page.bussiness.pick.title') }}
  VRow(class="mt-4" :gap="16")
    // 左侧搜索、分类区域
    VColumn(:xxl=5 :xl=6 :lg=8 :md=24)
      div(class="flex flex-row justify-between my-1")
        div
          VInput(placeholder="vexip-ui" size="small" v-model:value="goodsSearchKeyword")
            template(#before-action)
              VSelect(:options="[{label:'商品名',value:'asdf'}]")
            template(#after-action)
              VButton(@click='loadGoodsData' size="small" :loading="goodsTableIsLoading || cartTableIsLoading" :icon="MagnifyingGlass") {{ $t('back.page.bussiness.pick.searchBtn') }}         
      div(class="my-1")
        div {{ $t('back.page.bussiness.pick.categoryTitle') }}
          VTree(:data="modalCategoryOptions" :key-config="{ label: 'name', value: 'id' }"  :height="(tableHeight/5-100) * 3" use-y-bar
        v-loading="goodsTableIsLoading" @node-click="(row)=>onTreeClick(row.id)" no-build-tree no-cascaded virtual link-line)
        div {{ $t('back.page.bussiness.pick.cartListTitle') }}
          VTable(:columns="cartColumns" :data="cartList" virtual use-x-bar use-y-bar width="100%" v-loading="cartTableIsLoading" :height="(tableHeight/5-100) * 4" )
    // 右侧表格
    VColumn(:xxl=19 :xl=18 :lg=16 :md=24)
      div {{ $t('back.page.bussiness.pick.goodsListTitle') }}
        VTable(:columns="columns" :data="goodsList" v-loading="goodsTableIsLoading" virtual use-x-bar use-y-bar width="100%" :height="tableHeight<600 ? 400 : tableHeight - 180")
    //VColumn(:xxl=4)
      div 
        VTable(:columns="cartColumns" :data="cartList" v-loading="cartTableIsLoading" virtual use-x-bar use-y-bar width="100%" :height="tableHeight<600 ? 400 : tableHeight  - 300 " )
</template>

<script setup lang="ts" >

import { h, onMounted, ref } from 'vue';
import api from '~/api/api';
import { MagnifyingGlass, CartPlus, Trash } from '@vexip-ui/icons'
 import { Button,Image, Message, NumberInput } from 'vexip-ui';
///--------Const
const goodsTableIsLoading = ref(false);
const cartTableIsLoading = ref(false);

const goodsSearchKeyword = ref('');
const i18n = useI18n();
const columns = [
  {
    name: `${i18n.t('back.page.bussiness.pick.goodsTable.columns.img')}`, key: 'img', width: 150,
    renderer: (data) =>
      h(
        Image, { src: data.row.img, width: 100, height: 128, class: "p-1", lazy: true, preview: true }, {}
      )
  },
  { name: `${i18n.t('back.page.bussiness.pick.goodsTable.columns.name')}`, key: 'name' },
  { name: `${i18n.t('back.page.bussiness.pick.goodsTable.columns.innerCode')}`, key: 'innerCode' },
  { name: `${i18n.t('back.page.bussiness.pick.goodsTable.columns.isbn')}`, key: 'isbn', width: 130 },
  { name: `${i18n.t('back.page.bussiness.pick.goodsTable.columns.sku')}`, key: 'sku' },
  { name: `${i18n.t('back.page.bussiness.pick.goodsTable.columns.spu')}`, key: 'spu' },
  { name: `${i18n.t('back.page.bussiness.pick.goodsTable.columns.status')}`, key: 'status' },
  {
    name: `${i18n.t('back.page.bussiness.pick.goodsTable.columns.action')}`, width: 130,
    renderer: (data:any) =>
      h(
        Button, { size: "small", simple: true, type: "warning", icon: CartPlus, onClick: () => addToCartBtnClick(data.row.id) }, ["加入购物车"]
      )
  },
];

// 购物车表格列
const cartColumns = [
  /*{
      name: `${i18n.t('back.page.bussiness.pick.cartTable.columns.img')}`, key: 'img', width: 64,
      renderer: (data) =>
        h(
          Image, { src: data.row.img, width: 50, height: 64, class: "p-1", lazy: true }, {}
        )
    },*/
  { name: `${i18n.t('back.page.bussiness.pick.cartTable.columns.name')}`, key: 'goodsName' },
  {
    name: `${i18n.t('back.page.bussiness.pick.cartTable.columns.qty')}`, key: 'qty', width: 80,
    renderer: (data:any) =>
      h(
        NumberInput, {
        size: "small", value: data.row.qty, "onUpdate:value": (val) => {
          /* 修改Model数据 */
          data.row.qty = val
          /** 调用API */
          updateCartQtyByIp({ list: [data.row] })
        }
      }, {}
      )
  },
  {
    name: `${i18n.t('back.page.bussiness.pick.cartTable.columns.action')}`, width: 100,
    renderer: (data:any) =>
      h(
        Button, { size: "small", simple: true, type: "error", icon: Trash, onClick: () => deleteCartGoodsInfo(data.row.id) }, ["移除"]
      )
  },
];
const goodsList = ref([]);
const cartList = ref([]);
//-- 商品分类选项
const modalCategoryOptions = ref([]);

// 加载商品数据信息
const loadGoodsData = () => {
  goodsList.value = []
  goodsTableIsLoading.value = true
  api.goodsApi.getGoodsMainApi(1, 100, { name: goodsSearchKeyword.value }).then(res => goodsList.value = res.data.records)
    .finally(() => goodsTableIsLoading.value = false)
}

/// 模态框加载商品分类数据
const loadCategoryData = () => {
  cartList.value = []
  cartTableIsLoading.value = true
  api.goodsApi.loadCategoryTreeDataApi().then(res => modalCategoryOptions.value = res.data)
    .finally(() => cartTableIsLoading.value = false)
}

// 添加到购物车 按钮点击
const addToCartBtnClick = (goodsId) => {
  api.orderApi.addGoodsIntoCartApi(goodsId, 1)
  .then(()=>Message.success(`添加成功`))
  // 刷新购物车数据
  useTimeoutFn(() => getCartGoodsInfo(), 500)
}
// 获取购物车内的商品信息
const getCartGoodsInfo = () => api.orderApi.getUserCartGoodsApi().then(res => cartList.value = res.data)
// 删除购物车数据
const deleteCartGoodsInfo = (cartId) => api.orderApi.deleteCartGoodsByIdApi(cartId).then(res => {
  const msg = res?.message;
  if (msg) {
    Message.success(msg)
  }
  useTimeoutFn(() => getCartGoodsInfo(), 500)
})
// 根据id修改购物车记录的数量
const updateCartQtyByIp = (cartId) => api.orderApi.updatCarteGoodsQtyByIdApi(cartId).then(res => {
  const msg = res?.message;
  if (msg) {
    Message.success(msg)
  }
  useTimeoutFn(() => getCartGoodsInfo(), 500)
})

// 表格高度响应式
const { width, height: tableHeight } = useWindowSize()


/// 
onMounted(() => {
  useTimeoutFn(() => loadGoodsData(), 0)
  useTimeoutFn(() => loadCategoryData(), 0)
  useTimeoutFn(() => getCartGoodsInfo(), 500)
})

</script>