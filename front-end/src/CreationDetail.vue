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

      <CreationDetailTransactionHistory :creation="creation" />
    </div>
  </template>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { dashedCreationNames } from './constants/creations'
import useCreations from './composables/useCreations'

import CreationDetailProperties from './CreationDetailProperties.vue'
import CreationDetailTransactionHistory from './CreationDetailTransactionHistory.vue'

const { creations, creationsErrorMessage } = useCreations()
const route = useRoute()

const slug = computed(() => route.params.slug)

// Data is bundled and always present, so the lookup is synchronous and reactive
// to slug changes. There is no fetch to miss and no loading race, so the
// "not found" branch now only ever shows for a genuinely unknown slug.
const creation = computed(() => creations.value.find((c) => c.slug === slug.value) ?? null)
const creationLoading = ref(false)

const className = computed(() => {
  if (!creation.value) return ''
  if (dashedCreationNames.includes(creation.value.name)) return 'dashed-border'
  return 'plain-border'
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

.creation-detail-body,
.transaction-history {
  font-size: 18px;
}

.initial-link-styling a,
.initial-link-styling a:link,
.initial-link-styling a:visited,
.initial-link-styling a:hover,
.initial-link-styling a:active,
.initial-link-styling a:-webkit-any-link {
  color: #0081ff;
  text-decoration: underline;
}
</style>
