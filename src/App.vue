<template>
  <div id="app">
    <nav-bar></nav-bar>
    <div class="main-wrapper">
      <router-view />
    </div>

    <new-content-available-toastr
      v-if="newContentAvailable"
      class="new-content-available-toastr"
      :refreshing-app="refreshingApp"
      @refresh="serviceWorkerSkipWaiting"
    ></new-content-available-toastr>
    <apple-add-to-home-screen-modal
      v-if="showAddToHomeScreenModalForApple"
      class="apple-add-to-home-screen-modal"
      @close="closeAddToHomeScreenModalForApple(false)"
    >
    </apple-add-to-home-screen-modal>
  </div>
</template>
<script>
import NavBar from '@/components/NavBar'
import NewContentAvailableToastr from '@/components/NewContentAvailableToastr'
import AppleAddToHomeScreenModal from '@/components/AppleAddToHomeScreenModal'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: { NavBar, NewContentAvailableToastr, AppleAddToHomeScreenModal },
  computed: {
    ...mapGetters('app', ['newContentAvailable']),
    ...mapState('app', ['showAddToHomeScreenModalForApple', 'refreshingApp'])
  },
  methods: mapActions('app', [
    'closeAddToHomeScreenModalForApple',
    'serviceWorkerSkipWaiting'
  ])
}
</script>

<style lang="scss">
:root {
  --red-500: #ef6666;
  --blue-500: #2ea6d7;

  --gray-800: #525252;
  --gray-700: #6c6c6c;
  --gray-600: #989899;
  --gray-500: #cecece;
  --gray-400: #eaeaea;
  --gray-300: #f1f3f4;
  --gray-200: #f6f7f8;
  --gray-100: #fbfcfc;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;

  a {
    font-weight: 500;
    text-decoration: none;
  }

  #app {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 18px;
    line-height: 1.4;
    color: #2c3e50;

    display: flex;
    flex-direction: column;
    min-height: 100vh;

    .new-content-available-toastr {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }

    .apple-add-to-home-screen-modal {
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      height: fit-content;
      width: fit-content;
      margin: auto;
      z-index: 1000;
    }

    .main-wrapper {
      margin-top: 3.6rem;
      padding: 20px;
      background-color: #f7f3f3;

      flex: 1;

      .page-wrapper {
        max-width: 1440px;
        margin-left: auto;
        margin-right: auto;

        @media screen and (max-width: 1000px) {
          width: 100%;
        }
      }
    }
  }
}

.container {
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
}

.primary-link {
  color: #006bff;
}

.primary-link:hover {
  color: #1a81ff;
}
</style>
