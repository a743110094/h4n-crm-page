import $api from "~/request/request";

const toAnswerPageUrl = 'online_exam_service/preAnswer/v1/examPage';

/**
 * 跳转至答题页面
 * @param recordId
 */
export const toAnswerPageApi = async (recordId: number) =>
    getApi(toAnswerPageUrl, {
        recordId
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
