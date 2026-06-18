import { ref } from 'vue'

import creationsData from '../data/creations.json'

// Asset data is baked into the build at deploy time (src/data/creations.json).
// It almost never changes, so bundling it removes the runtime dependency on the
// indexer/API. The page can no longer render a partial list or a spurious
// "asset not found" because of a flaky or partial fetch — the data is always
// the complete, validated set that shipped with this build.
//
// To refresh the data: re-run the indexer (which writes this file, fail-closed
// and atomically) then tag a release to redeploy. See indexer/main.py.
const creations = ref(creationsData.creations ?? [])
const creationsErrorMessage = ref('')
const loadingCreations = ref(false)

export default function useCreations() {
  // No-op: data is already present synchronously from the bundle. Kept so the
  // existing components can keep calling refreshCreations() without changes.
  const refreshCreations = async () => {}

  return {
    creations,
    creationsErrorMessage,
    loadingCreations,
    refreshCreations
  }
}
