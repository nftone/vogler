<template>
  <div class="no-select">
    <h1>Stephan Vogler Artworks (2015)</h1>
    <h2>Address Verifier</h2>
  </div>

  <div v-if="loadingCreations">Loading...</div>

  <div v-else-if="creationsErrorMessage">
    <h2>Something went wrong</h2>
    <p>{{ creationsErrorMessage }}</p>
  </div>

  <div v-else>
    <div class="input-area">
      <input
        v-model="address"
        type="text"
        placeholder="Type Bitcoin address"
        @keyup.enter="onClick"
        @input="onClick"
        @change="onClick"
      />
      <button @click="onClick">Verify</button>

      <GreenCheckmark class="no-select" v-if="foundCreation" />
      <RedCheckmark class="no-select" v-if="address && !foundCreation" />
    </div>

    <Creation v-if="foundCreation" :creation="foundCreation" />
    <div style="margin-top: 16px" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useCreations from './composables/useCreations'

import Creation from './Creation.vue'
import GreenCheckmark from './icons/GreenCheckmark.vue'
import RedCheckmark from './icons/RedCheckmark.vue'
const {
  creations, //
  creationsErrorMessage,
  loadingCreations,
  refreshCreations
} = useCreations()
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

  const trimmedAddress = address.value.trim()

  const url = new URL(window.location.href)
  url.searchParams.set('address', trimmedAddress)
  window.history.pushState({}, '', url)

  setOwnedCreations()
}

const setOwnedCreations = () => {
  const creation = creations.value.find((creation) => {
    return creation.owner.toLowerCase() === address.value.toLowerCase()
  })

  if (creation) {
    foundCreation.value = creation
  } else {
    errorMessage.value = "This address doesn't hold Stephan Vogler artworks"
  }
}

onMounted(async () => {
  await refreshCreations({ refreshIfEmpty: true })
  const url = new URL(window.location.href)
  const addressFromUrl = url.searchParams.get('address')

  if (addressFromUrl) {
    address.value = addressFromUrl.trim()
    setOwnedCreations()
  }
})
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

.input-area .checkmark-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-content: center;
  margin-left: 3px;
}

.input-area .checkmark-icon img {
  width: 26px;
  height: 26px;
  filter: invert(1);
}

.input-area .checkmark-icon.green {
  background-color: #00cd27;
}

.input-area .checkmark-icon.red {
  background-color: #ff0000;
}
</style>
