import axios from 'axios'
import { ref } from 'vue'

const creations = ref([])
const creationsErrorMessage = ref('')
const loadingCreations = ref(false)

export default function useCreations() {
  const refreshCreations = async (options = {}) => {
    try {
      if (options.refreshIfEmpty && creations.value.length) {
        return
      }

      loadingCreations.value = false
      const url = 'https://api.vogler.nft1.com/'
      const response = await axios.get(url)
      creations.value = response.data.creations
    } catch (error) {
      creationsErrorMessage.value = error
      console.error(error)
    } finally {
      loadingCreations.value = false
    }
  }

  return {
    creations,
    creationsErrorMessage,
    loadingCreations,
    refreshCreations
  }
}
