<template>
  <div class="home-menu no-select">
    <RouterLink to="/">
      <h1>Stephan Vogler Artworks (2015)</h1>
    </RouterLink>
    <RouterLink to="/verifier">
      <h2 class="address-verifier-link">Address Verifier</h2>
    </RouterLink>
  </div>

  <div v-if="loadingCreations">Loading...</div>

  <div v-else-if="creationsErrorMessage">
    <h2>Something went wrong</h2>
    <p>{{ creationsErrorMessage }}</p>
  </div>
  <div v-else>
    <div class="creations-grid">
      <CreationTile
        v-for="creation in creations"
        :key="`creation-tile-${creation.h}`"
        :creation="creation"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import useCreations from './composables/useCreations'
import CreationTile from './CreationTile.vue'

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

.creations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  column-gap: 22px;
  max-width: 1760px;
  margin-top: 1rem;
}
</style>
