<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import {
  musicStore,
  artistStore,
  albumStore,
  playlistStore
} from '../stores/music.js'

const totalSongs = computed(() => musicStore.songs.length)

const totalArtists = computed(() => artistStore.artists.length)

const totalAlbums = computed(() => albumStore.albums.length)

const totalPlaylists = computed(() => playlistStore.playlists.length)

const favoriteSongs = computed(() =>
  musicStore.songs.filter(song => song.favorite)
)

const recentSongs = computed(() =>
  [...musicStore.songs]
    .sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : a.id

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : b.id

      return dateB - dateA
    })
    .slice(0, 5)
)

const genreCount = computed(() => {
  const counts = {}

  musicStore.songs.forEach(song => {
    counts[song.genre] = (counts[song.genre] || 0) + 1
  })

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
})
</script>

<template>
  <div class="page dashboard">
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">YOUR MUSIC SPACE</p>
        <h1>Welcome to MelodyHub</h1>
        <p>Manage your music collection in one place.</p>
      </div>

      <RouterLink to="/">← Home</RouterLink>
    </header>

    <section class="stats-grid">
      <RouterLink to="/songs" class="stat-card">
        <span></span>
        <p>Total Songs</p>
        <h2>{{ totalSongs }}</h2>
      </RouterLink>

      <RouterLink to="/artists" class="stat-card">
        <span></span>
        <p>Total Artists</p>
        <h2>{{ totalArtists }}</h2>
      </RouterLink>

      <RouterLink to="/albums" class="stat-card">
        <span></span>
        <p>Total Albums</p>
        <h2>{{ totalAlbums }}</h2>
      </RouterLink>

      <RouterLink to="/playlists" class="stat-card">
        <span></span>
        <p>Total Playlists</p>
        <h2>{{ totalPlaylists }}</h2>
      </RouterLink>
    </section>

    <section class="dashboard-section">
      <div class="section-heading">
        <h2>Recently Added Songs</h2>
        <RouterLink to="/songs">View All →</RouterLink>
      </div>

      <div v-if="recentSongs.length" class="dashboard-list">
        <article
          v-for="song in recentSongs"
          :key="song.id"
          class="dashboard-song"
        >
          <div class="mini-cover">🎵</div>

          <div class="song-information">
            <strong>{{ song.title }}</strong>
            <p>{{ song.artist }}</p>
          </div>

          <span class="song-genre">{{ song.genre }}</span>
        </article>
      </div>

      <p v-else>No songs yet. Add your first song!</p>
    </section>

    <section class="dashboard-section">
      <div class="section-heading">
        <h2>Favorite Songs</h2>
        <RouterLink to="/songs">Manage Songs →</RouterLink>
      </div>

      <div v-if="favoriteSongs.length" class="dashboard-list">
        <article
          v-for="song in favoriteSongs"
          :key="song.id"
          class="dashboard-song"
        >
          <div class="mini-cover"></div>

          <div class="song-information">
            <strong>{{ song.title }}</strong>
            <p>{{ song.artist }}</p>
          </div>

          <span class="favorite-label">♥ Favorite</span>
        </article>
      </div>

      <p v-else>You haven't marked any songs as favorites.</p>
    </section>

    <section class="dashboard-section">
      <h2>Your Music Genres</h2>

      <div v-if="genreCount.length" class="genre-list">
        <div
          v-for="[genre, count] in genreCount"
          :key="genre"
          class="genre-row"
        >
          <span>{{ genre }}</span>

          <div class="genre-bar">
            <div
              class="genre-bar-fill"
              :style="{
                width: `${(count / totalSongs) * 100}%`
              }"
            ></div>
          </div>

          <strong>{{ count }}</strong>
        </div>
      </div>

      <p v-else>Add songs to see your genre statistics.</p>
    </section>

    <section class="quick-actions">
      <h2>Quick Actions</h2>

      <RouterLink to="/songs">+ Add or Manage Songs</RouterLink>
      <RouterLink to="/artists">+ Manage Artists</RouterLink>
      <RouterLink to="/albums">+ Manage Albums</RouterLink>
      <RouterLink to="/playlists">+ Create a Playlist</RouterLink>
    </section>
  </div>
</template>