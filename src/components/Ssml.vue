<template>
  <div>
    <slot name="button" :getTTS="toggleTTS">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        :fill="svgFill"
        @click.prevent="toggleTTS"
        v-show="text"
      >
        <path
          d="M16 11c0 2.209-1.791 4-4 4s-4-1.791-4-4v-7c0-2.209 1.791-4 4-4s4 1.791 4 4v7zm4-2v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z"
        />
      </svg>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Ssml',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      audio: null,
      isLoading: false
    }
  },
  computed: {
    isPlaying() {
      if (!this.audio) return false

      return !this.audio.paused
    },
    svgFill() {
      if (this.isPlaying) {
        return '#18b51e'
      }

      if (this.isLoading) {
        return '#ccc'
      }

      return ''
    }
  },
  methods: {
    createRequest(ssml) {
      return {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.VUE_APP_GOOGLE_TTS_API_KEY
        },
        body: JSON.stringify({
          input: { ssml },
          voice: {
            languageCode: 'sv-SE',
            name: 'sv-SE-Wavenet-A',
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.8
          }
        }),
        method: 'POST'
      }
    },
    ssmlToText(ssml) {
      return ssml
        .replace('<speak>', '')
        .replace(/<\/p><p>/g, '-')
        .replace(/<p>/g, '')
        .replace('</speak>', '')
        .replace(/<\/p>/g, '')
    },
    textToSsml(text) {
      let ssml = text.replace(/-/g, '</p><p>')
      ssml = `<speak><p>${ssml}</p></speak>`
      return ssml
    },
    toggleTTS() {
      if (!this.audio) {
        this.getTTS()
      } else if (this.audio && this.isPlaying) {
        this.audio.pause()
        this.audio = null
      }
    },
    async getTTS() {
      const ssml = this.textToSsml(this.text)
      const address = `https://texttospeech.googleapis.com/v1/text:synthesize`
      const payload = this.createRequest(ssml)

      try {
        this.isLoading = true
        const response = await fetch(`${address}`, payload)
        const result = await response.json()
        this.isLoading = false
        this.audio = new Audio(`data:audio/wav;base64,${result.audioContent}`)
        await this.audio.play()
      } catch (err) {
        console.warn(err)
      }
    }
  }
}
</script>

<style scoped></style>
