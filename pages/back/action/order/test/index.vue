<template>
    <div>
        <div>
            <VueDaumPostcode :animation="true" @complete="onComplete"/>
        </div>
        <div>
            <pre v-if="result">{{ result }}</pre>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { VueDaumPostcode } from 'vue-daum-postcode'
const result = ref();

const onComplete = (data)=>{
    VMessage.success(`address=${data.address}`)
    console.log(`c = ${data}`)
}
</script>