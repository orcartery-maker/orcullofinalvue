<script setup>
import { RouterLink } from 'vue-router'

</script>


<template>
  <nav class="app-navbar">
    <RouterLink to="/" class="brand">
      🎵 MelodyHub
    </RouterLink>

    <div class="nav-links">
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <RouterLink to="/songs">Songs</RouterLink>
      <RouterLink to="/artists">Artists</RouterLink>
      <RouterLink to="/albums">Albums</RouterLink>
      <RouterLink to="/melodymind">✦ MelodyMind</RouterLink>
      <RouterLink to="/playlists">Playlists</RouterLink>
    </div>
  </nav>
</template>