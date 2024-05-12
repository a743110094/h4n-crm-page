<template lang="html">
  <!--    考试界面-->
  <div v-cloak class="flex-container" v-if="!examFinished">
    <!--    ---------------------------------------- 左侧部分 --------------------------------------------  -->
    <div class="container-left">
      <LazyVH6 marker aligned marker-type="primary" @click="releaseLock">
        期末考试
      </LazyVH6>
      <div>题量：{{ numberOfAllQuestions }}</div>
      <div>完成题目：{{ numberOfFinishedQuestions }}</div>
      <div>剩余题目：{{ numberOfUnFinishQuestions }}</div>
      <div>标记题目：{{ numberOfMarkQuestions }}</div>
      <div>进度：</div>
      <LazyVProgress activated :percentage="numberOfFinishedQuestions/numberOfAllQuestions *100"></LazyVProgress>
      <div style="font-weight: bold;line-height: 50px;">
        当前时间：{{ nowTimeFormat }}
      </div>
      <div style="font-weight: bold;line-height: 30px;"
           v-bind:style=" timeRemainInSeconds < 60 * 15 ? 'color: red;font-size:16px;':''"
           v-bind:class=" timeRemainInSeconds < 60 * 15 ? 'animate-bounce':''">
        <!--        剩余时间格式化显示-->
        剩余时间：{{ timeRemainFormat }}
        <!--        剩余时间格式化显示-->
      </div>
      <LazyVH6 marker aligned marker-type="primary" @click="releaseLock">
        题目选区
      </LazyVH6>
      <div class="questionMenu mt-4 border-2 pl-6 pt-2 pb-2">
        <!--      目标标号导航-->
        <LazyVRadioGroup shape="button"
                         class="flex flex-wrap max-h-[180px] min-h-[70px] overflow-auto"
                         :value="(currentQuestionIndex + 1)">
          <LazyVRadio v-for="(q, index) in questionsList" :key="index" :label="index + 1" :value="q.questionId"
                      class="w-[35px] my-[4px] w-[38px] justify-center
                  transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-.5 -translate-x-.5 hover:scale-110 hover:bg-indigo-500 duration-300"
                      v-bind:style="answerOptions.map(e=>e.questionId).findIndex(e=>e === q.questionId) >=0 && index!==currentQuestionIndex ? 'background-color:#20c997':''"
                      size="small"
                      @click="index === currentQuestionIndex ? {} : toAnyQuestion(index)"/>
          <!--如果要跳转的index与当前index相同，则不需要调用 2. style 是已完成改为绿色-->
        </LazyVRadioGroup>
        <!--      目标标号导航-->
        <div v-if="questionsList && questionsList.length > 0"
             class="flex items-center space-x-2 font-sans text-sm float-right mt-4 mr-2">
          <div class="flex items-center">
            <div class="w-4 h-4 mr-2 bg-[#20c997] border-2"></div>
            <div>已作答</div>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 mr-2 bg-[#ffffff] border-2"></div>
            <div>未作答</div>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 mr-2 bg-[#ff8c00] border-2"></div>
            <div>标记</div>
          </div>
        </div>
      </div>
      <div class="tools h-[24px] mt-12 mr-2">
        <div class="float-right">
          <div v-if="connectionSuccess">
            <LazyVBadge class="animate-pulse w-4" is-dot type="success"/>
            <span class="text-green-600 text-sm font-black">与服务器通信正常</span>
          </div>
          <div class="animate-bounce" v-else>
            <LazyVBadge class="w-4" is-dot type="error"/>
            <span class="text-red-600 text-base font-black">与服务器断开连接</span>
          </div>
        </div>
      </div>
      <div class="h-[44px] mt-4 mx-2">
        <LazyVButton type="primary" class="w-full" @click="confirmSubmit">交卷</LazyVButton>
      </div>
    </div>
    <!--    ---------------------------------------- 左侧部分 --------------------------------------------  -->

    <!--    ---------------------------------------- 右侧部分 --------------------------------------------  -->
    <div class="container-right" v-loading="dataIsLoading">
      <!--      加载过渡动画-->
      <div class="h-full" v-if="pageIsLoading">
        <LazyExamLoadingSvg/>
      </div>
      <div class="h-full" v-if="!pageIsLoading">
        <lazy-exam-question-panel v-if="!dataIsLoading" :on-user-option-change="answerTheQuestion"/>
        <!--      遮罩，遮住选项使其不可点击-->
        <div class="overlay" v-if="mode!='exam'"/>
        <div class="navigation">
          <LazyVButton @click="prevQuestion" :disabled="currentQuestionIndex === 0"> 上一题</LazyVButton>
          <LazyVButton @click="nextQuestion" :disabled="currentQuestionIndex === questionsList.length - 1">下一题
          </LazyVButton>
        </div>
      </div>
    </div>
    <!--    ---------------------------------------- 右侧部分 --------------------------------------------  -->
  </div>
  <div v-cloak v-else class="bg-gray-100 flex justify-center items-center h-screen">
    <div class="text-center">
      <LazyVResult class="mb-8" type="success" size="large"/>
      <h1 class="text-3xl font-semibold text-gray-800 mb-4">考试已结束</h1>
      <p class="text-lg text-gray-600 mb-8">感谢您的参与，请点击下方按钮返回主页。</p>
      <a href="/" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">返回主页</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {answerQuestionBatchApi} from "~/api/apis/exam_eaxm_asnwer_api";
import {
  answerOptions,
  connectionSuccess,
  currentOptions,
  currentQuestionIndex,
  dataIsLoading,
  examFinished,
  examId,
  localStorageAnswerOptions,
  mode,
  nowTimeFormat,
  nowTimeInSeconds,
  numberOfAllQuestions,
  numberOfFinishedQuestions,
  numberOfMarkQuestions,
  numberOfUnFinishQuestions,
  paperId,
  questionsList,
  recordId,
  tempAnswerOptions,
  timeRemainFormat,
  timeRemainInSeconds
} from "./consts";
import {
  getTimeRemainInSecondApi,
  initFun,
  nextQuestion,
  prevQuestion, submitPaperApi,
  toAnyQuestion
} from "./question_loading_functions";

const pageIsLoading = ref(true);

////////// ---------------------------- 作答部分逻辑 ----------------------------

/**
 * 作答
 * 只能用于单选题 因为限制了opId必须非空
 * @param qId 问题id
 * @param opId 答案id 客观题适用
 * @param ansText 用户作答数据 主观题适用
 **/
const answerTheQuestion = (qId: number, opId: number, ansText: string) => {
  getLock(() => {
    if (!qId) {
      VMessage.error(`作答失败，问题id为空`);
      releaseLock();
      currentOptions.value = null;
      return
    }
    if (!opId) {
      VMessage.error(`作答失败，选项id为空`);
      releaseLock();
      currentOptions.value = null;
      return
    }

    const answerData = {questionId: qId, optionId: opId, userAnswerText: ansText};
    // === 1. 保存作答数据到缓冲区 等待上传服务器
    const number = tempAnswerOptions.value.findIndex(e => e.questionId === qId);
    if (number > -1) {
      tempAnswerOptions.value.splice(number, 1);
    }
    tempAnswerOptions.value.push(answerData)

    // === 2. 更新或新增用户作答数据
    const answerIndex = answerOptions.value.findIndex(e => e.questionId === qId);
    // 删除已存在答案
    if (answerIndex > -1) {
      answerOptions.value.splice(answerIndex, 1);
    }
    // 保存作答数据
    answerOptions.value.push(answerData)

    // === 3. 存入localStorage
    handleAnswerChange();
    releaseLock();
  })
}

/**
 * 题目作答后修正作答数据并存入localStorage
 **/
const handleAnswerChange = () => {
  localStorageAnswerOptions.value = answerOptions.value; // 更新localStorage中的数据
};


/**
 * 定时刷新作答数据道后台
 * 每隔 若干 秒触发一次保存到后台的逻辑
 * 改 useIntervalFn 的第二个参数即可 单位是毫秒
 * 保存时间有个5s的随机提前或延后，目的是削峰 平流
 * 也就是说 异步保存到后台是25 - 35s一次
 **/
const {pause: pauseUpload, resume: resumeUpload} = useIntervalFn(() => saveAnswerDataToBackend(tempAnswerOptions.value),
    6_000 + Math.random() * 5_000 * (Math.random() - 0.5), {immediate: true})

/**
 * 保存作答数据到后台
 * @param answers
 **/
const saveAnswerDataToBackend = async (answers: string[]) => {
  if (tempAnswerOptions.value.length > 0) {
    if (examId.value && paperId.value && recordId.value && tempAnswerOptions.value) {
      //VMessage.success(`保存数据到后台`)
      getLock(async () => {
        // 调用后台接口保存作答数据
        const res = await answerQuestionBatchApi(examId.value, paperId.value, recordId.value, tempAnswerOptions.value);
        if (!res || !res.code || res.code !== 2000) {
          VMessage.error(`保存数据到后台失败`)
          releaseLock();
          throw new Error('保存数据到后台失败');
        }
        // 清空缓存区域
        tempAnswerOptions.value = [];
        releaseLock();
      })
    }
  }
  console.log('Saving answers to backend:', answers);
  return;
};
const confirmSubmit = async () => {
  const isConfirm = await VConfirm.open({
    content: `距离考试时间还剩${timeRemainFormat.value}，确定要提交吗？`,
    confirmType: 'success',
    confirmText: '确认提交',
    cancelText: '暂不提交'
  })

  if (isConfirm) {

    //先存答案
    const res = await saveAnswerDataToBackend(tempAnswerOptions.value)
    const res2 = await submitPaper()
    useTimeoutFn(async () => {
      const isConfirm2 = await VConfirm.open({
        content: `提交成功，是否跳转到结果页面？`,
        confirmType: 'success',
        confirmText: '确认',
        cancelText: '取消'
      })
      if (isConfirm2) {
        await useRouter().push({
          path: `/exam/h5/examRecordResult`,
          query:{
            recordId: recordId.value
          }
        })
      }
    },1000)

  }
}


const submitPaper = ()=> submitPaperApi(recordId.value);

/**
 *
 */
const getTimeRemainInSecond = () => getTimeRemainInSecondApi().then(res => nowTimeInSeconds.value = res.data)


////////// ------- 作答部分逻辑
////////// ------- 作答部分 互斥锁
/**
 * 上传答案过程中会清空缓冲区数据 所以需要互斥，防止清空瞬间又新增答案，导致作答数据没有上传即被清空
 */
const isLocked = ref(false)
const callbackQueue = ref([])
const getLock = (callback: Function) => {
  if (isLocked.value) {
    //VMessage.success(`加入队列`)
    callbackQueue.value.push(callback);
  } else {
    isLocked.value = true;
    //VMessage.success(`获取锁成功`)
    callback();
  }
}

// TODO 用Promise写
const releaseLock = () => {
  if (callbackQueue.value.length > 0) {
    const callback = callbackQueue.value.shift();
    callback();
    //VMessage.success(`从队列执行`)
    releaseLock();
  } else {
    //VMessage.success(`释放锁成功`)
    isLocked.value = false;
  }
}

////////// ------- 作答部分 互斥锁


onMounted(async () => await initFun()
    .finally(() => useTimeoutFn(() => pageIsLoading.value = false, 800)))


//--------页面倒计时

const {pause, resume} = useIntervalFn(() => {
  timeRemainInSeconds.value--;
  nowTimeInSeconds.value++;
  if (timeRemainInSeconds.value < 0) {
    pause();
    examFinished.value = true;
  }
}, 1000, {immediate: true})

definePageMeta({
  layout: 'exam'
})

onMounted(() => {
  getTimeRemainInSecond()
})

</script>

<style>
.flex-container {
  display: flex;
  flex-direction: row;
}

.container-left {
  position: relative;
  min-width: 260px;
  max-width: 370px;
  min-height: 740px;
  width: 20%;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  height: 94vh;
}

.container-right {
  flex: auto;
  min-width: 450px;
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-height: 740px;
  height: 94vh;
}

.navigation {
  text-align: center;
  position: relative;
  top: 10px;
}

/*遮罩，遮住选项使其不可点击*/
.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0); /* 半透明遮罩 rgba(255, 255, 255, 0.5)*/
  pointer-events: auto; /* 使遮罩层能够接收鼠标事件 */
}
</style>