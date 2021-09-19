<template>
  <div>
    <v-app-bar app flat>
      <v-toolbar-title>Bizz for Business</v-toolbar-title>

      <v-spacer class=""></v-spacer>

      <v-btn v-show="page == 'Register'" plain to="/login" class="mr-4"
        >Login</v-btn
      >
      <v-btn v-show="page == 'Login'" plain to="/register"
        >Create Account</v-btn
      >
    </v-app-bar>

    <v-main>
      <v-container>
        <slot></slot>
      </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: "AuthLayout",
  data: () => ({}),
  computed: {
    page() {
      return this.$route.name;
    },
  },
};
</script>
