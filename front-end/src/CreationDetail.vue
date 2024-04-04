<template>
  <div class="creation-detail-header no-select">
    <RouterLink to="/">
      <h1>Stephan Vogler Artworks (2015)</h1>
    </RouterLink>
  </div>

  <div v-if="loadingCreations">Loading...</div>

  <div v-else-if="!creation">
    <h2>Work {{ slug }} not found</h2>
  </div>

  <div v-else-if="creationsErrorMessage">
    <h2>Something went wrong</h2>
    <p>{{ creationsErrorMessage }}</p>
  </div>

  <div v-else>
    {{ creation }}
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import useCreations from './composables/useCreations'

const {
  creations, //
  creationsErrorMessage,
  loadingCreations,
  refreshCreations
} = useCreations()
const route = useRoute()

const slug = computed(() => route.params.slug)
const creation = ref(null)

onMounted(async () => {
  await refreshCreations({ refreshIfEmpty: true })
  creation.value = creations.value.find((creation) => creation.slug == slug.value)
})
</script>

<style>
.creation-detail-header {
  display: grid;
  align-items: end;
}
</style>
