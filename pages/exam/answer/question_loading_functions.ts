import {currentOptions, currentQuestion, currentQuestionIndex, questionsList} from "./consts";

/**
 * 下一题
 * */
export const nextQuestion = () => {
    if (currentQuestionIndex.value < questionsList.value.length - 1) {
        currentQuestionIndex.value++;
        currentQuestion.value = questionsList.value[currentQuestionIndex.value];
        currentOptions.value = null;
        loadAnsweredOptions();
        // 如果下一题选项为空 加载
        if (!questionsList.value[Math.min(currentQuestionIndex.value + 1, questionsList.value.length - 1)].options) {
            loadOptionsBatch()
        }
    }
};

/**
 * 上一题
 * */
export const prevQuestion = () => {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
        currentQuestion.value = questionsList.value[currentQuestionIndex.value];
        currentOptions.value = null;
        loadAnsweredOptions();
        // 如果下一题选项为空 加载
        if (!questionsList.value[Math.min(currentQuestionIndex.value + 1, questionsList.value.length - 1)].options) {
            loadOptionsBatch()
        }
    }
};

/**
 * 跳转到任意题目
 * */
export const toAnyQuestion = (targetIndex: number) => {
    if (targetIndex >= 0 && targetIndex < questionsList.value.length) {
        currentQuestionIndex.value = targetIndex;
        currentQuestion.value = questionsList.value[currentQuestionIndex.value];
        currentOptions.value = null;
        loadAnsweredOptions();
        // 如果本题或下一题题选项为空 加载
        if (
            !questionsList.value[currentQuestionIndex.value].options ||
            !questionsList.value[Math.min(currentQuestionIndex.value + 1, questionsList.value.length - 1)].options
        ) {
            loadOptionsBatch()
        }
    }
};

/**
 * 以当前的题目为起点，向后加载N个题目的选项
 * */
const loadOptionsBatch = () => {
    dataIsLoading.value = true
    let n = 20; // n不要小于3 否则分步加载意义不大 建议5-10
    const questionIdArray = [];
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
    loadQuestionOptions(examId, paperId, questionIdArray).then(res => {
        if (res.data?.questionOptionsMap) {
            const questionOptionsMap = res.data.questionOptionsMap;
            questionsList.value.forEach(item => {
                if (questionOptionsMap[item.questionId]) {
                    // 乱序选项
                    item.options = shuffle(questionOptionsMap[item.questionId])
                }
            })
        }
    }).finally(() => useTimeoutFn(() => dataIsLoading.value = false, 300))
    // 确定需要加载的题目id

}

/**
 * 加载已经作答过的题目 已选项
 * 比如 切换到第二题时，第二题已作答，需要在界面体现
 */
const loadAnsweredOptions = () => {
    const storageAnswerOptions = localStorageAnswerOptions.value;
    const find = storageAnswerOptions.find(e => e.questionId === currentQuestion.value.questionId);
    if (find) {
        // 已经作答过了
        currentOptions.value = find.optionId
    }


}