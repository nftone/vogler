<template>
  <main>
    <div v-if="loadingCreations">Loading...</div>

    <div v-else-if="creationsErrorMessage">
      <h2>Something went wrong</h2>
      <p>{{ creationsErrorMessage }}</p>
    </div>

    <div v-else>
      <RouterView />
    </div>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import useCreations from './composables/useCreations'

const {
  creationsErrorMessage, //
  loadingCreations,
  refreshCreations
} = useCreations()

onMounted(async () => await refreshCreations())
</script>

<style>
html {
  background-color: black;
  color: white;
  font-family: 'Consolas', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue',
    Helvetica, Arial, 'sans-serif';
}

body {
  margin: 32px;
}

h1 {
  font-weight: 300;
}

h2 {
  font-weight: 200;
}

input[type='text'] {
  border: 2px solid white; /* White border */
  background-color: rgba(
    0,
    0,
    0,
    0.3
  ); /* Transparent dark background. Adjust the last value for more or less transparency */
  color: white; /* Text color */
  padding: 10px; /* Some padding inside the input */
  width: 300px;
  font-family: 'Consolas', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue',
    Helvetica, Arial, 'sans-serif';
}

button {
  font-family: 'Consolas', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue',
    Helvetica, Arial, 'sans-serif';
}

input[type='text']::placeholder {
  color: gray; /* Gray placeholder text */
}

input[type='text'] + button {
  background-color: white; /* White background */
  color: black; /* Black text */
  border: 2px solid white; /* White border, same as the input */
  padding: 10px; /* Some padding inside the button */
  cursor: pointer; /* Change the cursor to a pointer on hover */
}

input[type='text'] + button:hover {
  background-color: #ddd; /* Light gray background on hover */
}

.no-select {
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
</style>
