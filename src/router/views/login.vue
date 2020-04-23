<script>
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
  },
  data() {
    return {
      email: '',
      password: '',
      authError: null,
      tryingToLogIn: false,
    }
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the email
    // and password they provided.
    tryToLogIn() {
      this.tryingToLogIn = true
      // Reset the authError if it existed.
      this.authError = null
      return this.logIn({
        email: this.email,
        password: this.password,
      })
        .then((token) => {
          this.tryingToLogIn = false

          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
        })
        .catch((error) => {
          this.tryingToLogIn = false
          this.authError = error
        })
    },
  },
}
</script>

<template>
  <v-row justify="center">
    <v-col md="4">
      <h1>Login</h1>

      <form :class="$style.form" @submit.prevent="tryToLogIn">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          name="email"
        />
        <v-text-field
          v-model="password"
          label="Password"
          name="password"
          type="password"
        />
        <v-btn large :loading="tryingToLogIn" color="primary" width="100%" type="submit">
          Log in
        </v-btn>
        <v-alert v-if="authError" type="error" class="mt-4">
          There was an error logging in to your account.
        </v-alert>
      </form>
    </v-col>
  </v-row>
</template>

<style lang="scss" module>
@import '@design';

.form {
  text-align: center;
}
</style>
