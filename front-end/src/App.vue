<template>
  <main>
    <div v-if="loading">Loading...</div>

    <div v-else-if="errorMessage">
      <h2>Something went wrong</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else>
      <AddressVerifier :creations="creations" />
      <!-- <CreationsTable :creations="creations" /> -->
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import AddressVerifier from './AddressVerifier.vue'
// import CreationsTable from './CreationsTable.vue'

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

<style>
html {
  background-color: black;
  color: white;
  font-family: 'Consolas', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue',
    Helvetica, Arial, 'sans-serif';
}

body {
  margin: 32px;
}

h1 {
  font-weight: 300;
}

h2 {
  font-weight: 200;
}

input[type='text'] {
  border: 2px solid white; /* White border */
  background-color: rgba(
    0,
    0,
    0,
    0.3
  ); /* Transparent dark background. Adjust the last value for more or less transparency */
  color: white; /* Text color */
  padding: 10px; /* Some padding inside the input */
  width: 300px;
}

input[type='text']::placeholder {
  color: gray; /* Gray placeholder text */
}

input[type='text'] + button {
  background-color: white; /* White background */
  color: black; /* Black text */
  border: 2px solid white; /* White border, same as the input */
  padding: 10px; /* Some padding inside the button */
  cursor: pointer; /* Change the cursor to a pointer on hover */
  margin-left: 10px; /* Add some space between the input and the button */
}

input[type='text'] + button:hover {
  background-color: #ddd; /* Light gray background on hover */
}
</style>
