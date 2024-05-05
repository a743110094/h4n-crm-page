import {ref} from 'vue'

export const currentTime = ref(0);
export const examStartTime = ref('');
export const examEndTime = ref('');
/**
 * 考生信息正在加载
 */
export const userInfoIsLoading = ref(true);

/**
 * 考试信息正在加载
 */
export const examInfoIsLoading = ref(true);

/**
 * 判断考试状态
 * 未开始
 * 进行中
 * 已结束
 */
export const calExamStatus = () => {
}