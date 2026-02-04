import axios from 'axios'
import { ref } from 'vue'

const creations = ref([])
const creationsErrorMessage = ref('')
const loadingCreations = ref(false)
let fetchPromise = null

export default function useCreations() {
  const refreshCreations = async (options = {}) => {
    console.log('[useCreations] refreshCreations called with options:', options)
    console.log('[useCreations] current state:', {
      creationsLength: creations.value.length,
      loadingCreations: loadingCreations.value,
      hasFetchPromise: !!fetchPromise
    })

    if (options.refreshIfEmpty && creations.value.length) {
      console.log('[useCreations] refreshIfEmpty: creations already loaded, skipping')
      return
    }

    // Deduplicate concurrent requests
    if (fetchPromise) {
      console.log('[useCreations] fetch already in progress, returning existing promise')
      return fetchPromise
    }

    loadingCreations.value = true
    const url = 'https://api.vogler.nft1.com/'
    console.log('[useCreations] starting new fetch from:', url)

    fetchPromise = axios
      .get(url)
      .then((response) => {
        console.log('[useCreations] fetch successful, got', response.data.creations.length, 'creations')
        creations.value = response.data.creations
        return response
      })
      .catch((error) => {
        console.error('[useCreations] fetch failed:', error)
        creationsErrorMessage.value = error.message || String(error)
        throw error
      })
      .finally(() => {
        console.log('[useCreations] fetch complete, setting loadingCreations=false')
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
