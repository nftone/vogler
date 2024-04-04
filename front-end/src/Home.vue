<template>
  <div class="home-menu no-select">
    <h1>Stephan Vogler Artworks (2015)</h1>
    <RouterLink to="/verifier" :custom="true">
      <h2 class="address-verifier-link">Address Verifier</h2>
    </RouterLink>
  </div>

  <div v-if="loadingCreations">Loading...</div>

  <div v-else-if="creationsErrorMessage">
    <h2>Something went wrong</h2>
    <p>{{ creationsErrorMessage }}</p>
  </div>
  <div v-else>
    {{ creations }}
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import useCreations from './composables/useCreations'

const {
  creations, //
  creationsErrorMessage,
  loadingCreations,
  refreshCreations
} = useCreations()

onMounted(async () => {
  await refreshCreations({ refreshIfEmpty: true })
})
</script>

<style>
.home-menu {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
}

.address-verifier-link {
  cursor: pointer;
  text-align: right;
  padding-bottom: 3px;
}
</style>
