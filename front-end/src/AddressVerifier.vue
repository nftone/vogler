<template>
  <div>
    <h1>Stephan Vogler Artworks (2015)</h1>
    <h2>Address Verifier</h2>
  </div>
  <div>
    <input v-model="address" type="text" placeholder="Type Bitcoin address" />
    <button @click="onClick">Verify</button>
    <Creation v-if="foundCreation" :creation="foundCreation" />
    <div style="margin-top: 16px" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['creations'])

import Creation from './Creation.vue'
const address = ref('')
const errorMessage = ref('')
const foundCreation = ref(null)

const onClick = () => {
  console.log('clocked')
  errorMessage.value = ''
  foundCreation.value = null

  if (!address.value) {
    errorMessage.value = 'Please enter a Bitcoin address'
    return
  }

  const lowerAddress = address.value.toLowerCase()

  const creation = props.creations.find((creation) => {
    return creation.owner.toLowerCase() === lowerAddress
  })

  if (creation) {
    foundCreation.value = creation
  } else {
    errorMessage.value = "This address doesn't hold Stephan Vogler artworks"
  }
}
</script>
