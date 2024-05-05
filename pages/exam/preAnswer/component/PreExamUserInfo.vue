<template lang="html">
  <LazyVH5 marker aligned marker-type="primary">
    考生信息
  </LazyVH5>
  <div class="grid justify-items-center m-4">
    <VImage width="120"
            height="160"
            :radius="8"
            lazy
            src="http://pic-bed.heaven96.site/202404151216876.jpg?imageView2/0/format/webp/interlace/1/q/65%7Cimageslim"/>
  </div>
  <div class="space-y-2">
    <div>
      <VText strong>姓名：</VText>
      <VSkeleton width="40%" :spread="-2" v-if="userInfoIsLoading"></VSkeleton>
      <VText v-else keyboard>张三</VText>
    </div>
    <div>
      <VText strong>考号：</VText>
      <VSkeleton width="70%" :spread="-2"  v-if="userInfoIsLoading"></VSkeleton>
      <VText v-else keyboard>20102111203222</VText>
    </div>
  </div>
</template>
<script setup lang="ts">
import {userInfoIsLoading} from "~/pages/exam/preAnswer/indexx";

</script>