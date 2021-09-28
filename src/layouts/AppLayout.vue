<template>
  <div>
    <v-card class="mx-auto" tile>
      <v-navigation-drawer v-model="drawer" app>
        <div class="d-flex d-md-none">
          <v-list>
            <v-list-item>
              <v-list-item-avatar>
                <v-img
                  src="http://localhost:8000/storage/profile/user.jpg"
                ></v-img>
              </v-list-item-avatar>
            </v-list-item>

            <v-list-item link>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  John Leider
                </v-list-item-title>
                <v-list-item-subtitle>john@vuetifyjs.com</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>

        <v-list class="d-none d-md-flex">
          <v-list-item link :to="{ path: '/' }">
            <v-list-item-content>
              <v-list-item-title class="text-h6 text-center">
                Bizz for Business
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-action> </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list outlined>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              :to="{ path: item.link }"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-card>

    <v-app-bar app flat dense>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-form
        ref="search"
        v-model="valid"
        lazy-validation
        class="search"
        style="width:70%"
      >
        <div class="d-flex">
          <v-text-field
            v-model="query"
            :rules="[(v) => !!v || 'This is required']"
            hide-details
            light
            solo
            denses
            prepend-inner-icon="mdi-magnify"
            flat
            single-line
            clearable
            label="Find and claim your business"
            required
          ></v-text-field>
          <v-btn
            large
            tile
            :disabled="!valid"
            color="primary"
            @click="validate"
            height="48px"
          >
            <v-icon>
              mdi-magnify
            </v-icon>
          </v-btn>
        </div>
      </v-form>

      <v-spacer class="d-none d-md-flex"></v-spacer>

      <v-menu v-model="showMenu">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar class="d-none d-md-flex ml-5" size="42">
            <img
              src="http://localhost:8000/storage/profile/user.jpg"
              v-bind="attrs"
              v-on="on"
            />
          </v-avatar>
        </template>

        <v-list>
          <v-list-item :to="{ path: `/profile/${pidtoken}` }">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="token"
            :to="{ path: '/logout' }"
            @click.prevent="logout"
          >
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-list-item v-else :to="{ path: '/login' }">
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main class="mt-1">
      <v-container fluid>
        <slot></slot>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

// import gql from "graphql-tag";

export default {
  name: "AppLayout",
  data: () => ({
    drawer: null,
    token: localStorage.getItem("fyptoken"),
    pidtoken: localStorage.getItem("pidtoken"),
    selectedItem: null,
    showMenu: false,
    errors: null,
    items: [
      {
        text: "Dashboard",
        icon: "mdi-view-dashboard-outline",
        link: "/",
      },
      {
        text: "Add a Business",
        icon: "mdi-bank-plus",
        link: "/addabusiness",
      },
      {
        text: "Businesses",
        icon: "mdi-office-building-outline",
        link: "/businesses",
      },
      {
        text: "Notifications",
        icon: "mdi-bell-outline",
        link: "/notifications",
      },
      {
        text: "Activities",
        icon: "mdi-chart-line-variant",
        link: "/activities",
      },
      { text: "Settings", icon: "mdi-cog-outline", link: "/settings" },
    ],
    valid: true,
    query: "",
  }),
  methods: {
    logout() {
      axios
        .post("/logout")
        .then((response) => {
          if (response.status) {
            //
          }
          localStorage.removeItem("fyptoken");
          localStorage.removeItem("pidtoken");
          this.token = null;
          this.$router.push({ name: "Login" });
        })
        .catch((errors) => {
          if (errors.response.data.exception) {
            this.exception = errors.response.data.message;
          }
          this.errors = errors.response.data.errors;
          console.log(errors, this.exception, this.errors);
        });
    },
    validate() {
      if (this.$refs.search.validate()) {
        this.$router.push({
          name: "Search",
          params: { query: this.query },
        });
      }
    },
  },
};
</script>
<style>
.container {
  padding: 0 !important;
}
.search .v-text-field,
.search .v-text-field {
  border-radius: 0 !important;
}
</style>
