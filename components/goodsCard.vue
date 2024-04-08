<!--商品卡片，仿照Vant UI，封装成component-->
<template lang="pug">
VCard(class="w-auto max-w-3xl min-w-96 mt-1 mr-4")
  div(class="flex")
    a(class="relative flex-none w-24 h-24 mr-4 p-1")
      VImage(border lazy radius=8 height="96" width="96" :src="props.image")
      //勾选 function ( checked : boolean) 	在复选框勾选状态改变时触发，返回勾选状态
      VCheckbox(class="mt-3" v-model:checked="checked" color="orange" @change="onCheckBoxChange")
    // Content
    div(class="relative flex flex-1 flex-col justify-between min-w-0 min-h-20")
      div
        // 商品标题
        div(class="font-sans font-semibold text-sm max-h-8 min-h-6") {{props.name}}
        // 描述
        div(class="font-sans text-gray-500 text-xs w-auto leading-5 overflow-hidden whitespace-nowrap text-ellipsis w-auto") {{props.description}}
        // 标签
        div(class="min-h-6")
          VTag(v-for="(item,i) in props.tags" :type="item.type" border size="small" simple) {{item.text}}
        // 价格和数量
        div(class="leading-10 align-bottom")
          // 价格
          div(class="font-sans text-md inline-block")
            // 数字的class
            div(class="text-lg inline-block") {{props.currency}}
              // 整数
              div(class="font-semibold inline-block") {{ props.price / 100 >= 1 ? props.price / 100 : 0 }}.
            // 小数
            div(class="text-base font-semibold inline-block") {{ props.price % 100    }}
          // 数量
          div(class="float-right align-bottom font-sans text-md") &times;&nbsp;{{props.qty}}
        // 功能按钮
        div
          div(class="float-right align-bottom")
            VButton(size="small" type="primary" :icon="Message" style="--vxp-button-height: 20px; --vxp-button-h-padding: 6px" @click="onModifyBtnClick" ) 修改
            VButton(size="small" type="error" :icon="Message" style="--vxp-button-height: 20px; --vxp-button-h-padding: 6px" @click="onDeleteBtnClick") 删除
</template>

<script lang="ts" setup>
import { Message } from "vexip-ui";

const tags = ['primary', 'success', 'error', 'warning'] as const
//tag 配置text 和 type
const props = defineProps(
  {
    image: String,
    name: String,
    description: String,
    price: {
      type: String,
      default: '0.00',
      validator: (value: string) => /^\d+\.\d{2}$/.test(value)
    },
    shop: {
      type: String,
      default: '',
    },
    qty: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      default: []
    },
    currency: {
      type: String,
      default: '￥'
    },
    onModifyBtnClick: Function,
    onDeleteBtnClick: Function,
    onCheckBoxChange: Function
  }
)

const loaded = reactive(new Set())

</script>

<style scoped></style>