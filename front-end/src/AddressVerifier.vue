<template>
  <div>
    <h1>Stephan Vogler Artworks (2015)</h1>
    <h2>Address Verifier</h2>
  </div>

  <div>
    <div class="input-area">
      <input
        v-model="address"
        type="text"
        placeholder="Type Bitcoin address"
        @keyup.enter="onClick"
      />
      <button @click="onClick">Verify</button>

      <GreenCheckmark v-if="foundCreation" />
      <RedCheckmark v-if="address && !foundCreation" />
    </div>

    <Creation v-if="foundCreation" :creation="foundCreation" />
    <div style="margin-top: 16px" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['creations'])

import Creation from './Creation.vue'
import GreenCheckmark from './icons/GreenCheckmark.vue'
import RedCheckmark from './icons/RedCheckmark.vue'

const address = ref('')
const errorMessage = ref('')
const foundCreation = ref(null)

const onClick = () => {
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

<style>
.input-area {
  display: grid;
  grid-auto-flow: column;
  justify-content: flex-start;
  column-gap: 12px;
}

.input-area button {
  margin-left: 3px;
  width: 100px;
}

.input-area svg {
  width: 38px;
  height: 38px;
}
</style>
