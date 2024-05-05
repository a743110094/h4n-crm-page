<template lang="html">
  <div class="flex items-center justify-center h-screen">
    <div class="flex items-center justify-center">
      <svg class="animate-spin h-24 w-24 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24">
        <circle id="svg_1" stroke-width="4" stroke="currentColor" r="10" cy="11.936508" cx="12"
                class="opacity-25"/>
        <path id="svg_2"
              d="m4.000809,11.957739a8,8 0 0 1 7.999394,-8l0,-4c-6.627,0 -12,5.373 -12,12l1.000051,0l1.000051,0l1.000051,0l1.000051,0zm1.999798,5.291a8.001,8.001 0 0 1 -2,-5.291l-4,0c0,3.042 1.135,5.824 3,7.938l3,-2.647zm1.365079,1.502651l6.762108,-12.212444l5.809322,5.482285z"
              fill="currentColor" class="opacity-75"/>
      </svg>
      <p class="ml-4 text-xl text-gray-800 font-semibold">{{ text }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: '加载中..'
  }
})
</script>