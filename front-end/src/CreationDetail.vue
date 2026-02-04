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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { dashedCreationNames } from './constants/creations'
import useCreations from './composables/useCreations'

import CreationDetailProperties from './CreationDetailProperties.vue'
import CreationDetailTransactionHistory from './CreationDetailTransactionHistory.vue'

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
  if (!creation.value) return ''
  if (dashedCreationNames.includes(creation.value.name)) return 'dashed-border'
  return 'plain-border'
})

onMounted(async () => {
  console.log('[CreationDetail] onMounted, calling refreshCreations')
  await refreshCreations({ refreshIfEmpty: true })
  console.log('[CreationDetail] refreshCreations completed')
})

// Watch for creations to populate and slug changes, then find the matching creation
watch(
  [creations, slug],
  ([newCreations, newSlug]) => {
    console.log('[CreationDetail] watch fired:', {
      creationsLength: newCreations.length,
      slug: newSlug,
      creationValue: creation.value
    })
    if (newCreations.length) {
      const found = newCreations.find((c) => c.slug === newSlug)
      console.log('[CreationDetail] found:', found ? `${found.name} (${found.slug})` : 'undefined')
      if (found !== creation.value) {
        console.log('[CreationDetail] setting creation and loading=false')
        creation.value = found
        nextTick(() => {
          creationLoading.value = false
          console.log('[CreationDetail] creationLoading set to false')
        })
      } else {
        console.log('[CreationDetail] found === creation.value, skipping update')
      }
    } else {
      console.log('[CreationDetail] creations array is empty, waiting...')
    }
  },
  { immediate: true }
)
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
