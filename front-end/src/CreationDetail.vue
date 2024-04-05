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

      <div class="creation-detail-body">
        <img
          class="creation-image no-select"
          :class="{ [className]: true }"
          :src="`/images/works/${creation.image}`"
          :alt="`image of ${creation.name}`"
        />
        <CreationDetailProperties :creation="creation" />
      </div>
    </div>
  </template>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { dashedCreationNames } from './constants/creations'
import useCreations from './composables/useCreations'
import CreationDetailProperties from './CreationDetailProperties.vue'

const {
  creations, //
  creationsErrorMessage,
  refreshCreations
} = useCreations()
const route = useRoute()

const creation = ref(null)
const creationLoading = ref(true)

const slug = computed(() => route.params.slug)

const className = computed(() => {
  if (dashedCreationNames.includes(creation.value.name)) return 'dashed-border'
  return 'plain-border'
})

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
  width: 350px;
  height: 350px;
  background-color: white;
  image-rendering: pixelated;
}

.creation-detail-body {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 3rem;
}

.creation-detail-body .properties a,
.creation-detail-body .properties a:link,
.creation-detail-body .properties a:visited,
.creation-detail-body .properties a:hover,
.creation-detail-body .properties a:active,
.creation-detail-body .properties a:-webkit-any-link {
  color: #0081ff;
  text-decoration: underline;
}
</style>
