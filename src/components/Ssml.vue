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
        <path d="M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm11.008 2.093c.742.743 1.2 1.77 1.198 2.903-.002 1.133-.462 2.158-1.205 2.9l1.219 1.223c1.057-1.053 1.712-2.511 1.715-4.121.002-1.611-.648-3.068-1.702-4.125l-1.225 1.22zm2.142-2.135c1.288 1.292 2.082 3.073 2.079 5.041s-.804 3.75-2.096 5.039l1.25 1.254c1.612-1.608 2.613-3.834 2.616-6.291.005-2.457-.986-4.681-2.595-6.293l-1.254 1.25z"/>
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
