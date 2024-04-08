<template lang="pug">
VSplit(lazy value=0.38 style="height: 90vh; box-shadow: 0 0 1px")
  // 左上
  template(#left)
    div(style="padding: 10px")
      VH4( marker aligned marker-type="primary") {{$t('back.page.bussiness.place.title')}}
      // 购物车
      cart
  // 右侧
  template(#right)
    div(style="padding: 10px")
      VH4( marker aligned marker-type="primary") {{$t('back.page.bussiness.place.orderTitle')}}
      VSpace(vertical)
        // 地址
        Address(ref="address")/
        // 订单
        Order/
      div(class="inline-block w-full pt-2")
        div(class="float-left") 
          //div(class="text-sm") 支付方式：
          VRadioGroup(v-model:value="payType" :options="payTypeOptions" shape="default" size="small")/
        div(class="float-right")
          VButton(type="warning" :loading="isPlaceOrder" @click="placeOrder" size="small" :disabled="!placeOrderBtnEnable") {{$t('back.page.bussiness.place.placeBtn')}}
</template>

<script setup lang="ts">
import cart from "~/components/cart/index.vue";
import Order from "~/pages/back/action/order/place/order.vue";
import Address from "~/pages/back/action/order/place/address.vue";
import { receiverAddrModel } from "./const_addr";
import { cartList } from "~/components/cart/const";
import api from "~/api/api";
import { placeOrderBtnEnable } from "./const";
import type { RadioRawOption } from "vexip-ui";
// 通过 useI18n 方法获取 i18n 插件
const i18n = useI18n()
const items = ref(
  Array.from({ length: 100 }, (_, index) => {
    return {
      id: index,
      value: `元素${index}`
    }
  })
)

// 订单是否正在处理中
const isPlaceOrder = ref(false)
const payType = ref('');
const payTypeOptions = ref<RadioRawOption[]>([
  {
    label: "现金",
    content: i18n.t('back.page.bussiness.place.payType.cash')
  },
  {
    label: "支付宝",
    content: i18n.t('back.page.bussiness.place.payType.aliPay')
  },
  {
    label: "微信支付",
    content: i18n.t('back.page.bussiness.place.payType.wechatPay')
  }
]);

/// =======================下单方法=======================

/*** 处理下单的参数 **/
const placeOrderRequestBody = ref({
  /// 拼接收获地址
  receiverAddress: receiverAddrModel,
  // 支付方式
  payType: payType,
  /** 拼接商品信息 */
  goodsInfo: cartList
})


// 下单方法
const placeOrder = () => {

  // 处理省市区街道
  // 处理省市区街道
  // 校验
  if (!payType.value) {
    VMessage.error(`${i18n.t('back.page.bussiness.place.noPayTypeErr')} `)
    return;
  }

  isPlaceOrder.value = true;
  // 校验
  api.orderApi.placeOrderApi(placeOrderRequestBody.value).then(res => {
    if (res && res.message) {
      VMessage.success(`${res?.message}`)
    }
  }).finally(() => isPlaceOrder.value = false)
}
/// =======================下单方法=======================

</script>

<style scoped>.virtual-list__item {
  height: 36px;
  border-bottom: var(--vxp-border-base);
}</style>