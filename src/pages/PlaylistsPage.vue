<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

import {
  playlistStore,
  musicStore,
  addPlaylist,
  updatePlaylist,
  deletePlaylist
} from '../stores/music.js'

const search = ref('')
const showForm = ref(false)
const editingId = ref(null)

const emptyPlaylist = () => ({
  name: '',
  description: '',
  mood: 'Relaxing',
  songIds: []
})

const form = ref(emptyPlaylist())

const moods = [
  'Relaxing',
  'Happy',
  'Sad',
  'Workout',
  'Study',
  'Party',
  'Romantic',
  'Other'
]

const filteredPlaylists = computed(() =>
  playlistStore.playlists.filter(playlist =>
    `${playlist.name} ${playlist.description} ${playlist.mood}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
)

function openAddForm() {
  editingId.value = null
  form.value = emptyPlaylist()
  showForm.value = true
}

function openEditForm(playlist) {
  editingId.value = playlist.id

  form.value = {
    ...playlist,
    songIds: [...(playlist.songIds || [])]
  }

  showForm.value = true
}

function savePlaylist() {
  if (!form.value.name.trim()) {
    alert('Please enter a playlist name.')
    return
  }

  const duplicate = playlistStore.playlists.some(playlist =>
    playlist.name.toLowerCase() === form.value.name.trim().toLowerCase() &&
    playlist.id !== editingId.value
  )

  if (duplicate) {
    alert('A playlist with this name already exists.')
    return
  }

  const playlistData = {
    ...form.value,
    name: form.value.name.trim(),
    songIds: [...form.value.songIds]
  }

  if (editingId.value !== null) {
    updatePlaylist(editingId.value, playlistData)
  } else {
    addPlaylist(playlistData)
  }

  showForm.value = false
}

function removePlaylist(playlist) {
  if (confirm(`Delete playlist "${playlist.name}"?`)) {
    deletePlaylist(playlist.id)
  }
}

function getPlaylistSongs(playlist) {
  return musicStore.songs.filter(song =>
    (playlist.songIds || []).includes(song.id)
  )
}
</script>

<template>
  <div class="page">
    <RouterLink to="/dashboard">← Dashboard</RouterLink>

    <h1>My Playlists</h1>

    <p>Create playlists for every mood and occasion.</p>

    <div class="song-toolbar">
      <input
        v-model="search"
        type="search"
        placeholder="Search playlists..."
      />

      <button @click="openAddForm">+ Create Playlist</button>
    </div>

    <p>Total playlists: {{ playlistStore.playlists.length }}</p>

    <div v-if="filteredPlaylists.length" class="playlist-grid">
      <article
        v-for="playlist in filteredPlaylists"
        :key="playlist.id"
        class="playlist-card"
      >
        <div class="playlist-icon"></div>

        <h3>{{ playlist.name }}</h3>

        <p>{{ playlist.description || 'No description added.' }}</p>

        <span class="mood-badge">{{ playlist.mood }}</span>

        <p>
          {{ getPlaylistSongs(playlist).length }} songs
        </p>

        <ul v-if="getPlaylistSongs(playlist).length">
          <li
            v-for="song in getPlaylistSongs(playlist)"
            :key="song.id"
          >
            {{ song.title }} — {{ song.artist }}
          </li>
        </ul>

        <p v-else class="muted">
          No songs added yet.
        </p>

        <div class="song-actions">
          <button @click="openEditForm(playlist)">Edit</button>

          <button @click="removePlaylist(playlist)">
            Delete
          </button>
        </div>
      </article>
    </div>

    <p v-else>No playlists found. Create your first playlist!</p>

    <div v-if="showForm" class="form-overlay">
      <form class="song-form" @submit.prevent="savePlaylist">
        <h2>
          {{ editingId !== null ? 'Edit Playlist' : 'Create Playlist' }}
        </h2>

        <label>
          Playlist Name
          <input
            v-model="form.name"
            required
            maxlength="100"
            placeholder="e.g. Songs for Studying"
          />
        </label>

        <label>
          Description
          <textarea
            v-model="form.description"
            rows="3"
            maxlength="300"
            placeholder="Describe your playlist..."
          ></textarea>
        </label>

        <label>
          Mood
          <select v-model="form.mood">
            <option v-for="mood in moods" :key="mood">
              {{ mood }}
            </option>
          </select>
        </label>

        <fieldset class="song-picker">
          <legend>Choose Songs</legend>

          <p v-if="!musicStore.songs.length">
            Add songs in the Songs page first.
          </p>

          <label
            v-for="song in musicStore.songs"
            :key="song.id"
            class="song-option"
          >
            <input
              v-model="form.songIds"
              type="checkbox"
              :value="song.id"
            />

            <span>{{ song.title }} — {{ song.artist }}</span>
          </label>
        </fieldset>

        <div class="form-actions">
          <button type="submit">Save Playlist</button>

          <button
            type="button"
            @click="showForm = false"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>