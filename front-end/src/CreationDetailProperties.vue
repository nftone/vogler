<template>
  <div class="properties initial-link-styling">
    <p style="margin-top: 0">Description: {{ creation.description }}</p>
    <p>
      Hash/File:
      <a v-if="creation.fileUrl.startsWith('http')" :href="creation.fileUrl" target="_blank">
        {{ fileHash }}
      </a>
      <template v-else>{{ fileHash }}</template>
    </p>
    <p>
      Signed: {{ creation.signatureDate }} CEST (<a :href="creation.signatureUrl" target="_blank">
        {{ creation.signatureUrl }} </a
      >)
    </p>
    <p>
      Inscribed: {{ creation.inscriptionDate }} CEST (<a :href="inscriptionUrl" target="_blank">
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['creation'])

const fileHash = computed(() => {
  if (!props.creation) return ''
  const fileName = props.creation.signatureUrl.split('/').pop()
  return fileName.split('.')[0]
})

const inscriptionUrl = computed(() => {
  return `https://www.blockchain.com/explorer/transactions/btc/${props.creation.inscription}`
})

const ownerUrl = computed(() => {
  return `https://www.blockchain.com/explorer/addresses/btc/${props.creation.owner}`
})
</script>

<style>
.creation-detail .properties p {
  margin: 6px;
}
</style>
