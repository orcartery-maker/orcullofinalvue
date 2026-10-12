<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  musicStore,
  artistStore,
  albumStore,
  addSong,
  updateSong,
  deleteSong,
  toggleFavorite
} from '../stores/music.js'
const search = ref('')
const selectedGenre = ref('All')
const showForm = ref(false)
const editingId = ref(null)

const emptySong = () => ({
  title: '',
  artist: '',
  album: '',
  genre: 'Pop',
  year: new Date().getFullYear()
})

const form = ref(emptySong())

const genres = computed(() => [
  'All',
  ...new Set(musicStore.songs.map(song => song.genre))
])

const filteredSongs = computed(() => {
  return musicStore.songs.filter(song => {
    const text = `${song.title} ${song.artist} ${song.album}`
      .toLowerCase()

    const matchesSearch = text.includes(search.value.toLowerCase())

    const matchesGenre =
      selectedGenre.value === 'All' ||
      song.genre === selectedGenre.value

    return matchesSearch && matchesGenre
  })
})

function openAddForm() {
  editingId.value = null
  form.value = emptySong()
  showForm.value = true
}

function openEditForm(song) {
  editingId.value = song.id
  form.value = { ...song }
  showForm.value = true
}

function saveSong() {
  if (
    !form.value.title.trim() ||
    !form.value.artist.trim() ||
    !form.value.album.trim()
  ) {
    alert('Please fill in the title, artist, and album.')
    return
  }

  if (editingId.value !== null) {
    updateSong(editingId.value, { ...form.value })
  } else {
    addSong({ ...form.value })
  }

  showForm.value = false
}

function removeSong(song) {
  if (confirm(`Delete "${song.title}"?`)) {
    deleteSong(song.id)
  }
}
</script>

<template>
  <div class="page">
    <RouterLink to="/dashboard">← Dashboard</RouterLink>

    <h1>My Songs</h1>
    <p>Add, search, edit, favorite, and delete songs.</p>

    <div class="song-toolbar">
      <input
        v-model="search"
        type="search"
        placeholder="Search songs, artists, or albums..."
      />

      <select v-model="selectedGenre">
        <option v-for="genre in genres" :key="genre">
          {{ genre }}
        </option>
      </select>

      <button @click="openAddForm">+ Add Song</button>
    </div>

    <p>Total songs: {{ musicStore.songs.length }}</p>

    <div v-if="filteredSongs.length" class="song-list">
      <article
        v-for="song in filteredSongs"
        :key="song.id"
        class="song-card"
      >
        <div>
          <h3>{{ song.title }}</h3>
          <p>{{ song.artist }} · {{ song.album }}</p>
          <small>{{ song.genre }} · {{ song.year }}</small>
        </div>

        <div class="song-actions">
          <button @click="toggleFavorite(song.id)">
            {{ song.favorite ? '♥' : '♡' }}
          </button>

          <button @click="openEditForm(song)">Edit</button>

          <button @click="removeSong(song)">Delete</button>
        </div>
      </article>
    </div>

    <p v-else>No songs found. Try another search or add a song.</p>

    <div v-if="showForm" class="form-overlay">
      <form class="song-form" @submit.prevent="saveSong">
        <h2>{{ editingId !== null ? 'Edit Song' : 'Add Song' }}</h2>

        <label>
          Song Title
          <input v-model="form.title" required maxlength="100" />
        </label>

        <label>
  Artist
  <input
    v-model="form.artist"
    list="artist-options"
    required
    maxlength="100"
    placeholder="Enter artist name"
  />

  <datalist id="artist-options">
    <option
      v-for="artist in artistStore.artists"
      :key="artist.id"
      :value="artist.name"
    />
  </datalist>
</label>

       <label>
  Album
  <input
    v-model="form.album"
    list="album-options"
    required
    maxlength="100"
    placeholder="Enter album title"
  />

  <datalist id="album-options">
    <option
      v-for="album in albumStore.albums"
      :key="album.id"
      :value="album.title"
    />
  </datalist>
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
            <option>Synth-pop</option>
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
          <button type="submit">Save Song</button>

          <button type="button" @click="showForm = false">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>