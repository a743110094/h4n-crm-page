<template lang="pug">
VRow 
  VColumn(:span="24")
    VH4( marker aligned marker-type="primary") {{$t('back.page.maintian.goods.title')}} 
VRow 
  VColumn(:span="24")   
    VForm(:model="searchFormModel" label-align="left" inline)
      VFormItem(:label="$t('back.page.maintian.goods.searchForm.name')" prop="name")
        VInput(size="small")
      VFormItem(:label="$t('back.page.maintian.goods.searchForm.innerCode')" prop="innerCode")
        VInput(size="small")
      VFormItem(:label="$t('back.page.maintian.goods.searchForm.sku')" prop="sku")
        VInput(size="small")
      VFormItem(:label="$t('back.page.maintian.goods.searchForm.spu')" prop="spu")
        VInput(size="small")
      VFormItem(:label="$t('back.page.maintian.goods.searchForm.isbn')" prop="isbn")
        VInput(size="small")
      VFormItem(:label="$t('back.page.maintian.goods.searchForm.status')" prop="status")
        VSelect(size="small" :options="statusOptions" clearable)
      VFormItem(:label="$t('back.page.maintian.goods.searchForm.category')" prop="categoryId")
        VSelect(:options="modalCategoryOptions" size="small" :key-config="{ label: 'name', value: 'id' }" :max-list-height="200" clearable)
      VFormItem
        VButton(@click="loadData()" size="small" simple) {{$t('back.page.maintian.goods.searchForm.searchBtn')}} 
VRow
  VColumn(:span="24")        
    //VButtonGroup
    VButton(@click="onAddBtnClick" size="small" simple type="success") {{$t('back.page.maintian.goods.addBtn')}} 
      //VButton(@click="onDeleteBtnClick" size="small" simple type="error") 删除
VRow(class="mt-4" :gap="16")
  VColumn(:span="4")
    VTree(:data="modalCategoryOptions" :key-config="{ label: 'name', value: 'id' }"  v-loading="isLoading"
    @node-click="(row)=>onTreeClick(row.id)" no-build-tree no-cascaded height="100%" virtual link-line)
  VColumn(:span="20")
    // -- 表格相关 
    VSpin(:active="isLoading" tip="Loading...")
      VTable(:columns="columns" stripe border highlight :virtual="goodsList.length>=50" ellipsis use-x-bar use-y-bar :data="goodsList"
        :height="height < 700 ? 400 : height - 300" width="100%")/
      div(class="relative w-full mt-4")
        div(class="absolute right-0")
          VPagination(@page-size-change="onPageSizeChange" @change="onCurrentChange" :disabled="isLoading" 
            :total="total" :page-size="size" :active="current" :plugins="['total', 'size']")/
// -- 模态框
VModal(v-model:active="modalActive" :width="900" @show="loadCategoryData" :on-confirm="upsertGoods")
  div(class="w-full md:w-auto")
    div(class="float-left w-8/12")
      VForm(:gap=10 label-width="80" label-align="top" :model="upsertGoodsModal")
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.category')" :span=18 prop="categoryId") 
          VSelect(:options="modalCategoryOptions" :key-config="{ label: 'name', value: 'id' }" :max-list-height="200" clearable)
        VFormItem(:span=6) 
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.name')" :span=16 prop="name")
          VInput
        VFormItem(:span=8)
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.innerCode')" :span=11 prop="innerCode")
          VInput
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.isbn')" :span=11 prop="isbn")
          VInput
        VFormItem(:span=2)   
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.sku')" :span=10 prop="sku")
          VInput
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.spu')" :span=10 prop="spu")
          VInput
        VFormItem(:span=4)
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.purchasePrice')" :span=10 prop="purchasePrice")
          VInput(type="number")
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.salePrice')" :span=10 prop="salePrice")
          VInput(type="number")
        VFormItem(:label="$t('back.page.maintian.goods.goodsModalForm.intro')" :span=20 prop="note")
          VTextarea
    div(class="float-right w-4/12")
      VUpload(list-type="card" button-label="暂不支持" disabled class="" :default-files="defaultFiles" @click="()=>VMessage.error('暂不支持上传')")    
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { FileOptions, UploadFileOptions } from "vexip-ui/dist/components/upload/symbol.js";
import { loadCategoryTreeDataApi } from "../category/api";
import apis from '~/api/api'
import { stockUpOrDownApi } from "~/api/apis/goods_api";
import { Button, ButtonGroup, Message } from 'vexip-ui';

// goods数据
const goodsList = ref([]);
const isLoading = ref(false);
const current = ref(1);
const size = ref(50);
const total = ref(0);
const modalCategoryOptions = ref([]);
// --是否显示模态框
const modalActive = ref(false);
// 搜索相关
const searchFormModel = ref({});
// 新增或更新商品模态框模型
const upsertGoodsModal = ref({});

// 判断是新增还是修改
const modalModel = ref('新增');
const i18n = useI18n();

///-- 状态条件
const statusOptions = reactive([
  { value: '新建', label: i18n.t('back.page.maintian.goods.goodsStatusEnum.new') },
  { value: '待审核', label: i18n.t('back.page.maintian.goods.goodsStatusEnum.audit') },
  { value: '上架', label: i18n.t('back.page.maintian.goods.goodsStatusEnum.up') },
  { value: '下架', label: i18n.t('back.page.maintian.goods.goodsStatusEnum.down') },
  { value: '禁用', label: i18n.t('back.page.maintian.goods.goodsStatusEnum.disabled') },
])
// 图片
const defaultFiles: UploadFileOptions[] = [
  {
    name: 'vexip-ui.svg',
    url: 'https://www.vexipui.com/vexip-ui.svg',
    status: 'success'
  },
  {
    name: 'vexip-ui.svg',
    url: 'https://www.vexipui.com/vexip-ui.svg',
    status: 'fail'
  },
  {
    name: 'vexip-ui.svg',
    url: 'https://www.vexipui.com/vexip-ui.svg',
    percentage: 66,
    status: 'uploading'
  }
]

/// 模态框加载商品分类数据
const loadCategoryData = () => {
  apis.goodsApi.loadCategoryTreeDataApi().then(res => modalCategoryOptions.value = res.data);
};


///-- 搜索条件
const searchCondition = reactive([{
  name: 'Name', label: 'Name'
}])

// 
const onCurrentChange = (newCurrent: number) => {
  current.value = newCurrent;
  loadData();
}
const onPageSizeChange = (newPageSize: number) => {
  current.value = 1;
  size.value = newPageSize;
  loadData();
}

// 加载数据
const loadData = async () => {
  isLoading.value = true;
  apis.goodsApi.getGoodsMainApi(current.value, size.value, searchFormModel.value).then(res => {
    goodsList.value = [];
    goodsList.value = res.data.records;
    total.value = res.data.total
    size.value = res.data.size
    current.value = res.data.current
  }).finally(() => setTimeout(() => isLoading.value = false, 500))
}

// 新增按钮点击事件
const onAddBtnClick = () => {
  modalModel.value = '新增';
  modalActive.value = true;
}

// 更新或插入商品
const upsertGoods = () => {
  if (modalModel.value === '新增') {
    // 新增
    apis.goodsApi.createGoodsApi(upsertGoodsModal.value).then(res => {
      if (res && res.code && res.code === 2000) {
        VMessage.success(res.message)
      } else {
        VMessage.warning(res.message)
      }
    }).finally(() => loadData())
  } else {
    // 修改
    apis.goodsApi.updateGoodsApi(upsertGoodsModal.value).then(res => {
      if (res && res.code && res.code === 2000) {
        VMessage.success(res.message)
      } else {
        VMessage.warning(res.message)
      }
    }).finally(() => loadData())
  }
}

///上架与下架
const stockUpOrDown = (row: { version: number, id: number, status: string }, operate: string) => {
  ////根据id更新 但是注意要用Version判断数据版本
  const { version } = row;
  if (!version) {
    VMessage.error(`版本信息为空，无法更新`);
    return;
  }
  apis.goodsApi.stockUpOrDownApi(row, operate)
}

// 当树状分类被点击
const onTreeClick = (id: any) => {
  searchFormModel.value.categoryId = id
  loadData();
}
// 表格高度响应式
const { width, height } = useWindowSize()

onMounted(async () => {
  // 从后端加载商品数据
  loadData();
  // 加载分类选项
  loadCategoryData();
})



const columns = [
  { name: '#', key: '#', type: 'selection' },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.category'), key: 'categoryName' },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.name'), key: 'name' },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.innerCode'), key: 'innerCode' },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.isbn'), key: 'isbn' },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.sku'), key: 'sku', width: 120 },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.spu'), key: 'spu', width: 120 },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.status'), key: 'status', width: 90 },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.salePrice'), key: 'salePrice' },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.purchasePrice'), key: 'purchasePrice' },
  { name: i18n.t('back.page.maintian.goods.goodsColumns.intro'), key: 'intro' },
  {
    name: i18n.t('back.page.maintian.goods.goodsColumns.action'), width: 200,
    renderer: (row: any) =>
      h(ButtonGroup, { size: 'small' }, [
        h(Button, {
          size: 'small', simple: true, type: 'primary', text: true,
          onClick: () => stockUpOrDownApi(row.row, 'UP')
        }
          , ['上架']),

        h(Button, {
          size: 'small', simple: true, type: 'primary', text: true,
          onClick: () => stockUpOrDownApi(row.row, 'DOWN')
        }
          , ['下架']),

        h(Button, {
          size: 'small', simple: true, type: 'primary', text: true,
          onClick: () => Message.info('未开发')
        }
          , ['编辑']),

        h(Button, {
          size: 'small', simple: true, type: 'error', text: true,
          onClick: () => apis.goodsApi.deleteGoodsApi(row.row.id).then(res => {
            if (res && res.message) {
              VMessage.success(res.message)
            }
          })
        }
          , ['删除']),
      ])
  },
];
</script>
<style scoped></style>