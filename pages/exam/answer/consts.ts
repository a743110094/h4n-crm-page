import {ref} from 'vue'
import dayjs from "dayjs";
// 模式 exam 考试 after-view 考后浏览
export const mode = ref('exam')
///考试id和试卷id和考试记录id
export const examId = ref(1)

// 试卷ID
export const paperId = ref(1)

// 作答记录ID
export const recordId = ref(1111)

// 题量
export const numberOfAllQuestions = ref(100);
export const numberOfFinishedQuestions = ref(56);
export const numberOfUnFinishQuestions = ref(44);
export const numberOfMarkQuestions = ref(2);

// 考试剩余时间 按秒计
export const timeRemainInSeconds = ref(3600);
// 考试剩余时间 按格式输出文本
export const timeRemainFormat = computed(() => `${Math.floor(timeRemainInSeconds.value / 3600)}:${Math.floor((timeRemainInSeconds.value % 3600) / 60)}:${timeRemainInSeconds.value % 60}`)
export const nowTimeInSeconds = ref(3600);
export const nowTimeFormat = computed(() => `${dayjs(nowTimeInSeconds.value * 1000).format('YYYY-MM-DD HH:mm:ss')}`)

// 考试是否已结束
export const examFinished = ref(false);

// 数据正在加载
export const dataIsLoading = ref(false)

// 试卷中所有问题列表
export const questionsList = ref([])

// 当前题目的下标
export const currentQuestionIndex = ref(0);

// 当前展示的问题
export const currentQuestion = ref({});

// 当前问题已选项
export const currentOptions = ref(-1);

// 存储考生的答案
export const answerOptions = ref<any[]>(Array(questionsList.value.length).fill(''));

// 存储考生最新作答的答案 这部分还没有刷库，刷库以后从中会移除
export const tempAnswerOptions = ref<any[]>(Array(questionsList.value.length).fill(''));

// 作答数据存储到localStorage
export const localStorageAnswerOptions = useLocalStorage(`answerOptions-${recordId}`, answerOptions);

// 与服务器连接是否正常
export const connectionSuccess = ref(true)