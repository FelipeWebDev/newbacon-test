import Vue from 'vue'
import VueRouter from 'vue-router'
import UserListing from '@/components/UserListing.vue';
import UserDetails from '@/components/UserDetails.vue';

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: UserListing
    },
    {
      path: '/user-details',
      name: "user-details",
      component: UserDetails
    }
  ]
})

export default router
