<script setup lang="ts">
import { Button, ButtonGroup, Message, Tag, buttonGroupProps } from 'vexip-ui';
import $api from '~/request/request'


///////
const tableData = ref([]);
const isLoading = ref(false);
const current = ref(1);
const size = ref(20);
const total = ref(0);
const searchModel = ref({});
const { width, height: tableHeight } = useWindowSize()
const i18n = useI18n();

const columns = [
    { name: '#', key: '#', type: 'selection', fixed: true },
    { name: i18n.t('back.page.maintian.order.orderColumns.orderNo'), key: 'orderNo', width: 160, fixed: true },
    { name: i18n.t('back.page.maintian.order.orderColumns.name'), key: 'name' },
    { name: i18n.t('back.page.maintian.order.orderColumns.memberName'), key: 'memberName' },
    { name: i18n.t('back.page.maintian.order.orderColumns.createTime'), key: 'createTime', width: 150 },
    { name: i18n.t('back.page.maintian.order.orderColumns.payNo'), key: 'payNo', width: 160 },
    { name: i18n.t('back.page.maintian.order.orderColumns.payTime'), key: 'payTime', width: 150 },
    { name: i18n.t('back.page.maintian.order.orderColumns.payType'), key: 'payType', width: 75 },
    {
        name: i18n.t('back.page.maintian.order.orderColumns.status'), key: 'status', width: 80,
        renderer: (row: any) => h(
            Tag, { border: true, type: 'success', size: 'small' }, [row.row.status]
        )

    },
    {
        name: i18n.t('back.page.maintian.order.orderColumns.action'), width: 180,
        renderer: (row: any) =>
            h(ButtonGroup, { size: 'small' }, [
                h(Button, {
                    size: 'small', simple: true, type: 'primary', text: true,
                    onClick: () => loadLineData(row.row.id)
                }
                    , [i18n.t('back.page.maintian.order.orderColumns.detailBtn')]),

                h(Button, {
                    size: 'small', simple: true, type: 'error', text: true,
                    onClick: () => cancelOrder(row.row.id)
                }
                    , [i18n.t('back.page.maintian.order.orderColumns.cancleBtn')])
            ])
    },
]
const showModal = ref(false)
const modalTableData = ref([]);
const modalTableIsLoading = ref(true);

const modalTableColumns = [
/*     { name: '订单号', key: 'orderNo', width: 160, fixed: true },
 */    { name: '序号', key: 'lineNo', width: 60, fixed: true },
    { name: '商品名称', key: 'goodsName' },
    { name: '单价', key: 'unitPrice', width: 80 },
    { name: '数量', key: 'qty', width: 80 },
    { name: '总价', key: 'totalPrice', width: 90 },
    { name: '备注', key: 'note', width: 140 }]


const statusOptions = [{ value: 10, label: i18n.t('back.page.maintian.order.statusOptions.create') }]
onMounted(() => {
    setTimeout(() => loadData(), 0)
})

const loadData = () => {
    isLoading.value = true;
    getByPageApi(current.value, size.value, searchModel.value)
        .then(r => {
            tableData.value = r.data.records
            current.value = r.data.current
            total.value = r.data.total
            size.value = r.data.size
        })
        .finally(() => setTimeout(() => isLoading.value = false, 400))
}
const loadLineData = (headerId: number) => {
    modalTableIsLoading.value = true;
    modalTableData.value = []
    showModal.value = true;
    getLineByHeaderIdApi(headerId)
        .then(r => modalTableData.value = r.data)
        .finally(() => setTimeout(() => modalTableIsLoading.value = false, 400))
}

const refreshMpdalTableStyle = () => { }
//// API
const getByPageApi = (page: number, size: number, body: any) => {
    return $api(`order_service/base/v1/getByPage?page=${page || 1}&size=${size || 20}`, {
        method: 'post',
        body: body
    }).then(res => {
        if (res.code && res.code === 2000) {
            return res;
        }
        VMessage.warning(`${res.message}`)
    })
}

const getLineByHeaderIdApi = (headerId: Number) => {
    return $api(`order_service/detail/v1/getByHeaderId?headerId=${headerId}`, {
        method: 'get'
    }).then(res => {
        if (res.code && res.code === 2000) {
            return res;
        }
        VMessage.warning(`${res.message}`)
    })
}

const cancelOrder = (orderId: number) => {
    return $api(`order_service/base/v1/cancelOrder`, {
        method: 'post',
        body: {
            orderId: orderId
        }
    }).then(res => {
        if (res.code && res.code === 2000) {
            return res;
        }
        VMessage.warning(`${res.message}`)
    })
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
const config = useRuntimeConfig();
const tttttt = process.env.NUXT_API_KEY
</script>

<template lang="pug">
VRow
    VColumn(:span="24")
        VH4( marker aligned marker-type="primary") {{$t('back.page.maintian.order.title')}} 
VRow 
    VColumn(:span="24")   
        VForm(:model="searchModel" label-align="left" inline)
            VFormItem(:label="$t('back.page.maintian.order.searchForm.orderNo')" prop="orderNo")
                VInput(size="small" type="number")
            VFormItem(:label="$t('back.page.maintian.order.searchForm.status')" prop="status")
                VSelect(size="small" :options="statusOptions" clearable)
            VFormItem
                VButton(@click="loadData()" size="small" simple) {{$t('back.page.maintian.order.searchForm.searchBtn')}}
VRow
    VColumn(:span="24")        
        VButtonGroup
            VButton(@click="onAddBtnClick" size="small" simple type="success") {{$t('back.page.maintian.order.addBtn')}}
            VButton(@click="onDeleteBtnClick" size="small" simple type="error") {{$t('back.page.maintian.order.deleteBtn')}}
VRow(class="mt-4")
    VColumn(:span="24")
        // -- 表格相关 
        VSpin(:active="isLoading" tip="Loading..." delay)
            VTable(:columns="columns" stripe border highlight virtual ellipsis use-y-bar use-x-bar :data="tableData" :height="tableHeight > 600 ? tableHeight - 300 : 300 ")/
            div(class="relative w-full mt-4")
                VPagination(@page-size-change="onPageSizeChange" @change="onCurrentChange" :disabled="isLoading" 
                    :total="total" :page-size="size" :active="current" :plugins="['total', 'size']")/

VModal(v-model:active="showModal" modal-style="min-width: 900px;" @show="refreshMpdalTableStyle")
    VSpin(:active="modalTableIsLoading" tip="订单详情加载中...")
        VTable(ref="modalTable" :columns="modalTableColumns" :data="modalTableData" 
        width="100%" use-y-bar :height="tableHeight/2" virtual)              
</template>

<style scoped></style>