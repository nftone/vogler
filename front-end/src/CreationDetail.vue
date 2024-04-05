<template>
  <div class="creation-detail-header no-select">
    <RouterLink to="/">
      <h1>Stephan Vogler Artworks (2015)</h1>
    </RouterLink>
  </div>

  <div v-if="creationLoading">Loading...</div>
  <template v-else>
    <div v-if="!creation && creations.length && !creationsErrorMessage">
      <h2>Work {{ slug }} not found</h2>
    </div>

    <div v-else-if="creationsErrorMessage">
      <h2>Something went wrong</h2>
      <p>{{ creationsErrorMessage }}</p>
    </div>

    <div v-else-if="creation" class="creation-detail">
      <h1>{{ creation.name }}</h1>
      <img
        class="creation-image no-select"
        :src="`/images/works/${creation.image}`"
        :alt="`image of ${creation.name}`"
      />
      <!-- {{ creation }} -->
    </div>
  </template>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import useCreations from './composables/useCreations'

const {
  creations, //
  creationsErrorMessage,
  refreshCreations
} = useCreations()
const route = useRoute()

const slug = computed(() => route.params.slug)
const creation = ref(null)
const creationLoading = ref(true)

onMounted(async () => {
  await refreshCreations({ refreshIfEmpty: true })
  creation.value = creations.value.find((creation) => creation.slug == slug.value)
  nextTick(() => (creationLoading.value = false))
})
</script>

<style>
.creation-detail-header {
  display: grid;
  align-items: end;
}

.creation-detail .creation-image {
  width: 200px;
  height: 200px;
  background-color: white;
  image-rendering: pixelated;
}
</style>
