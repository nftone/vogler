<template>
  <table style="text-align: left">
    <thead>
      <tr>
        <th>Name</th>
        <th>Owner</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="creation in creations" :key="creation.id">
        <td>{{ creation.name }}</td>
        <td>{{ creation.owner }}</td>
        <td><img :src="`images/works/${creation.image}`" /></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps(['creations'])
</script>
