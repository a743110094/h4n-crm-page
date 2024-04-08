<script setup lang="ts">


import { rand } from "@vueuse/shared";
import { countryOptions, receiverAddrModel } from "./const_addr";
import type { SelectFilter } from "vexip-ui/dist/components/select/index.js";
import type { Form } from "vexip-ui/dist/components/index.js";
import { placeOrderBtnEnable } from "./const";
import { CarSide } from "@vexip-ui/icons";
import $api from "~/request/request";

const items = ref(
  Array.from({ length: 10 }, (_, index) => {
    return {
      id: index,
      goodsNo: `编号A${rand(10000000, 99999999)}`,
      goodsName: `商品商品商品商品商商品商s商品${rand(1, 99999999)}`,
      qty: `${rand(1, 200)} `,
      unitPrice: `${rand(1, 200)} `,
      totalPrice: `${rand(1, 200)} `,
    }
  })
)
const i18n = useI18n();

const columns = [{
  name: '#',
  type: 'order',
  key: 'order',
  noSummary: true
}, {
  name: '商品编号',
  key: 'goodsNo',
  width: 120,
  ellipsis: true,
  noSummary: true
}, {
  name: '商品名称',
  key: 'goodsName',
  ellipsis: true,
  noSummary: true
}, {
  name: '数量',
  key: 'qty',
  width: 70
}, {
  name: '单价',
  key: 'unitPrice',
  width: 70
}, {
  name: '总价',
  key: 'totalPrice',
  width: 100
}]
const options = ['选项1', '选项2', '选项3']
const treeOptions = ref([
  {
    id: 'string13',
    name: 'XXX省',
    depth: 1,
    hasChild: true,
    index: 0,
    children: []
  }
])



/**/
function createOptions(depth = 1, prefix = 'Op', hasChild = true, data) {
  // deep = 2 说明省已经指定 调用根据省选择市的接口
  // deep = 3 说明市已经指定 调用根据省选择区的接口
  // deep = 4 说明区已经指定 调用根据省选择街道的接口
  for (let i = 1; i <= 10; ++i) {
    data.children.push({
      depth,
      hasChild,
      id: `${prefix}-${i}`,
      name: `${depth === 2 ? '市' : depth === 3 ? '区' : depth === 4 ? '街道' : '未知'}${prefix}-${i}`,
      index: i,
      children: []
    })
  }

  return options
}

const loadOptions = (data: Array) => {
  console.log(`data= ${JSON.stringify(data)}`)
  createOptions(data.depth + 1, data.value, data.depth < 3, data)
}
const rules = {
  // 下列任意的验证方式均可

  // 单个规则
  receiverName: {
    required: true,
    validator: (value: string) => value && value.length >= 2 && value.length < 20,
    message: i18n.t(`back.page.bussiness.place.errMsg.receiverName`)
  },
  // 单个规则
  phone: {
    required: true,
    validator: (value: string) => value && value.length >= 5 && value.length < 50,
    message: i18n.t(`back.page.bussiness.place.errMsg.receiverName`)
  },
  // 单个规则
  country: {
    required: true,
    message: i18n.t(`back.page.bussiness.place.errMsg.country`)
  },
  postcode: {
    required: true,
    validator: (value: string) => value && value.length >= 2 && value.length < 200,
    message: i18n.t(`back.page.bussiness.place.errMsg.postcode`)
  },
  province:{
    required: true,
    message: i18n.t(`back.page.bussiness.place.errMsg.province`)
  },
  city:{
    required: true,
    message: i18n.t(`back.page.bussiness.place.errMsg.city`)
  },
  region:{
    required: true,
    message:i18n.t(`back.page.bussiness.place.errMsg.region`)
  },
  // 单个规则
  addressCascader: {
    required: true,
    validator: (value: Array) => value && value.length > 2,
    message: i18n.t(`back.page.bussiness.place.errMsg.addressCascader`)
  },
  // 单个规则
  detailAddress: {
    required: true,
    validator: (value: string) => value && value.length >= 6 && value.length <= 500,
    message: i18n.t(`back.page.bussiness.place.errMsg.detailAddress`)
  }
}


const form = ref<InstanceType<typeof Form>>()

const handleSubmit = async () => {

  const errors = await form.value!.validate();

  ///--------错误--------
  if (errors && errors.length && errors.length > 0) {
    placeOrderBtnEnable.value = false;
  } else {
    placeOrderBtnEnable.value = true;
  }
  ///--------错误--------

}

const provinceOptions = ref([]);
const cityOptions = ref([]);
const regionOptions = ref([]);


const loadProviceOptions = () => {
  provinceOptions.value = []
  cityOptions.value = []
  regionOptions.value = []
  receiverAddrModel.value.province = null;
  receiverAddrModel.value.city = null;
  receiverAddrModel.value.region = null;
  if (receiverAddrModel.value.country) {
    $api(`basic_service/areas/v1/province?country=${receiverAddrModel.value.country}`, { method: 'get' }).then(res => provinceOptions.value = res.data)
  }
}
const loadCityOptions = () => {
  cityOptions.value = []
  regionOptions.value = []
  receiverAddrModel.value.city = null;
  receiverAddrModel.value.region = null;
  if (receiverAddrModel.value.province) {
    $api(`basic_service/areas/v1/city?province=${receiverAddrModel.value.province}`, { method: 'get' }).then(res => cityOptions.value = res.data)
  }
}
const loadRegionOptions = () => {
  regionOptions.value = []
  receiverAddrModel.value.region = null;
  if (receiverAddrModel.value.city) {
    $api(`basic_service/areas/v1/region?city=${receiverAddrModel.value.city}`, { method: 'get' }).then(res => regionOptions.value = res.data)
  }
}


</script>

<template lang="pug">
VForm(style="max-width: 1000px" size="small" label-align="top" :model="receiverAddrModel" ref="form" :rules="rules" )
  VFormItem(:span="6" prop="receiverName" :label="$t('back.page.bussiness.place.address.form.name')")
    VInput/
  VFormItem(:span="6" prop="dianhua" :label="$t('back.page.bussiness.place.address.form.tel')")
    VInput/
  VFormItem(:span="6" prop="phone" :label="$t('back.page.bussiness.place.address.form.phone')")
    VInput/
  VFormItem(:span="6" prop="country" :label="$t('back.page.bussiness.place.address.form.country')")
    VSelect(:options="countryOptions"  filter  ignore-case clearable  :key-config="{ label: 'en', value: 'id' }" @change="loadProviceOptions") 
  VFormItem(:span="6" prop="postcode" :label="$t('back.page.bussiness.place.address.form.postcode')")
    VInput
  VFormItem(:span="6" prop="province" :label="$t('back.page.bussiness.place.address.form.province')")
    VSelect(:options="provinceOptions"  filter  ignore-case clearable  :key-config="{ label: 'name', value: 'id' }" @change="loadCityOptions")
  VFormItem(:span="6" prop="city" :label="$t('back.page.bussiness.place.address.form.city')")
    VSelect(:options="cityOptions"  filter  ignore-case clearable  :key-config="{ label: 'name', value: 'id' }" @change="loadRegionOptions") 
  VFormItem(:span="6" prop="region" :label="$t('back.page.bussiness.place.address.form.region')")
    VSelect(:options="regionOptions"  filter  ignore-case clearable  :key-config="{ label: 'name', value: 'id' }") 
  //VFormItem(:span="16" prop="addressCascader" :label="$t('back.page.bussiness.place.address.form.addressCascade')" )
    vCascader( :key-config="{ label: 'name', value: 'id' }"  :on-async-load="loadOptions" :options="treeOptions" )
  VFormItem( prop="detailAddress" :label="$t('back.page.bussiness.place.address.form.addressDetail')")
    VTextarea/
  VFormItem(action="")
    VFormSubmit(@error="handleError" @submit="handleSubmit" simple="" size="small" :label="$t('back.page.bussiness.place.address.form.submitBtn')")
    VFormReset(size="small" :icon="CarSide" :label="$t('back.page.bussiness.place.address.form.resetBtn')")
</template>

<style scoped></style>