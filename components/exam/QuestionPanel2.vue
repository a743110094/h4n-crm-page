<template lang="html">
  <div class="question relative" v-if="props.questionWithOption">
    <div class="absolute top-6 right-6">
      <div class=" rounded-full w-20 h-20 flex items-center justify-center "
           v-bind:class="questionCorrect ? 'bg-green-300':'bg-red-300'">
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-lg font-semibold text-white">{{ questionCorrect ? '正确' : '错误' }}</span>
        </div>
      </div>
    </div>
    <!--      遮罩，遮住选项使其不可点击-->
    <div class="overlay"/>
    <!-- 问题部分 -->
    <div class="panel-question" v-loading="props.dataIsLoading">
      <LazyVH5 marker aligned marker-type="primary" v-if="!props.dataIsLoading">
        第 {{ props.currentQuestionIndex + 1 }} 题
      </LazyVH5>
      <h2 v-if="props.questionWithOption.content">{{ props.questionWithOption.content }}</h2>
      <div class="mt-[40px] hover:mt-[50px]" v-else>
        <LazyVResult v-if="!props.dataIsLoading" class="mt-4" title="出错了" type="error"
                     description="问题为空，请联系管理员"
                     size="large"/>
      </div>
    </div>
    <!-- 问题部分 -->

    <!-- 选项部分 -->
    <div class="panel-options" v-if="props.questionWithOption && props.questionWithOption.content"
         v-loading="props.dataIsLoading">
      <div class="mt-4" id="options"
           v-if="props.questionWithOption.options && props.questionWithOption.options.length > 0">
        <!--          单选  -->
        <div v-if="props.questionWithOption.type === 'single_choice'">
          <VRadioGroup vertical v-model:value="userOption[0]">
            <VSpace vertical :size="20">
              <VRadio readonly v-for="(option, index) in props.questionWithOption.options" :key="index"
                      @click.stop="()=>{}"
                      :label="option.optionId">
                {{ option.content }}
              </VRadio>
            </VSpace>
          </VRadioGroup>
        </div>
        <!--          单选  -->
        <!--          多选  -->
        <!--        <div v-if="props.questionWithOption.type === 'multiple_choice'">
                  <VCheckboxGroup vertical>
                    <VSpace vertical :size="20">
                      <VCheckbox v-for="(option, index) in props.questionWithOption.options" :key="index"
                                 :label="option.content" :value="option.optionId"/>
                    </VSpace>
                  </VCheckboxGroup>
                </div>-->
        <!--          多选  -->
        <!--        <div v-else-if="props.questionWithOption.type === 'true_false'">
                  <LazyVRadio v-model="props.userOption" label="True" value="true"></LazyVRadio>
                  <LazyVRadio v-model="props.userOption" label="False" value="false"></LazyVRadio>
                </div>-->
      </div>
      <!--      遮罩，遮住选项使其不可点击-->
      <div class="overlay"/>
    </div>
    <!-- 选项部分 -->
    <div class="mt-[40px] hover:mt-[40px]" v-else>
      <LazyVResult v-if="!props.dataIsLoading" title="出错了" type="error" description="选项为空，请联系管理员"
                   size="large"/>
    </div>
    <div class="ml-1 mt-[40px]">
      参考答案：
      <VTag
          v-for="element in questionWithOption?.options?.filter(e => e.isCorrect)"
          :key="element.optionId"
          border
          type="success"
      >
        {{ element.content }}
      </VTag>

    </div>
    <div class="ml-1 mt-[10px]">
      您的答案：
      <VTag
          v-if="questionWithOption && questionWithOption.options && userOption && userOption.length > 0"
          v-for="element in questionWithOption
          ?.options
          ?.filter(e => userOption.findIndex(e1=> e1 == e.optionId) > -1 )
          .map(e=>e.content)"
          :key="element.optionId"
          border
          type="warning"
      >
        {{ element }}
      </VTag>
      <div v-else> 未作答</div>
    </div>
    <div class="ml-1 mt-[10px]">
      得分： {{ questionWithOption.mark }}
    </div>
  </div>

</template>
<script lang="ts" setup>
const questionCorrect = ref(false);


const props = defineProps({
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  dataIsLoading: {
    type: Boolean,
    default: true
  },
  questionWithOption: {
    default: {}
  },
  userOption: {
    type: Array,
    default: -1
  }
})
watch(
    [props], (newVal, oldValue) => {
      answerIsCorrect()
    }
)

function answerIsCorrect() {
  questionCorrect.value = true;

  if (!props.userOption || !props.userOption) {
    debugger
    questionCorrect.value = false;
  }
  if (props.userOption?.length !== props.userOption?.length) {
    debugger
    questionCorrect.value = false;
  }

  props.questionWithOption
      ?.options
      ?.filter(e => e.isCorrect)
      ?.forEach(e => {
        /*每一个正确答案都需要在作答数据中找到 才算正确*/
        if (props.userOption?.indexOf(e.optionId) === -1) {
          questionCorrect.value = false;
        }
      })

}
</script>
<style>
.question {
  background: rgb(247, 247, 247);
  height: calc(100% - 70px);
  padding: 20px;
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