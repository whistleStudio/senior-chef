<template>
<div>{{ a.b }}</div>
</template>

<script setup>
import { ref } from 'vue'

const a = ref({b: 1})

</script>

<style scoped>

</style>