<template>
  <div class="page-wrapper">
<!--    <h1 class="login-page-title">Login</h1>-->

    <!-- Loader -->
    <div v-show="user === undefined" data-test="loader">Authenticating...</div>

    <!-- Offline instruction -->
    <div v-show="!networkOnLine" data-test="offline-instruction">
      Please check your connection, login feature is not available offline.
    </div>

    <form @submit.prevent="login">
      <BaseField label="Email">
        <BaseInput v-model="email" type="email" expanded />
      </BaseField>

      <BaseField label="Password">
        <BaseInput v-model="password" type="password" expanded />
      </BaseField>

      <p v-if="loginError">{{ loginError }}</p>

      <!-- Auth UI -->
      <BaseButton
        v-show="user !== undefined && !user && networkOnLine"
        data-test="login-btn"
        type="primary"
        expanded
      >
        Login
      </BaseButton>
    </form>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { isNil } from 'lodash'
import firebase from 'firebase/app'
import BaseInput from '@/components/Core/Input.vue'
import BaseField from "@/components/Core/Field.vue";
import BaseButton from "@/components/Core/Button.vue";

export default {
  components: {BaseButton, BaseField, BaseInput },
  data: () => ({ loginError: null, email: '', password: '' }),
  head() {
    return {
      title: {
        inner: 'Login'
      },
      meta: [
        {
          name: 'description',
          content: `Sign in or sign up to ${this.appTitle}`,
          id: 'desc'
        }
      ]
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle'])
  },
  watch: {
    user: {
      handler(user) {
        if (!isNil(user)) {
          const redirectUrl = isNil(this.$route.query.redirectUrl)
            ? '/products'
            : this.$route.query.redirectUrl
          this.$router.push(redirectUrl)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    async login() {
      // this.loginError = null
      // const provider = new firebase.auth.GoogleAuthProvider()
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .catch(function(error) {
          // Handle Errors here.
          // var errorCode = error.code;
          // var errorMessage = error.message;
          this.loginError = error.message
          this.setUser(null)
        })

      // this.setUser(undefined)

      // try {
      //   // Firebase signin with popup is faster than redirect
      //   // but we can't use it on mobile because it's not well supported
      //   // when app is running as standalone on ios & android
      //   // eslint-disable-next-line no-unused-expressions
      //   isDekstop()
      //     ? await firebase.auth().signInWithPopup(provider)
      //     : await firebase.auth().signInWithRedirect(provider)
      // } catch (err) {
      //   this.loginError = err
      //   this.setUser(null)
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.page-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .login-page-title {
    text-align: center;
  }

  .login-btn {
    margin-top: 20px;
    cursor: pointer;
    padding: 5px 20px;
    border: 1px solid;
    display: inline-block;
    border-radius: 3px;
    border-color: #2c3e50;

    &:hover {
      color: $vue-color;
      border-color: $vue-color;
    }
  }
}
</style>
