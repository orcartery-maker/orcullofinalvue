import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

import HomePage from './pages/HomePage.vue'
import DashboardPage from './pages/DashboardPage.vue'
import SongsPage from './pages/SongsPage.vue'
import ArtistsPage from './pages/ArtistsPage.vue'
import AlbumsPage from './pages/AlbumsPage.vue'
import PlaylistsPage from './pages/PlaylistsPage.vue'
import MelodyMindPage from './pages/MelodyMindPage.vue'
import './style.css'

const routes = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/dashboard',
    component: DashboardPage
  },
  {
    path: '/songs',
    component: SongsPage
  },
  {
    path: '/artists',
    component: ArtistsPage
  },
  {
    path: '/albums',
    component: AlbumsPage
  },

  { path: '/melodymind', component: MelodyMindPage },
  {
    path: '/playlists',
    component: PlaylistsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App)
  .use(router)
  .mount('#app')