<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  albumStore,
  addAlbum,
  updateAlbum,
  deleteAlbum,
  musicStore
} from '../stores/music.js'

const search = ref('')
const showForm = ref(false)
const editingId = ref(null)

const emptyAlbum = () => ({
  title: '',
  artist: '',
  year: new Date().getFullYear(),
  genre: 'Pop'
})

const form = ref(emptyAlbum())

const filteredAlbums = computed(() =>
  albumStore.albums.filter(album =>
    `${album.title} ${album.artist} ${album.genre}`
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
)

function getSongCount(album) {
  return musicStore.songs.filter(song =>
    song.album.toLowerCase() === album.title.toLowerCase() &&
    song.artist.toLowerCase() === album.artist.toLowerCase()
  ).length
}

function openAddForm() {
  editingId.value = null
  form.value = emptyAlbum()
  showForm.value = true
}

function openEditForm(album) {
  editingId.value = album.id
  form.value = { ...album }
  showForm.value = true
}

function saveAlbum() {
  if (!form.value.title.trim() || !form.value.artist.trim()) {
    alert('Please enter the album title and artist.')
    return
  }

  const duplicate = albumStore.albums.some(album =>
    album.title.toLowerCase() === form.value.title.trim().toLowerCase() &&
    album.artist.toLowerCase() === form.value.artist.trim().toLowerCase() &&
    album.id !== editingId.value
  )

  if (duplicate) {
    alert('This album already exists for that artist.')
    return
  }

  const albumData = {
    ...form.value,
    title: form.value.title.trim(),
    artist: form.value.artist.trim()
  }

  if (editingId.value !== null) {
    updateAlbum(editingId.value, albumData)
  } else {
    addAlbum(albumData)
  }

  showForm.value = false
}

function removeAlbum(album) {
  if (confirm(`Delete album "${album.title}"?`)) {
    deleteAlbum(album.id)
  }
}
</script>

<template>
  <div class="page">
    <RouterLink to="/dashboard">← Dashboard</RouterLink>

    <h1>Albums</h1>
    <p>Organize albums by title, artist, genre, and year.</p>

    <div class="song-toolbar">
      <input
        v-model="search"
        type="search"
        placeholder="Search albums or artists..."
      />

      <button @click="openAddForm">+ Add Album</button>
    </div>

    <p>Total albums: {{ albumStore.albums.length }}</p>

    <div v-if="filteredAlbums.length" class="album-grid">
      <article
        v-for="album in filteredAlbums"
        :key="album.id"
        class="album-card"
      >
        <div class="album-cover"></div>

        <h3>{{ album.title }}</h3>

        <p>{{ album.artist }}</p>

        <small>{{ album.genre }} · {{ album.year }}</small>

        <p>{{ getSongCount(album) }} matching songs in your library</p>

        <div class="song-actions">
          <button @click="openEditForm(album)">Edit</button>
          <button @click="removeAlbum(album)">Delete</button>
        </div>
      </article>
    </div>

    <p v-else>No albums found. Add your first album!</p>

    <div v-if="showForm" class="form-overlay">
      <form class="song-form" @submit.prevent="saveAlbum">
        <h2>{{ editingId !== null ? 'Edit Album' : 'Add Album' }}</h2>

        <label>
          Album Title
          <input v-model="form.title" required maxlength="100" />
        </label>

        <label>
          Artist
          <input v-model="form.artist" required maxlength="100" />
        </label>

        <label>
          Genre
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
          Release Year
          <input
            v-model.number="form.year"
            type="number"
            min="1900"
            :max="new Date().getFullYear() + 5"
            required
          />
        </label>

        <div class="form-actions">
          <button type="submit">Save Album</button>
          <button type="button" @click="showForm = false">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>