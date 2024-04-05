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

        <div class="properties">
          <p style="margin-top: 0">Description: {{ creation.description }}</p>
          <p>
            Hash/File:
            <a v-if="creation.fileUrl.startsWith('http')" :href="creation.fileUrl" target="_blank">
              {{ fileHash }}
            </a>
            <template v-else>{{ fileHash }}</template>
          </p>
          <p>
            Signed: {{ creation.signatureDate }} CEST (<a
              :href="creation.signatureUrl"
              target="_blank"
            >
              {{ creation.signatureUrl }} </a
            >)
          </p>
          <p>
            Inscribed: {{ creation.inscriptionDate }} CEST (<a
              :href="inscriptionUrl"
              target="_blank"
            >
              {{ inscriptionUrl }} </a
            >)
          </p>
          <p>Format: {{ creation.format }}</p>
          <p>Size: {{ creation.size }}</p>
          <p>
            License:
            <a href="https://www.stephanvogler.com/en/license/" target="_blank">
              {{ creation.license }}
            </a>
          </p>
          <p>
            Owner: <a :href="ownerUrl" target="_blank">{{ creation.owner }}</a>
          </p>
          <p>
            Owner contact:
            <a
              v-if="creation.ownerContact.startsWith('http')"
              :href="creation.ownerContact"
              target="_blank"
              >{{ creation.ownerContact }}</a
            >
            <template v-else>{{ creation.ownerContact }}</template>
          </p>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { dashedCreationNames } from './constants/creations'
import useCreations from './composables/useCreations'

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

const fileHash = computed(() => {
  if (!creation.value) return ''
  const fileName = creation.value.signatureUrl.split('/').pop()
  return fileName.split('.')[0]
})

const inscriptionUrl = computed(() => {
  return `https://www.blockchain.com/explorer/transactions/btc/${creation.value.inscription}`
})

const ownerUrl = computed(() => {
  return `https://www.blockchain.com/explorer/addresses/btc/${creation.value.owner}`
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

.creation-detail .properties p {
  margin: 6px;
  font-size: 18px;
}

.creation-detail .properties a,
.creation-detail .properties a:link,
.creation-detail .properties a:visited,
.creation-detail .properties a:hover,
.creation-detail .properties a:active,
.creation-detail .properties a:-webkit-any-link {
  color: #0081ff;
  text-decoration: underline;
}

.creation-detail-body {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 3rem;
}
</style>
