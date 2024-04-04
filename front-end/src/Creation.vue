<template>
  <div>
    <p class="no-select">This address holds {{ creation.name }}</p>
    <img
      class="creation-image no-select"
      :src="`images/works/${creation.image}`"
      :alt="`image of ${creation.name}`"
    />
  </div>
</template>

<script setup>
defineProps(['creation'])
</script>

<style>
.creation-image {
  width: 200px;
  height: 200px;
  background-color: white;
  image-rendering: pixelated;
}
</style>
