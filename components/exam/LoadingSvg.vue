<template lang="pug">
  div(class="flex flex-col items-center justify-center h-screen")
    svg(class="animate-spin h-24 w-24 text-blue-300 mb-4 " fill="none" viewBox="0 0 24 24")
      path(stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6")
    p(class="text-2xl animate-bounce") {{ text }}
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: '加载中...'
  }
})
</script>