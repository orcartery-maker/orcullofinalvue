<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  artistStore,
  addArtist,
  updateArtist,
  deleteArtist,
  musicStore
} from '../stores/music.js'

const search = ref('')
const showForm = ref(false)
const editingId = ref(null)

const emptyArtist = () => ({
  name: '',
  genre: 'Pop',
  country: '',
  bio: ''
})

const form = ref(emptyArtist())

const filteredArtists = computed(() => {
  return artistStore.artists.filter(artist =>
    `${artist.name} ${artist.genre} ${artist.country}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
})

function getSongCount(name) {
  return musicStore.songs.filter(
    song => song.artist.toLowerCase() === name.toLowerCase()
  ).length
}

function openAddForm() {
  editingId.value = null
  form.value = emptyArtist()
  showForm.value = true
}

function openEditForm(artist) {
  editingId.value = artist.id
  form.value = { ...artist }
  showForm.value = true
}

function saveArtist() {
  if (!form.value.name.trim()) {
    alert('Please enter the artist name.')
    return
  }

  const duplicate = artistStore.artists.some(artist =>
    artist.name.toLowerCase() === form.value.name.trim().toLowerCase() &&
    artist.id !== editingId.value
  )

  if (duplicate) {
    alert('This artist already exists.')
    return
  }

  const artistData = {
    ...form.value,
    name: form.value.name.trim()
  }

  if (editingId.value !== null) {
    updateArtist(editingId.value, artistData)
  } else {
    addArtist(artistData)
  }

  showForm.value = false
}

function removeArtist(artist) {
  if (confirm(`Delete artist "${artist.name}"?`)) {
    deleteArtist(artist.id)
  }
}
</script>

<template>
  <div class="page">
    <RouterLink to="/dashboard">← Dashboard</RouterLink>

    <h1>Artists</h1>
    <p>Build and manage your favorite artist collection.</p>

    <div class="song-toolbar">
      <input
        v-model="search"
        type="search"
        placeholder="Search artists..."
      />

      <button @click="openAddForm">+ Add Artist</button>
    </div>

    <p>Total artists: {{ artistStore.artists.length }}</p>

    <div v-if="filteredArtists.length" class="artist-grid">
      <article
        v-for="artist in filteredArtists"
        :key="artist.id"
        class="artist-card"
      >
        <div class="artist-icon"></div>

        <h3>{{ artist.name }}</h3>

        <p>{{ artist.genre }} · {{ artist.country || 'Country not specified' }}</p>

        <p>{{ artist.bio || 'No biography added.' }}</p>

        <small>{{ getSongCount(artist.name) }} songs in your library</small>

        <div class="song-actions">
          <button @click="openEditForm(artist)">Edit</button>
          <button @click="removeArtist(artist)">Delete</button>
        </div>
      </article>
    </div>

    <p v-else>No artists found. Add your first artist!</p>

    <div v-if="showForm" class="form-overlay">
      <form class="song-form" @submit.prevent="saveArtist">
        <h2>{{ editingId !== null ? 'Edit Artist' : 'Add Artist' }}</h2>

        <label>
          Artist Name
          <input v-model="form.name" required maxlength="100" />
        </label>

        <label>
          Main Genre
          <select v-model="form.genre">
            <option>Pop</option>
            <option>Rock</option>
            <option>Hip-hop</option>
            <option>R&B</option>
            <option>Jazz</option>
            <option>Classical</option>
            <option>Country</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Country
          <input v-model="form.country" maxlength="100" />
        </label>

        <label>
          Biography
          <textarea v-model="form.bio" maxlength="500" rows="3"></textarea>
        </label>

        <div class="form-actions">
          <button type="submit">Save Artist</button>
          <button type="button" @click="showForm = false">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>