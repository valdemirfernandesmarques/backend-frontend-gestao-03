<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)
</script>

<template>
  <div>
    <h1>{{ msg }}</h1>
    <button @click="count++">Contador: {{ count }}</button>
  </div>
</template>

<style scoped>
button {
  padding: 0.5rem 1rem;
  background-color: purple;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
</style>
