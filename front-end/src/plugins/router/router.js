import { createWebHistory, createRouter } from 'vue-router'

import Home from '../../Home.vue'
import AddressVerifier from '../../AddressVerifier.vue'
import CreationDetail from '../../CreationDetail.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/verifier', component: AddressVerifier },
  { path: '/work/:slug', component: CreationDetail }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
