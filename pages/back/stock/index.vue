<template lang="pug">
div(class="pl-1 pr-1 max-h-52")
  VH4( marker aligned marker-type="primary") {{$t('back.page.maintian.stock.title')}} 
  // -- 搜索相关
VRow 
  VColumn(:span=24)
    VForm(:model="formModel" label-align="top" inline)
      VFormItem(:label="$t('back.page.maintian.stock.searchForm.name')" prop="name")
        VInput(size="small")
      VFormItem(:label="$t('back.page.maintian.stock.searchForm.innerCode')" prop="innerCode")
        VInput(size="small")  
      VFormItem(:label="$t('back.page.maintian.stock.searchForm.sku')" prop="sku")
        VInput(size="small")
      VFormItem(:label="$t('back.page.maintian.stock.searchForm.spu')" prop="spu")
        VInput(size="small")
      VFormItem(:label="$t('back.page.maintian.stock.searchForm.stockType')" prop="stockType")
        VSelect(size="small" :options="stockTypeOptions" clearable)     
      //VFormItem(label="Status" prop="status")
        VSelect(size="small" :options="statusOptions")
      VFormItem
        VButton(@click="loadData()" size="small" simple) {{$t('back.page.maintian.stock.searchForm.searchBtn')}}  
VRow
  VColumn
    VButtonGroup
      VButton(@click="onAddBtnClick" size="small" simple type="warning") {{ $t('back.page.maintian.stock.btnGroup.addBtn') }}
      VButton(@click="onEnableBtnClick" size="small" simple type="success") {{ $t('back.page.maintian.stock.btnGroup.enableBtn') }}
      VButton(@click="onDisabledBtnClick" size="small" simple type="error") {{ $t('back.page.maintian.stock.btnGroup.disabledBtn') }}
VRow(class="mt-4")
  VColumn(:span=24)
    // -- 表格相关
    VSpin(:active="isLoading" tip="Loading...")
      VTable(stripe border highlight virtual :columns="columns" :data="stockList" :height="480"
      :page-size="14" :current-page="1"  use-x-bar use-y-bar @row-enter="(payload)=> currentRow = payload.row" ref="stockTable")
        VTableColumn(:name="$t('back.page.maintian.stock.columns.action')" id-key="action" fixed="right" text-align="center" :width="120")
          VButton(size="small" type="success" simple text) {{ $t('back.page.maintian.stock.btnGroup.enableBtn') }}
          VButton(size="small" type="error" simple text) {{ $t('back.page.maintian.stock.btnGroup.disabledBtn') }}
      div(class="relative w-full mt-4")
        div(class="absolute right-0")
          VPagination(@page-size-change="onPageSizeChange" @change="onCurrentChange" :disabled="isLoading" 
            :total="total" :page-size="size" :active="current" :plugins="['total', 'size']")/

</template>

<script setup lang="ts">
import { getStockByPageApi } from "~/pages/back/stock/api";
import { onAddBtnClick, onEnableBtnClick, onDisabledBtnClick } from "~/pages/back/stock/functions";
import { onMounted } from "vue";
import { stockTable } from "~/pages/back/stock/consts";
// stocks 搜索
const formModel = ref({ stockType: '可用库存' });
const statusOptions = ref([{ value: 1, label: '库存不足' }])
// Stocks数据
const stockList = ref([]);
const isLoading = ref(true);
const size = ref(20);
const current = ref(1);
const total = ref(0);
const i18n = useI18n();

const stockTypeOptions = ref([
  { value: 10, label: i18n.t('back.page.maintian.stock.stockStatus.available') },
  { value: 20, label: i18n.t('back.page.maintian.stock.stockStatus.frozen') },
  { value: 30, label: i18n.t('back.page.maintian.stock.stockStatus.defective') },
  { value: 40, label: i18n.t('back.page.maintian.stock.stockStatus.pending') },
  { value: 50, label: i18n.t('back.page.maintian.stock.stockStatus.returning') },
  { value: 60, label: i18n.t('back.page.maintian.stock.stockStatus.inbound') },
  { value: 70, label: i18n.t('back.page.maintian.stock.stockStatus.outbound') },
  { value: 80, label: i18n.t('back.page.maintian.stock.stockStatus.qualityCheck') },
  { value: 90, label: i18n.t('back.page.maintian.stock.stockStatus.returningTransit') },
])

const columns = [
  { name: '#', key: '#', type: 'selection' },
  { name: i18n.t('back.page.maintian.stock.columns.warehouse'), key: 'warehouseName', width: 120 },
  { name: i18n.t('back.page.maintian.stock.columns.stockType'), key: 'stockType', width: 120 },
  { name: i18n.t('back.page.maintian.stock.columns.goodsName'), key: 'goodsName' },
  { name: i18n.t('back.page.maintian.stock.columns.innerCode'), key: 'innerCode' },
  { name: i18n.t('back.page.maintian.stock.columns.sku'), key: 'sku' },
  { name: i18n.t('back.page.maintian.stock.columns.spu'), key: 'spu' },
  { name: i18n.t('back.page.maintian.stock.columns.stockQtyHighLevel'), key: 'stockQtyHighLevel', width: 90 },
  { name: i18n.t('back.page.maintian.stock.columns.stockQty'), key: 'stockQty', width: 80 },
  { name: i18n.t('back.page.maintian.stock.columns.stockQtyLowLevel'), key: 'stockQtyLowLevel', width: 90 },
  { name: i18n.t('back.page.maintian.stock.columns.status'), key: 'status', width: 80 },
];


// 从后端加载库存数据
const loadData = () => {
  isLoading.value = true;
  stockList.value = [];
  getStockByPageApi(current.value, size.value, formModel.value)
    .then(res => {
      stockList.value = res.data.records
      size.value = res.data.size
      current.value = res.data.current
      total.value = res.data.total
    })
    .finally(() => setTimeout(() => isLoading.value = false, 200))
}
const onCurrentChange = (newCurrent: number) => {
  current.value = newCurrent;
  loadData();
}
const onPageSizeChange = (newPageSize: number) => {
  current.value = 1;
  size.value = newPageSize;
  loadData();
}


onMounted(async () => {
  loadData();
})


</script>
<style scoped></style>