import $api from "~/request/request";

const getScoreDetailUrl = 'online_exam_service/markExam/v1/detailScores';
const answerDetailUrl = 'online_exam_service/examAnswer/v1/questionAnswer';

/**
 * 获取得分详情
 * @param recordId
 */
export const getScoreDetailApi = async (recordId: number) =>
    getApi(getScoreDetailUrl, {
        recordId
    }, null);

/**
 * 获取题目作答详情
 * 包含题目内容，选项，用户作答情况，得分情况
 * @param answer
 */
export const answerDetailApi = async (answerId: number) =>
    getApi(answerDetailUrl, {
        answerId
    }, null);
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
