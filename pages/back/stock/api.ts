import url from "~/api/url";
import $api from "~/request/request";

// Retry failed requests 3 times
const retry = ref(3);
const getStockByPageApi = async (page: number, size: number, body: any) => $api(
    url.stock.getStockByPageUrl,
    {
        query: {
            page: page ,
            size: size ,
        },
        body: body||{},
        retry: retry.value,
        retryDelay: 200, // Milliseconds
        method: "post"
    }
)

const enabledStockBatchApi = async (body: any) => $api(
    url.stock.getStockByPageUrl,
    {
        body: body||{},
        retry: retry.value,
        retryDelay: 200, // Milliseconds
        method: "post"
    }
)


export { getStockByPageApi ,enabledStockBatchApi }