import $api from "~/request/request";

/**
 * 加载某次考试 某张试卷的所有试题信息
 * 请注意：不包含选项
 * @param examId
 * @param paperId
 */
export const loadPaperQuestion = async (recordId: number, examId: number, paperId: number) =>
    postApi('online_exam_service/examPaper/v1/getExamPaper', {
        recordId,examId, paperId
    }, {});

/**
 * 加载某次考试 某张试卷指定试题的选项
 *
 * @param examId
 * @param paperId
 */
export const loadQuestionOptions = async (recordId: number, examId: number, paperId: number, questionIdArray: []) =>
    postApi('online_exam_service/examPaper/v1/getExamPaperQuestionOptionsBatch', {}, {
        recordId:recordId,
        examId: examId,
        paperId: paperId,
        questions: questionIdArray
    });

/**
 *  作答一道题目
 * @param examId
 * @param paperId
 * @param recordId
 * @param questionId
 * @param optionId
 * @param userAnswerText
 */
export const answerQuestionApi = async (examId: number, paperId: number, recordId: number, questionId: number, optionId: number, userAnswerText: string) =>
    postApi('online_exam_service/examAnswer/v1/answerQuestion', {}, {
        examId: examId,
        paperId: paperId,
        recordId: recordId,
        questionId: questionId,
        optionId: optionId,
        userAnswerText: userAnswerText
    });

/**
 *  作答若干道题目
 * @param examId
 * @param paperId
 * @param recordId
 * @param questionId
 * @param optionId
 * @param userAnswerText
 */
export const answerQuestionBatchApi = async (examId: number, paperId: number, recordsId: number, answers: any[]) =>
    postApi('online_exam_service/examAnswer/v1/answerQuestionBatchAsync', {}, {
        examId: examId,
        paperId: paperId,
        recordsId: recordsId,
        answers: answers
    });

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
