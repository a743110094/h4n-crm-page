<template lang="pug">
VH4( marker aligned marker-type="primary") {{$t('back.page.maintian.category.title')}}
VButtonGroup
  VButton(@click="onAddBtnClick" size="small" simple type="success" :disabled="dataIsLoading") {{$t('back.page.maintian.category.addBtn')}}
  VButton(@click="onDeleteBtnClick" size="small" simple type="error" :disabled="dataIsLoading") {{$t('back.page.maintian.category.deleteBtn')}}
div(class="mt-2")/
VSpin(:active="dataIsLoading" tip="Loading...")
  VTable(:data="data" :columns="columns" @row-enter="(payload)=> currentRow = payload.row" ref="categoryTable" :height="600" virtual use-y-bar no-cascaded)
    VTableColumn(:name="$t('back.page.maintian.category.columns.intro')" id-key="action" fixed="right" text-align="center" :width="120")
      VButton(@click="onEditBtnClick" :disabled="dataIsLoading" type="primary" simple text ) 编辑
// 模态框
VModal(v-model:active="modalActive" transfer :title="$t('back.page.maintian.category.modalForm.title')" 
width="40vw" :on-show="loadCategoryData" :on-confirm="upsertCategory")
  VForm(label-align="top" :model="formModel"  ref="form" size="small" )
    VFormItem(:label="$t('back.page.maintian.category.modalForm.pid')" :span=20 prop="pid")
      VSelect(:options="modalCategoryOptions" :key-config="{ label: 'name', value: 'id' }" :max-list-height="200" clearable)
    VFormItem(:label="$t('back.page.maintian.category.modalForm.name')" :span=10 prop="name")
      VInput/
    VFormItem(:label="$t('back.page.maintian.category.modalForm.code')" :span=10 prop="code")
      VInput/
    VFormItem(:label="$t('back.page.maintian.category.modalForm.intro')" :span=20 prop="intro")
      VTextarea/
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import {
  onDeleteBtnClick,
  loadCategoryData,
  onAddBtnClick,
  onEditBtnClick,
  upsertCategory
} from "~/pages/back/category/functions";
import { currentRow, data, formModel, modalActive, modalCategoryOptions, dataIsLoading, categoryTable } from "~/pages/back/category/consts";
const i18n = useI18n();

const columns = [
  { name: '#', key: '#', type: 'selection' },
  { key: 'name', name: i18n.t('back.page.maintian.category.columns.name') },
  { key: 'code', name: i18n.t('back.page.maintian.category.columns.code'), width: 200 },
  { key: 'level', name: i18n.t('back.page.maintian.category.columns.level'), width: 80 },
  { key: 'intro', name: i18n.t('back.page.maintian.category.columns.intro') },
];

// 初始化数据
onMounted(() => {
  loadCategoryData();
});
</script>
<style scoped></style>