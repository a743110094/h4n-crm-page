import { enabledStockBatchApi } from "./api"
import { stockTable } from "./consts"

export const onAddBtnClick = ()=>{
    VMessage.info(`onAddBtnClick ${stockTable.value?.getSelected()}`)
 }

export const onDisabledBtnClick = ()=>{
   VMessage.info(`onDisabledBtnClick ${stockTable.value?.getSelected()}`)
}

export const onEnableBtnClick = ()=>{
    VMessage.info(`onDisabledBtnClick ${stockTable.value?.getSelected()}`)
    //
    const selectedRows = stockTable.value?.getSelected() || [];
    const body = selectedRows.map(e=>{
       return {id:e.id,version:e.version}
    })
    enabledStockBatchApi(body)
 }