<template>
  <main>
    <div v-if="loading">Loading...</div>

    <div v-else-if="errorMessage">
      <h2>Something went wrong</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else>
      {{ creations }}
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const loading = ref(true)
const creations = ref([])
const errorMessage = ref('')

onMounted(async () => {
  try {
    loading.value = false
    const url = 'http://api.vogler.nft1.com/'
    const response = await axios.get(url)
    creations.value = response.data.creations
  } catch (error) {
    errorMessage.value = error
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>
