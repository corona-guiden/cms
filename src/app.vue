<template>
  <v-app id="app">
    <v-navigation-drawer
            v-if="loggedIn"
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
    >
      <v-list dense>
        <template v-for="item in items">
          <v-row
                  v-if="item.heading"
                  :key="item.heading"
                  align="center"
          >
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col
                    cols="6"
                    class="text-center"
            >

              <a
                      href="#!"
                      class="body-2 black--text"
              >EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
                  v-else-if="item.children"
                  :key="item.text"
                  v-model="item.model"
                  :prepend-icon="item.model ? item.icon : item['icon-alt']"
                  append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
                    v-for="(child, i) in item.children"
                    :key="i"
                    :to="child.to"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
                  v-else
                  :key="item.text"
                  :to="item.to"
                  exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            app
            color="blue darken-3"
            dark
    >
      <v-app-bar-nav-icon v-if="loggedIn" @click.stop="drawer = !drawer" />
      <v-toolbar-title
              style="width: 300px"
              class="ml-0 pl-4"
      >
        <span class="hidden-sm-and-down">Corona Guiden CMS</span>
      </v-toolbar-title>
      <v-text-field
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
              class="hidden-sm-and-down"
      />
      <v-spacer />
      <div v-if="loggedIn">
        <v-btn text small>
          {{ currentUser.name }}
        </v-btn>
        <v-btn small color="teal" @click="logOut">
          Sign out
        </v-btn>
      </div>
    </v-app-bar>
    <v-content>
      <v-container>
        <v-row
                align="start"
                justify="center"
        >
          <v-col align-self="start">
            <v-fade-transition mode="out-in">
              <RouterView :key="$route.fullPath" />
            </v-fade-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import appConfig from '@src/app.config'
  import {authComputed, authMethods} from "./state/helpers";

  export default {
    page: {
      // All subcomponent titles will be injected into this template.
      titleTemplate(title) {
        title = typeof title === 'function' ? title(this.$store) : title
        return title ? `${title} | ${appConfig.title}` : appConfig.title
      },
    },
    computed: {
      ...authComputed,
    },
    methods: {
      ...authMethods,
    },
    data: () => ({
      drawer: null,
      items: [
        { icon: 'mdi-home', text: 'Home', to: {name: 'home'} },
        { icon: 'mdi-archive-arrow-down', text: 'Suggestions', to: {name: 'suggestions'} },
        { icon: 'mdi-help-network', text: 'QNA\'s', to: {name: 'qnas'} }
      ],
    }),
  }
</script>

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
  @import '~nprogress/nprogress.css';

  // ===
  // Vendor
  // ===

  #nprogress .bar {
    background: #39a275;
    height: 5px;
  }
  #nprogress .spinner {
    top: 20px;
  }
  #nprogress .spinner-icon {
    border-top-color: #39a275;
    border-left-color: #39a275;
  }
</style>
