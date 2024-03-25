<template>
  <div>
    <h1>Vogler Asset Ownership Checker</h1>
    <!-- prevent default -->
    <form id="check-form" @submit.prevent="onSubmit">
      <label for="address-input">Enter your Bitcoin address:</label>
      <input v-model="address" type="text" id="address-input" name="address" required />
      <button @click="onSubmit">Check Ownership</button>
    </form>
    <div v-if="resultMessage">{{ resultMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Creations } from '../constants/Creations'
import { findOwnerByTxHash } from '../services/creations'

const address = ref('')
const resultMessage = ref('')

const onSubmit = async () => {
  resultMessage.value = ''

  if (!address.value) {
    resultMessage.value = 'Please enter a valid address'
  }

  try {
    const ownedAssets = await checkOwnership(address)
    if (ownedAssets.length === 0) {
      resultMessage.value = 'You do not own any of the assets.'
    } else {
      resultMessage.value = `You own the following assets:<br>${ownedAssets.join('<br>')}`
    }
  } catch (error) {
    console.error(error)
    resultMessage.value = 'An error occurred while checking ownership. Please try again later.'
  }
}

const checkOwnership = async (address) => {
  const ownedAssets = []
  for (const creation of Creations) {
    const owner = await findOwnerByTxHash(creation.h)
    if (owner === address) {
      ownedAssets.push(creation.name)
    }
  }
  return ownedAssets
}
</script>
