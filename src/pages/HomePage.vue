<script setup>
import { RouterLink } from 'vue-router'
</script>


<template>
  <main class="page">
    <section class="hero">
      <p class="mood-eyebrow">YOUR PERSONAL MUSIC SPACE</p>

      <h1>Every song has a place.</h1>

      <p>
        Organize your favorite songs, discover your music collection,
        manage artists, and create playlists for every mood.
      </p>

      <RouterLink to="/dashboard">
        Start Exploring →
      </RouterLink>
    </section>

    <section>
      <h2>Your music, organized.</h2>

      <div class="dashboard-stats">
        <article class="card">
          <h3>Songs</h3>
          <p>Manage your music collection.</p>
          <RouterLink to="/songs">Explore songs →</RouterLink>
        </article>

        <article class="card">
          <h3>Artists</h3>
          <p>Keep track of your favorite artists.</p>
          <RouterLink to="/artists">Explore artists →</RouterLink>
        </article>

        <article class="card">
          <h3>Albums</h3>
          <p>Organize albums in your library.</p>
          <RouterLink to="/albums">Explore albums →</RouterLink>
        </article>

        <article class="card">
          <h3>Playlists</h3>
          <p>Create collections for every occasion.</p>
          <RouterLink to="/playlists">Explore playlists →</RouterLink>
        </article>

        <article class="card">
          <h3>Mood Matcher</h3>
          <p>Discover music based on your mood.</p>
          <RouterLink to="/mood-matcher">Find your mood mix →</RouterLink>
        </article>
      </div>
    </section>
  </main>
</template>
