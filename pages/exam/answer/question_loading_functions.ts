import {
    currentOptions,
    currentQuestion,
    currentQuestionIndex,
    dataIsLoading,
    examId,
    localStorageAnswerOptions,
    paperId,
    questionsList,
    recordId
} from "./consts";

import {loadPaperQuestion, loadQuestionOptions} from "~/api/apis/exam_eaxm_asnwer_api";
import $api from "~/request/request";

const getTimeRemainInSecondUrl = `online_exam_service/base/v1/now`;
const submitPaperUrl = `online_exam_service/examAnswer/v1/submitAsync`;
////////// ---------------------------- 题目加载部分逻辑 ----------------------------
/**
 * 下一题
 * */
export const nextQuestion = async () => {
    if (currentQuestionIndex.value < questionsList.value.length - 1) {
        currentQuestionIndex.value++;
        await toAnyQuestion(currentQuestionIndex.value)
    }
};

/**
 * 上一题
 * */
export const prevQuestion = async () => {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
        await toAnyQuestion(currentQuestionIndex.value)
    }
};

/**
 * 跳转到任意题目
 * */
export const toAnyQuestion = async (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < questionsList.value.length) {
        currentQuestionIndex.value = targetIndex;
        currentQuestion.value = questionsList.value[currentQuestionIndex.value];
        currentOptions.value = null;
        if (currentQuestion.value && currentQuestion.value.options && currentQuestion.value.options.length > 1) {
            currentQuestion.value.options = shuffle(currentQuestion.value.options)
        }
        loadAnsweredOptions();
        // 如果本题或下一题题选项为空 加载
        if (
            !questionsList.value[currentQuestionIndex.value].options ||
            !questionsList.value[Math.min(currentQuestionIndex.value + 1, questionsList.value.length - 1)].options
        ) {
            await loadOptionsBatch()
        }
    }
};

/**
 * 以当前的题目为起点，向后加载N个题目的选项
 * */
export const loadOptionsBatch = async () => {
    dataIsLoading.value = true
    let n = 20; // n不要小于3 否则分步加载意义不大 建议5-10
    const questionIdArray: any[] = [];
    // 确定需要加载的题目id
    for (let index = currentQuestionIndex.value; index < questionsList.value.length && n > 0; index++) {
        if (questionsList.value[index].questionId && !questionsList.value[index].options) {
            questionIdArray.push(questionsList.value[index].questionId);
        }
        n--
    }
    console.log(`加载:${questionIdArray}`)

    if (questionIdArray.length < 1) return;

    // 确定需要加载的题目id
    try {
        const res = await loadQuestionOptions(recordId.value, examId.value, paperId.value, questionIdArray);
        if (res.data?.questionOptionsMap) {
            const questionOptionsMap = res.data.questionOptionsMap;
            questionsList.value.forEach(item => {
                if (questionOptionsMap[item.questionId]) {
                    // 乱序选项
                    item.options = questionOptionsMap[item.questionId]
                    //item.options = shuffle(questionOptionsMap[item.questionId])
                }
            })
        } else {
            VMessage.error(`加载选项失败`)
        }
    } catch (e) {
        VMessage.error(`加载选项出错${e}`)
    } finally {
        useTimeoutFn(() => dataIsLoading.value = false, 300)
    }
}

/**
 * 加载已经作答过的题目 已选项
 * 比如 切换到第二题时，第二题已作答，需要在界面体现
 */
export const loadAnsweredOptions = () => {
    const storageAnswerOptions = localStorageAnswerOptions.value;
    const find = storageAnswerOptions.find(e => e.questionId === currentQuestion.value.questionId);
    if (find) {
        // 已经作答过了 把已选的答案标记在界面上
        currentOptions.value = find.optionId
    }
}


export const initFun = async () => {
    try {
        dataIsLoading.value = true;
        // 加载试题
        const res = await loadPaperQuestion(recordId.value, examId.value, paperId.value);
        if (!res || !res.data || !res.data.questions) {
            VMessage.error(`加载试题失败`)
            throw new Error('加载试题失败');
        }
        let qArray = res.data.questions;
        // 乱序题目
        qArray = shuffle(qArray);
        questionsList.value = qArray;
        // 设定当前需要展示的题目----------
        if (questionsList.value.length > currentQuestionIndex.value - 1) {
            currentQuestion.value = questionsList.value[currentQuestionIndex.value];
        } else {
            currentQuestionIndex.value = 0
            currentQuestion.value = {};
        }
        //--设定当前需要展示的题目----------
        /**
         * 加载选项
         */
        await loadOptionsBatch()
    } catch (error) {
        // 处理加载过程中的错误
        console.error('加载试题或选项出错,请重试：', error);
    } finally {
        dataIsLoading.value = false;
    }
}

/**
 * 获取考试剩余时间
 */
export const getTimeRemainInSecondApi = () => getApi(getTimeRemainInSecondUrl, null, null)

/**
 * 提交试卷
 * @param recordId
 */
export const submitPaperApi = (recordId: number) => postApi(submitPaperUrl, {recordId}, null)

////////// ---------------------------- 题目加载部分逻辑 ----------------------------
// ------ 洗牌算法 用于打乱选项和题目
export function shuffle<T>(arr: T[]) {
    let l: number = arr.length;
    let index, temp;
    while (l > 0) {
        swap(l - 1)
        l--
    }
    return arr;

    // 交换数组中两个对象的顺序
    function swap(index: number) {
        const toIndex = Math.floor(Math.random() * Math.random() * l)
        temp = arr[index]
        arr[index] = arr[toIndex]
        arr[toIndex] = temp
    }
}

// ------ 洗牌算法 用于打乱选项和题目

/////////////////////////////////////////////////////////////////////////////////////////////////////////公共方法
const getApi = (url: any, params: any, body: any) => defaultApi(url, params, body, 5, 'get');
const postApi = (url: any, params: any, body: any) => defaultApi(url, params, body, 5, 'post');
const defaultApi = (url: any, params: any, body: any, retry: number, method: any) =>
    $api(url, {
        body: body,
        method: method,
        retry: retry,
        retryDelay: 200, // Milliseconds
        query: params
    }).then(res => {
        if (res && res.code === 2000) {
            return res;
        }
        const errMsg = res?.message;
        VMessage.warning(`Fetch Warning:${errMsg}`)
    }).catch((err) => VMessage.error(`Fetch Error:${err}`))
;
/////////////////////////////////////////////////////////////////////////////////////////////////////////公共方法