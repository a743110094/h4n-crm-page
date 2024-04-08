<script setup lang="ts">
import { VirtualList, Space, Message } from "vexip-ui";
import { mock } from './mock_data'
import api from '~/api/api';
import { cartList } from "./const";


// 获取购物车内的商品信息
const getCartGoodsInfo = () => api.orderApi.getUserCartGoodsApi().then(res => cartList.value = res.data)
// 删除按钮点击方法
const onDeleteBtnClick = (id) => api.orderApi.deleteCartGoodsByIdApi(id).then(()=>getCartGoodsInfo())

onMounted(() => getCartGoodsInfo())
</script>

<template lang="pug">
VirtualList(:items="cartList" use-bar-track style="height: 800px")
  template(#default="{item}")  
    goods-card(:name="item.goodsName" :description="item.goodsName" :tags="[{ type: 'success', text: '测试' }]"
      :on-modify-btn-click="() => Message.error('未开发')" :image="item.img" :price="item.salePrice" :qty="item.qty"
      :on-delete-btn-click="() => onDeleteBtnClick(item.id)" )
</template>

<style scoped></style>