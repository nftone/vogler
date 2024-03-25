<template>
  <main>
    <div v-if="loading">Loading...</div>

    <div v-else-if="errorMessage">
      <h2>Something went wrong</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else>
      <table style="text-align: left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="creation in creations" :key="creation.id">
            <td>{{ creation.name }}</td>
            <td>{{ creation.owner }}</td>
          </tr>
        </tbody>
      </table>
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
    const url = 'https://api.vogler.nft1.com/'
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
