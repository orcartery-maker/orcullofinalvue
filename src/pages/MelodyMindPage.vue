
<script setup>
import { ref, computed, nextTick } from 'vue'
import { musicStore } from '../stores/music.js'

const input = ref('')
const messages = ref([
  {
    role: 'assistant',
    text: "Hi! I'm MelodyMind 🎵 Ask me about your music library, find a song, or tell me what you're looking for."
  }
])

const chatArea = ref(null)
const listening = ref(false)
const recording = ref(false)
const busy = ref(false)
const status = ref('')
const matches = ref([])
let recorder = null
let audioChunks = []
let recognition = null

const suggestions = [
  'Show my favorite songs',
  'Find songs by a specific artist',
  'How many songs are in my library?',
  'Help me find relaxing music'
]

const songCount = computed(() => musicStore.songs.length)

function searchLibrary(query) {
  const q = query.toLowerCase()

  return musicStore.songs.filter(song =>
    [song.title, song.artist, song.album, song.genre]
      .some(value => String(value || '').toLowerCase().includes(q))
  )
}

function answerQuestion(question) {
  const q = question.toLowerCase()
  const songs = musicStore.songs

  if (q.includes('how many') || q.includes('count')) {
    return `You currently have ${songs.length} songs in your music library, ${new Set(songs.map(s => s.artist)).size} artists represented, and ${new Set(songs.map(s => s.album)).size} album names.`
  }

  if (q.includes('favorite') || q.includes('favourite')) {
    const favorites = songs.filter(song => song.favorite)

    if (!favorites.length) {
      return "You don't have any favorite songs yet. Open Songs and tap the favorite control on a song you love."
    }

    matches.value = favorites
    return `I found ${favorites.length} favorite song(s) in your library. Here they are:`
  }

  if (q.includes('relax') || q.includes('chill') || q.includes('study')) {
    const keywords = q.includes('study')
      ? ['lo-fi', 'classical', 'instrumental', 'ambient']
      : ['chill', 'acoustic', 'jazz', 'ambient', 'relax']

    const found = songs.filter(song =>
      keywords.some(word =>
        String(song.genre || '').toLowerCase().includes(word)
      )
    )

    matches.value = found

    return found.length
      ? `I found ${found.length} song(s) that may fit that mood, based on their genre labels.`
      : "I couldn't find songs with matching genre labels yet. Try adding genres to your songs, or browse the library."
  }

  const terms = q
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && ![
      'find', 'show', 'search', 'song', 'songs', 'music',
      'artist', 'album', 'please', 'about', 'what', 'with',
      'from', 'that', 'have', 'play', 'tell', 'me'
    ].includes(word))

  const found = songs.filter(song => {
    const text = [
      song.title, song.artist, song.album, song.genre
    ].join(' ').toLowerCase()

    return terms.some(term => text.includes(term))
  })

  matches.value = found

  if (found.length) {
    return `I found ${found.length} possible match(es) in your library. Check the results below.`
  }

  return "I couldn't find a match in your library. Try a song title, artist, album, or genre. General music questions will need the external AI connection we'll add next."
}

async function sendMessage(text = input.value) {
  const question = text.trim()
  if (!question || busy.value) return

  messages.value.push({ role: 'user', text: question })
  input.value = ''
  matches.value = []
  busy.value = true

  await nextTick()

  const reply = answerQuestion(question)

  messages.value.push({ role: 'assistant', text: reply })
  busy.value = false

  await nextTick()

  if (chatArea.value) {
    chatArea.value.scrollTop = chatArea.value.scrollHeight
  }
}

function useSuggestion(suggestion) {
  sendMessage(suggestion)
}

function startVoiceInput() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    status.value = 'Voice typing is not supported in this browser. You can type your question instead.'
    return
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
    listening.value = true
    status.value = 'Listening to your spoken question...'
  }

  recognition.onresult = event => {
    input.value = event.results[0][0].transcript
    status.value = 'Voice input captured. Press Send to ask.'
  }

  recognition.onerror = () => {
    status.value = 'Voice input failed. Please try again or type your question.'
  }

  recognition.onend = () => {
    listening.value = false
  }

  recognition.start()
}

async function startHumming() {
  status.value = ''

  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    status.value = 'Audio recording is unavailable in this browser. Try a supported browser over localhost or HTTPS.'
    return
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    audioChunks = []
    recorder = new MediaRecorder(stream)

    recorder.ondataavailable = event => {
      if (event.data.size > 0) audioChunks.push(event.data)
    }

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, {
        type: recorder.mimeType || 'audio/webm'
      })

      stream.getTracks().forEach(track => track.stop())
      recording.value = false

      // The recognition endpoint will be connected in the next step.
      status.value = `Recording captured (${Math.round(audioBlob.size / 1024)} KB). Song identification needs the secure recognition service, which we'll connect next.`
    }

    recorder.start()
    recording.value = true
    status.value = 'Hum or sing the melody for about 8–10 seconds.'
  } catch {
    status.value = 'Microphone access was denied or unavailable. Check your browser permissions.'
  }
}

function stopHumming() {
  if (recorder && recorder.state !== 'inactive') {
    recorder.stop()
  }
}
</script>

<template>
  <main class="page melodymind-page">
    <header class="mind-header">
      <span class="mind-label">YOUR PERSONAL MUSIC COMPANION</span>
      <h1>Meet MelodyMind <span>✦</span></h1>
      <p>
        Explore your library, discover songs, and find the music you're thinking of.
      </p>
    </header>

    <section class="mind-layout">
      <aside class="mind-sidebar">
        <div class="mind-profile">
          <div class="mind-avatar">♫</div>
          <div>
            <strong>MelodyMind</strong>
            <p>Your music assistant</p>
          </div>
        </div>

        <div class="mind-library">
          <span>YOUR LIBRARY</span>
          <h2>{{ songCount }}</h2>
          <p>songs available to search</p>
        </div>

        <h3>Try asking</h3>

        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          class="mind-suggestion"
          @click="useSuggestion(suggestion)"
        >
          {{ suggestion }} <span>→</span>
        </button>
      </aside>

      <section class="mind-chat">
        <header class="chat-header">
          <div>
            <strong>Music conversation</strong>
            <p>Search your collection with natural language</p>
          </div>
          <span class="online-indicator">Ready</span>
        </header>

        <div ref="chatArea" class="chat-messages" aria-live="polite">
          <article
            v-for="(message, index) in messages"
            :key="index"
            class="chat-message"
            :class="message.role"
          >
            <div class="message-avatar">
              {{ message.role === 'assistant' ? '♫' : 'You' }}
            </div>
            <div class="message-bubble">
              {{ message.text }}
            </div>
          </article>

          <div v-if="matches.length" class="mind-matches">
            <h3>🎵 Music matches</h3>

            <article
              v-for="song in matches"
              :key="song.id"
              class="mind-song"
            >
              <div class="mind-song-icon">♫</div>
              <div>
                <strong>{{ song.title }}</strong>
                <p>{{ song.artist }} · {{ song.album }}</p>
                <span>{{ song.genre || 'Genre not specified' }}</span>
              </div>
            </article>
          </div>
        </div>

        <form class="mind-composer" @submit.prevent="sendMessage()">
          <input
            v-model="input"
            placeholder="Ask about a song, artist, album..."
            aria-label="Ask MelodyMind a question"
          />

          <button
            type="button"
            class="mind-icon-button"
            :disabled="listening"
            :title="listening ? 'Listening' : 'Speak your question'"
            @click="startVoiceInput"
          >
            {{ listening ? '🎙️' : '🎤' }}
          </button>

          <button type="submit" class="mind-send" :disabled="!input.trim()">
            Send →
          </button>
        </form>

        <div class="humming-panel">
          <div>
            <strong>Can't remember the song?</strong>
            <p>Hum or sing the melody and we'll try to identify it.</p>
          </div>

          <button
            v-if="!recording"
            class="mind-hum-button"
            @click="startHumming"
          >
            🎙️ Start humming
          </button>

          <button
            v-else
            class="mind-hum-button recording"
            @click="stopHumming"
          >
            ■ Stop recording
          </button>
        </div>

        <p v-if="busy" class="mind-status">Thinking...</p>
        <p v-if="status" class="mind-status" role="status">{{ status }}</p>
      </section>
    </section>
  </main>
</template>
