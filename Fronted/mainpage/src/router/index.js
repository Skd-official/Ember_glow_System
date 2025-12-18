import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/Landing.vue')
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/views/MainLayout.vue'),
    children: [
      { path: '', redirect: '/main/map' },
      { path: 'map', name: 'Map', component: () => import('@/views/MapView.vue') },
      { path: 'route', name: 'Route', component: () => import('@/views/RouteView.vue') },
      { path: 'footprint', name: 'Footprint', component: () => import('@/views/FootprintView.vue') },
      { path: 'travelog', name: 'Travelog', component: () => import('@/views/TravelogView.vue') },
      { path: 'community', name: 'Community', component: () => import('@/views/CommunityView.vue') },
      { path: 'trend', name: 'Trend', component: () => import('@/views/TrendView.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
