<script setup lang="ts">

import $api from "~/request/request";
import {userTokenStore} from "~/stores/token";

const form = reactive({
  account: undefined,
  password: undefined,
});
const login = () => {

}
const loading = ref(false);
// 使用
const config = useRuntimeConfig();
const r = useRouter();
 
const onClickLoginBtn = () => {

  loginApi(form).then(res=>{
    if (res.data && res.code === 2000 && res.token){
      VMessage.success(`登录成功`)
      // 记录Token
      userTokenStore().setToken(res.token,7200);
      config.apiKey = `Bearer ${res.token}`;
      r.push('back/order')
    }else{
      VMessage.warning(`${res.message}`)
    }
  })
}

const loginApi = (body) => $api('user_service/auth/loginIntranet', {body: body,method:'post'})

</script>

<template>
  <ThemeProvider :color="{ middle: { 'bg-base': '#fff' }, primary: { DEFAULT: '#1896ff' } }">
    <div class="login-box rounded-sm">
      <VForm
          :model="form"
          :wrapperCol="{ span: 24 }"
          @finish="login"
          class="login-form w-[400px] p-lg xl:w-[440px] xl:p-xl h-fit text-text"
      >
        <div class="third-platform">
          <div class="third-list flex text-[28px]">
            <WechatOutlined class="icon wechat flex-1 cursor-pointer text-gray-400 hover:text-green-600"/>
            <TwitterOutlined class="icon twitter flex-1 cursor-pointer text-gray-400 hover:text-blue-400"/>
            <QqOutlined class="icon qq flex-1 cursor-pointer text-gray-400 hover:text-red-600"/>
          </div>
        </div>
        <VDivider>Or</VDivider>
        <VFormItem :required="true" name="username">
          <VInput
              v-model:value="form.account"
              autocomplete="new-username"
              placeholder="请输入用户名或邮箱: admin"
              class="login-input h-[40px]"
          />
        </VFormItem>
        <VFormItem :required="true" name="password">
          <VInput
              v-model:value="form.password"
              autocomplete="new-password"
              placeholder="请输入登录密码: 888888"
              class="login-input h-[40px]"
              type="password"
          />
        </VFormItem>
        <VButton class="h-[40px]  w-full" type="primary" :loading="loading" ghost @click="onClickLoginBtn"> 登录
        </VButton>
        <VDivider/>
        <div class="terms">
          <span class="text-xs">Cookie 使用协议</span>
        </div>
      </VForm>
      
    </div> 
  </ThemeProvider>
 
</template>

<style scoped lang="less">

</style>