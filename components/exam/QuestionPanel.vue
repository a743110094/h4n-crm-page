<template lang="html">
  <div class="question" v-if="!dataIsLoading && currentQuestion">
    <!-- 问题部分 -->
    <div class="panel-question" v-loading="dataIsLoading">
      <LazyVH5 marker aligned marker-type="primary" v-if="!dataIsLoading">
        第 {{ currentQuestionIndex + 1 }} 题
      </LazyVH5>
      <h2 v-if="currentQuestion.content">{{ currentQuestion.content }}</h2>
      <div class="mt-[40px] hover:mt-[50px]" v-else>
        <LazyVResult v-if="!dataIsLoading" class="mt-4" title="出错了" type="error"
                     description="问题为空，请联系管理员"
                     size="large"/>
      </div>
    </div>
    <!-- 问题部分 -->

    <!-- 选项部分 -->
    <div class="panel-options" v-if="currentQuestion && currentQuestion.content" v-loading="dataIsLoading">
      <div class="mt-4" id="options"
           v-if="currentQuestion.options && currentQuestion.options.length > 0">
        <!--          单选  -->
        <div v-if="currentQuestion.type === 'single_choice'">
          <!--          -->
          <VRadioGroup vertical @change="props.onUserOptionChange(currentQuestion.questionId,currentOptions,null)"
                       v-model:value="currentOptions">

            <VSpace vertical :size="20">
              <VRadio v-for="(option, index) in currentQuestion.options" :key="index" :label="option.optionId">
                {{ option.content }}
              </VRadio>
            </VSpace>
          </VRadioGroup>

        </div>
        <!--          单选  -->
        <!--          多选  -->
        <div v-if="currentQuestion.type === 'multiple_choice'">
          <VCheckboxGroup vertical>
            <VSpace vertical :size="20">
              <VCheckbox v-for="(option, index) in currentQuestion.options" :key="index"
                         :label="option.content" :value="option.optionId"/>
            </VSpace>
          </VCheckboxGroup>
        </div>
        <!--          多选  -->
        <div v-else-if="currentQuestion.type === 'true_false'">
          <LazyVRadio v-model="currentOptions" label="True" value="true"></LazyVRadio>
          <LazyVRadio v-model="currentOptions" label="False" value="false"></LazyVRadio>
        </div>
      </div>
      <div class="mt-[40px] hover:mt-[40px]" v-else>
        <LazyVResult v-if="!dataIsLoading" title="出错了" type="error" description="选项为空，请联系管理员"
                     size="large"/>
      </div>
    </div>
    <!-- 选项部分 -->
  </div>
</template>
<script lang="ts" setup>
import {currentOptions, currentQuestion, currentQuestionIndex, dataIsLoading} from "~/pages/exam/answer/consts";

const props = defineProps({
  onUserOptionChange: {
    type: Function,
    default: {}
  }
})
</script>
<style>

.question {
  background: rgb(247, 247, 247);
  height: calc(100% - 70px);
  padding: 24px;
  margin-bottom: 10px;
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