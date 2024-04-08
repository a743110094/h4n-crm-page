import {
    createCategoryApi,
    deleteCategoryApi,
    loadCategoryTreeDataApi,
    updateCategoryApi
} from "~/pages/back/category/api";
import {categoryTable, currentRow, data, dataIsLoading, formModel, modalActive, modalCategoryOptions, modalModel} from "./consts";


// 加载分类数据
export const loadCategoryData = () => {
    dataIsLoading.value = true;
    data.value = [];
    loadCategoryTreeDataApi().then(res => {
        data.value = res.data;
        modalCategoryOptions.value = res.data;
    }).finally(()=>setTimeout(()=> dataIsLoading.value = false ,500))
    ;
};


// 删除分类
export const onDeleteBtnClick = () => {
    const selectedRows = categoryTable.value?.getSelected() || [];
    if (selectedRows.length === 0) {
        VMessage.error('请勾选数据');
        return;
    }
    if (selectedRows.length > 200) {
        VMessage.error('勾选数据过多');
        return;
    }
    deleteCategoryApi(selectedRows.map(e => e.id)).then(res => {
        VMessage.info(res.message);
        loadCategoryData();
    });
};

// 新增分类
export const onAddBtnClick = () => {
    modalModel.value = '新增';
    formModel.value = {};
    modalActive.value = true;
};

// 修改分类
export const onEditBtnClick = () => {
    modalModel.value = '修改';
    formModel.value = {...currentRow.value};
    modalActive.value = true;
};

// 保存分类数据
export const upsertCategory = () => {
    if (modalModel.value === '新增') {
        // @ts-ignore
        formModel.value.id = null;
        createCategoryApi(formModel.value).then((res) => {
            VMessage.info(res.message);
            loadCategoryData();
        });
    } else {
        updateCategoryApi(formModel.value).then((res) => {
            VMessage.info(res.message);
            loadCategoryData();
        });
    }
};