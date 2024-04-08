
export const userTokenStore = defineStore('token', {
    state: () => ({token: '', expire: Date}),
    getters: {
        getToken: (state) => state.token,
    },
    actions: {
        async setToken(token: string, ttl_in_seconds: number) {
            var date:Date = new Date();
            // 扣除5s是为了避免窗口期
            date.setSeconds(date.getSeconds() + 1000 * (ttl_in_seconds - 5))
            this.token = token;
            // @ts-ignore
            this.expire = date;
        },
    },
    persist: {
        key: 'token', // 修改存储的键名，默认为当前 Store 的 id
        storage:  persistedState.sessionStorage, // 存储位置修改为 sessionStorage
    }
});