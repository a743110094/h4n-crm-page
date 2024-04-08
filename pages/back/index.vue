<script setup lang="ts">
const config = useRuntimeConfig()
console.log(`baseUrl = ${config.public.baseURL}`);

</script>

<template lang="pug">
</template>

<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

:deep(.slick-slide h3) {
  color: #fff;
}
</style>