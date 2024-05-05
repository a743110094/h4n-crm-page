<template lang="html">
  <LazyVH5 marker aligned marker-type="primary">
    考试信息
  </LazyVH5>
  <div class="mt-6 space-y-2">
    <div>
      <VText strong>考试名称:</VText>
    </div>
    <div>
      <VSkeleton width="90%" :spread="14" v-if="examInfoIsLoading"></VSkeleton>
      <VText keyboard v-else>高中物理必修二期末第一次摸底模拟测试考试</VText>
    </div>

    <div>
      <VText strong>开考时间:</VText>
    </div>
    <div>
      <VSkeleton width="60%" :spread="14" v-if="examInfoIsLoading"></VSkeleton>
      <VText keyboard v-else>2024年4月15日 09:40:00</VText>
    </div>

    <div>
      <VText strong>终考时间:</VText>
    </div>
    <div>
      <VSkeleton width="60%" :spread="14" v-if="examInfoIsLoading"></VSkeleton>
      <VText keyboard v-else>2024年4月15日 11:40:00</VText>
    </div>

    <div>
      <VText strong>考试时长:</VText>
    </div>
    <div>
      <VSkeleton width="30%" :spread="14" v-if="examInfoIsLoading"></VSkeleton>
      <VText keyboard v-else>120分钟</VText>
    </div>

  </div>
  <div class="mt-8 grid justify-items-center">
    <!--          考试时间缺失或者当前时间缺失或者还未开始，失效按钮-->
    <VButton type="primary"
             v-bind:disabled="!currentTime || !examStartTime || !(dayjs.unix(currentTime).diff(dayjs(examStartTime)) >= 0)">
      <!--            倒计时是还未开始才显示-->
      开始考试 <span
        v-if="dayjs.unix(currentTime).diff(dayjs(examStartTime)) <0">
            ({{ (dayjs.unix(currentTime).diff(dayjs(examStartTime)) / -1000) }})</span>
    </VButton>
  </div>
</template>
<script setup lang="ts">
import {currentTime, examInfoIsLoading, examStartTime} from "~/pages/exam/preAnswer/indexx.js";
import dayjs from "dayjs";


</script>