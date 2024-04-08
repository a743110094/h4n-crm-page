// 表格列定义
import type { TableExposed } from "vexip-ui";



export const data = ref([]);

// 当前鼠标所在行
export const currentRow = ref({});
export const modalActive = ref(false);
export const modalModel = ref('新增');
export const modalCategoryOptions = ref([]);
export const categoryTable = ref<TableExposed>();
export const formModel = ref({});
export const dataIsLoading = ref(false);