export const userRefreshTokenStore = defineStore('refreshToken', {
    state: () => ({refreshToken: ''}),
    getters: {
        getRefreshToken: (state) => state.refreshToken,
    },
    actions: {
        setRefreshToken(refreshToken: string) {
            this.refreshToken = refreshToken;
        },
    },
    persist: {
        key: 'refreshToken', // 修改存储的键名，默认为当前 Store 的 id
        storage: persistedState.localStorage, // 存储位置修改为 sessionStorage
    }
});