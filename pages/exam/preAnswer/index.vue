<template lang="html">
  <!--    考试界面-->
  <div class="flex-container">
    <!--    ---------------------------------------- 左侧部分 --------------------------------------------  -->
    <div v-cloak class="container-left">
      <div class="user-info">
        <pre-exam-user-info/>
      </div>

      <div v-cloak class="exam-info">
        <pre-exam-exam-info/>
      </div>
    </div>
    <!--    ---------------------------------------- 左侧部分 --------------------------------------------  -->

    <!--    ---------------------------------------- 右侧部分 --------------------------------------------  -->
    <div class="container-right">
      <pre-exam-notice/>
    </div>
    <!--    ---------------------------------------- 右侧部分 --------------------------------------------  -->
  </div>

</template>


<script setup lang="ts">
import {getNowTimeApi} from "~/api/apis/exam_pre_asnwer_api";
import {currentTime, examStartTime} from "~/pages/exam/preAnswer/indexx";
import {defineAsyncComponent} from 'vue';

const PreExamExamInfo = defineAsyncComponent(() =>
    import("~/pages/exam/preAnswer/component/PreExamExamInfo")
)
const PreExamUserInfo = defineAsyncComponent(() =>
    import("~/pages/exam/preAnswer/component/PreExamUserInfo")
)
const PreExamNotice = defineAsyncComponent(() =>
    import("~/pages/exam/preAnswer/component/PreExamNotice")
)


examStartTime.value = '2024-04-15 13:45:29';


onMounted(async () => {
  /**
   * 获取当前时间
   */
  const getNowTime = async () => {
    const res = await getNowTimeApi();
    if (!res || !res.data) {
      VMessage.error(`获取时间失败，无法开始考试，请刷新重试`)
      throw new Error(`获取时间失败，无法开始考试，请刷新重试`)
    }
    //设置当前时间
    currentTime.value = res.data
    //定时器启动
    useIntervalFn(() => {
      currentTime.value++
    }, 1000)
  }
  await getNowTime();
})

definePageMeta({
  layout: 'exam'
})

</script>
<style>
.flex-container {
  display: flex;
  flex-direction: row;
}

.container-left {
  width: 340px;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 90vh;
}

.container-right {
  flex: auto;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 90vh;

}

</style>