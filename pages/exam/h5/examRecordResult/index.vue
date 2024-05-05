<template>
  <div v-if="isMarking">
    <LazyExamLoadingSvg :text="'评卷中...'"/>
  </div>
  <div v-if="!isMarking" class="bg-gray-100 h-full p-8">
    <div class="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 relative">
      <h1 class="text-2xl font-bold mb-4 text-center">成绩报告</h1>
      <div class="mb-4">
        <template v-if="dataIsLoading">
          <span class="text-lg font-semibold">总分:</span>
          <LazyVSkeleton width="43%" activated/>
        </template>
        <template v-else>
          <p class="text-lg font-semibold">总分: <span class="text-blue-500 text-2xl">90</span>/100</p>
        </template>
      </div>
      <div class="mb-4">
        <p class="text-lg font-semibold">各题型得分:</p>
        <ul class="list-disc pl-6">
          <template v-if="dataIsLoading">
            <li v-for="i in 4">
              <LazyVSkeleton width="33%" activated/>
            </li>
          </template>
          <template v-else>
            <li>单选题: <span class="text-blue-500 text-xl">20</span>/25</li>
            <li>多选题: <span class="text-blue-500 text-xl">30</span>/30</li>
            <li>判断题: <span class="text-blue-500 text-xl">20</span>/20</li>
            <li>填空题: <span class="text-blue-500 text-xl">20</span>/25</li>
          </template>
        </ul>
      </div>
      <div>
        <p class="text-lg font-semibold">答题情况:</p>
        <div class="grid grid-cols-8 gap-4 py-6 overflow-y-auto px-6 mt-4 border-2 rounded"
             style="height: calc(100vh - 480px);" v-loading="dataIsLoading">
          <LazyVSkeleton v-for="i in 40" :height="40" circle activated v-if="dataIsLoading"></LazyVSkeleton>
          <template v-for="(element,key,index) in questions" v-else>
            <div class="w-10 h-10 text-center text-white leading-10 rounded-full
                        transition ease-in-out delay-150 bg-blue-500 hover:-translate-y-1 -translate-x-1 hover:scale-110 hover:bg-blue-400 duration-300"
                 v-bind:class="element.isCorrect ? 'bg-green-300':'bg-red-300'"
                 @click="fetchAnswerDetail(element.answerId,index)"
            >{{ index + 1 }}
            </div>
          </template>
        </div>
      </div>
      <LazyVDrawer placement="bottom" resizable transfer v-model:active="active" inner title="题目详情" height="70%">
        <lazy-exam-question-panel2
            :current-question-index="currentQuestionIndex"
            :data-is-loading="dataIsLoading"
            :user-option="[currentAnswerWithOption?.userAnswer]"
            :question-with-option="currentAnswerWithOption"
            :on-user-option-change="()=>{}"
        />
      </LazyVDrawer>
    </div>
  </div>
</template>


<script setup lang="ts">
import {answerDetailApi, getScoreDetailApi} from "~/pages/exam/examRecordResult/api";
import {dataIsLoading, questions, recordId} from "~/pages/exam/examRecordResult/consts";
// 后台是否正在评分
const isMarking = ref(false);
// 是否展示抽屉
const active = ref(false)
// 当前抽屉展示的题目index
const currentQuestionIndex = ref(0);
/**
 * 当前作答含答案的详情
 */
const currentAnswerWithOption = ref();

definePageMeta({
  layout: 'exam'
});

/**
 * 获取题目作答详情
 * 包含题目内容，选项，用户作答情况，得分情况
 * @param answer
 */
const fetchAnswerDetail = async (answer: number, index: number) => {
  currentQuestionIndex.value = index
  const {data} = await answerDetailApi(answer);
  currentAnswerWithOption.value = data
  active.value = true;
}
onBeforeMount(() => recordId.value = useRouter().currentRoute.value.query.recordId)
onMounted(() => {
  getScoreDetailApi(recordId.value).then(res => questions.value = res.data)
      .finally(() => useTimeoutFn(() => dataIsLoading.value = false, 1000))
})
</script>


<style scoped>

</style>