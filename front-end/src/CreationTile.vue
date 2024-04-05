<template>
  <RouterLink :to="`/work/${creation.slug}`">
    <div class="creation-tile">
      <img
        class="creation-image no-select"
        :class="{ [className]: true }"
        :src="`images/works/${creation.image}`"
        :alt="`image of ${creation.name}`"
      />
      <div class="creation-name no-select">
        <span>{{ creation.name }}</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { dashedCreationNames } from './constants/creations'

const props = defineProps(['creation'])

const className = computed(() => {
  if (dashedCreationNames.includes(props.creation.name)) return 'dashed-border'
  return 'plain-border'
})
</script>

<style>
.creation-tile {
  cursor: pointer;
  display: grid;
  width: 150px;
  grid-template-rows: 150px 50px;
}

.creation-tile img {
  width: 150px;
  height: 150px;
}

.creation-tile .creation-image {
  width: 150px;
  height: 150px;
  background-color: white;
  image-rendering: pixelated;
}

.creation-tile .creation-name {
  display: grid;
  place-content: center;
  text-align: center;
  margin: 0;
  padding: 0;
}

.creation-tile .creation-name span {
  color: white;
}
</style>
