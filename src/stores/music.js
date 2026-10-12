import { reactive, watch } from 'vue'

const savedSongs = localStorage.getItem('melodyhub-songs')

export const musicStore = reactive({
  songs: savedSongs
    ? JSON.parse(savedSongs)
    : [
        {
          id: 1,
          title: 'Shape of You',
          artist: 'Ed Sheeran',
          album: 'Divide',
          genre: 'Pop',
          year: 2017,
          favorite: true
        },
        {
          id: 2,
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          album: 'After Hours',
          genre: 'Synth-pop',
          year: 2019,
          favorite: false
        },
        {
          id: 3,
          title: 'Perfect',
          artist: 'Ed Sheeran',
          album: 'Divide',
          genre: 'Pop',
          year: 2017,
          favorite: false
        }
      ]
})

watch(
  () => musicStore.songs,
  (songs) => {
    localStorage.setItem('melodyhub-songs', JSON.stringify(songs))
  },
  { deep: true }
)

export function addSong(song) {
  musicStore.songs.push({
    ...song,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    favorite: false
  })
}

export function updateSong(id, updatedSong) {
  const index = musicStore.songs.findIndex(song => song.id === id)

  if (index !== -1) {
    musicStore.songs[index] = {
      ...musicStore.songs[index],
      ...updatedSong
    }
  }
}

export function deleteSong(id) {
  musicStore.songs = musicStore.songs.filter(song => song.id !== id)
}

export function toggleFavorite(id) {
  const song = musicStore.songs.find(song => song.id === id)

  if (song) {
    song.favorite = !song.favorite
  }
}
export const artistStore = reactive({
  artists: JSON.parse(localStorage.getItem('melodyhub-artists') || '[]')
})

watch(
  () => artistStore.artists,
  (artists) => {
    localStorage.setItem('melodyhub-artists', JSON.stringify(artists))
  },
  { deep: true }
)

export function addArtist(artist) {
  artistStore.artists.push({
    id: Date.now(),
    ...artist
  })
}

export function updateArtist(id, updatedArtist) {
  const index = artistStore.artists.findIndex(artist => artist.id === id)

  if (index !== -1) {
    artistStore.artists[index] = {
      ...artistStore.artists[index],
      ...updatedArtist
    }
  }
}

export function deleteArtist(id) {
  artistStore.artists = artistStore.artists.filter(
    artist => artist.id !== id
  )
}
export const albumStore = reactive({
  albums: JSON.parse(localStorage.getItem('melodyhub-albums') || '[]')
})

watch(
  () => albumStore.albums,
  (albums) => {
    localStorage.setItem('melodyhub-albums', JSON.stringify(albums))
  },
  { deep: true }
)

export function addAlbum(album) {
  albumStore.albums.push({
    id: Date.now(),
    ...album
  })
}

export function updateAlbum(id, updatedAlbum) {
  const index = albumStore.albums.findIndex(album => album.id === id)

  if (index !== -1) {
    albumStore.albums[index] = {
      ...albumStore.albums[index],
      ...updatedAlbum
    }
  }
}

export function deleteAlbum(id) {
  albumStore.albums = albumStore.albums.filter(
    album => album.id !== id
  )
}
export const playlistStore = reactive({
  playlists: JSON.parse(
    localStorage.getItem('melodyhub-playlists') || '[]'
  )
})

watch(
  () => playlistStore.playlists,
  (playlists) => {
    localStorage.setItem(
      'melodyhub-playlists',
      JSON.stringify(playlists)
    )
  },
  { deep: true }
)

export function addPlaylist(playlist) {
  playlistStore.playlists.push({
    id: Date.now(),
    ...playlist
  })
}

export function updatePlaylist(id, updatedPlaylist) {
  const index = playlistStore.playlists.findIndex(
    playlist => playlist.id === id
  )

  if (index !== -1) {
    playlistStore.playlists[index] = {
      ...playlistStore.playlists[index],
      ...updatedPlaylist
    }
  }
}

export function deletePlaylist(id) {
  playlistStore.playlists = playlistStore.playlists.filter(
    playlist => playlist.id !== id
  )
}