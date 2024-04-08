// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    devtools: {
        enabled: true,
        timeline: {
            enabled: true
        }
    },
    modules: [
        "@pinia/nuxt",
        "@nuxtjs/i18n",
        "@nuxtjs/tailwindcss",
        "@vueuse/nuxt",
        "nuxt-icon",
        "nuxt-api-party",
        "@vexip-ui/nuxt",
        "@pinia-plugin-persistedstate/nuxt",
    ],
    vexipUI: {
        importDarkTheme: true
    },
    i18n: {
        lazy: true,
        locales: [
            { code: "zh", name: "🇨🇳中文", file: "zh.json" },
            { code: "en", name: "🇬🇧 English", file: "en.json" },
            { code: "kr", name: "🇰🇷 대한민국", file: "kr.json" },
            { code: "jp", name: "🇯🇵 にほんこく", file: "jp.json" },
            { code: "kp", name: "🇰🇵 조선민주주의인민공화국", file: "kp.json" },
        ],
        detectBrowserLanguage: false,//是否要自动检测用户浏览器的语言设置
        defaultLocale: 'zh',//默认语言
        langDir: "locales/", //语言文件夹，放在根目录下面
        experimental: {

        }
    },
    apiParty: {
        endpoints: {
            realApi: {
                url: 'http://127.0.0.1:888/api',
            }
            /* goodsApi: {
                // url: process.env.JSON_PLACEHOLDER_API_BASE_URL!,
                url: `http://127.0.0.1:888/api/goods_service`,
                // Global headers sent with each request
            },
            userApi: {
                // url: process.env.JSON_PLACEHOLDER_API_BASE_URL!,
                url: 'http://127.0.0.1:888/api/user_service'
                // Global headers sent with each request
            },
            stockApi: {
                // url: process.env.JSON_PLACEHOLDER_API_BASE_URL!,
                url: 'http://127.0.0.1:888/api/stock_service'
                // Global headers sent with each request

            }, orderApi: {
                // url: process.env.JSON_PLACEHOLDER_API_BASE_URL!,
                url: 'http://127.0.0.1:888/api/order_service'
                // Global headers sent with each request
            } */
        }
    },
    runtimeConfig: {
        apiKey: process.env.NUXT_API_KEY, // Default to an empty string, automatically set at runtime using process.env.NUXT_API_KEY
        public: {
            baseURL: process.env.NUXT_PUBLIC_BASE_URL // Exposed to the frontend as well.
        }
    },


})
