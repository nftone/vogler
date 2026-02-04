import axios from 'axios'
import { ref } from 'vue'

const creations = ref([])
const creationsErrorMessage = ref('')
const loadingCreations = ref(false)
let fetchPromise = null

export default function useCreations() {
  const refreshCreations = async (options = {}) => {
    if (options.refreshIfEmpty && creations.value.length) {
      return
    }

    // Deduplicate concurrent requests
    if (fetchPromise) {
      return fetchPromise
    }

    loadingCreations.value = true
    const url = 'https://api.vogler.nft1.com/'

    fetchPromise = axios
      .get(url)
      .then((response) => {
        creations.value = response.data.creations
        return response
      })
      .catch((error) => {
        creationsErrorMessage.value = error.message || String(error)
        console.error(error)
        throw error
      })
      .finally(() => {
        loadingCreations.value = false
        fetchPromise = null
      })

    return fetchPromise
  }

  return {
    creations,
    creationsErrorMessage,
    loadingCreations,
    refreshCreations
  }
}
