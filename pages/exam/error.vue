<template lang="pug">
  VResult(title="出错了" :description="message" size="large" class="mt-[30vh]" type="error")
</template>

<script setup lang="ts">
//----- PageMeta
definePageMeta({
  layout: 'exam'
});

//----- QueryParameters
const message: string = useRoute().query.msg?.toString() || '服务器开小差了......';

</script>
