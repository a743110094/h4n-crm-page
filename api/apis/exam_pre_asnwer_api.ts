import $api from "~/request/request";

/**
 * 获取当前时间
 * @param examId
 * @param paperId
 */
export const getNowTimeApi = async () => getApi('online_exam_service/base/v1/now', {});

/////////////////////////////////////////////////////////////////////////////////////////////////////////公共方法
const getApi = (url: any, params: any) => defaultApi(url, params, null, 5, 'get');
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
