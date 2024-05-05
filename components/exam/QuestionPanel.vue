<template lang="html">
  <div class="question" v-if="currentQuestion">
    <!-- 问题部分 -->
    <LazyVH5 marker aligned marker-type="primary">
      第 {{ currentQuestionIndex + 1 }} 题
    </LazyVH5>
    <h2 v-if="currentQuestion.content">{{ currentQuestion.content || '问题为空，请联系管理员' }}</h2>
    <div class="mt-[60px] hover:mt-[70px]" v-else>
      <VResult v-if="!dataIsLoading" class="mt-4" title="出错了" type="error" description="问题为空，请联系管理员"
               size="large"/>
    </div>
    <!-- 问题部分 -->

    <!-- 选项部分 -->
    <div class="mt-4" id="options" v-if="currentQuestion.options && currentQuestion.options.length > 0">
      <!-- 单选 -->
      <div v-if="currentQuestion.type === 'single_choice'">
        <VRadioGroup vertical @change="answerTheQuestion(currentQuestion.questionId,currentOptions,null)"
                     v-model:value="currentOptions">
          <VSpace vertical :size="20">
            <VRadio v-for="(option, index) in currentQuestion.options" :key="index" :label="option.optionId">
              {{ option.content }}
            </VRadio>
          </VSpace>
        </VRadioGroup>

      </div>
      <!-- 单选 -->
      <!-- 多选 -->
      <div v-if="currentQuestion.type === 'multiple_choice'">
        <VCheckboxGroup vertical>
          <VSpace vertical :size="20">
            <VCheckbox v-for="(option, index) in currentQuestion.options" :key="index"
                       :label="option.content" :value="option.optionId"/>
          </VSpace>
        </VCheckboxGroup>
      </div>
      <!-- 多选 -->
      <div v-else-if="currentQuestion.type === 'true_false'">
        <vex-radio v-model="currentOptions" label="True" value="true"></vex-radio>
        <vex-radio v-model="currentOptions" label="False" value="false"></vex-radio>
      </div>
    </div>
    <div class="mt-[60px] hover:mt-[70px]" v-else>
      <VResult v-if="!dataIsLoading" title="出错了" type="error" description="选项为空，请联系管理员"
               size="large"/>
    </div>
    <!-- 选项部分 -->
  </div>
</template>
<script>
export default {
  name: 'question-panel'
}
</script>
<style>

.question {
  background: rgb(247, 247, 247);
  height: calc(100% - 70px);
  padding: 24px;
  margin-bottom: 10px;
}


</style>