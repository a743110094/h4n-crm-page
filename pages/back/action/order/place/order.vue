<script setup lang="ts">


import { rand } from "@vueuse/shared";
import { cartList } from "~/components/cart/const";
const i18n = useI18n();

const columns = [{
  name: '#',
  type: 'order',
  key: 'order',
  noSummary: true
}, {
  name: i18n.t('back.page.bussiness.place.order.form.goodsNo'),
  key: 'goodsNo',
  width: 120,
  ellipsis: true,
  noSummary: true
}, {
  name: i18n.t('back.page.bussiness.place.order.form.goodsName'),
  key: 'goodsName',
  ellipsis: true,
  noSummary: true
}, {
  name: i18n.t('back.page.bussiness.place.order.form.qty'),
  key: 'qty',
  width: 70,
}, {
  name: i18n.t('back.page.bussiness.place.order.form.salePrice'),
  key: 'salePrice',
  width: 70
}, {
  name: i18n.t('back.page.bussiness.place.order.form.totalPrice'),
  key: 'totalPrice',
  width: 100
}]
</script>

<template lang="pug">
VTable(:columns="columns" :data="cartList" height="420" use-y-bar virtual summaries)
  VTableSummary(v-slot="{ meta }" id-key="min" name="最小值/最大值" :cell-span="footCellSpan")  {{ meta.sum }}
  VTableSummary(v-slot="{ meta }" id-key="max" name="Max") {{ meta.max }}
</template>

<style scoped></style>