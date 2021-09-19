<template>
  <div class="login" align="center" justify="center">
    <v-card class="px-4" max-width="600px" min-width="360px">
      <v-card-title>Login</v-card-title>

      <v-alert v-if="error" align="left" dense outlined type="error">
        {{ error }}
      </v-alert>
      <v-card-text>
        <v-form ref="loginForm" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="loginEmail"
                :rules="loginEmailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="loginPassword"
                :append-icon="show1 ? 'eye' : 'eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                hint="At least 8 characters"
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" cols="12" sm="6" xsm="12"> </v-col>
            <v-spacer></v-spacer>
            <v-col class="d-flex" cols="12" sm="3" xsm="12" align-end>
              <v-btn block :disabled="!valid" color="primary" @click="validate">
                Login
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  name: "Login",
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    },
  },
  methods: {
    handleLogin() {
      this.loading = true;
      axios.get("/sanctum/csrf-cookie").then((response) => {
        if (response.status) {
          //
        }
        axios
          .post("/login", {
            email: this.loginEmail,
            password: this.loginPassword,
          })
          .then((response) => {
            if (response.status && response.status == 200) {
              this.fyptoken = document.cookie
                .split("; ")
                .find((row) => row.startsWith("XSRF-TOKEN="))
                .split("=")[1];
              localStorage.setItem("fyptoken", this.fyptoken);
              axios
                .get("/api/user")
                .then((response) => {
                  if (response.status && response.status == 200) {
                    localStorage.setItem("pidtoken", response.data.__id);
                    this.$router.push({
                      name: "Home",
                    });
                  }
                })
                .catch((errors) => {
                  console.log(errors);
                });
            }
          })
          .catch((errors) => {
            const key = Object.keys(errors.response.data.errors)[0];
            this.error = errors.response.data.errors[key][0];
          })
          .finally(() => (this.loading = false));
      });
    },
    validate() {
      if (this.$refs.loginForm.validate()) {
        // submit form to server/API here...
        this.handleLogin();
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
  // created() {
  //   axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
  //         withCredentials: true,
  //       }).then((response) => {
  //     console.log(response);
  //   });
  // },
  data: () => ({
    valid: true,
    loading: false,
    error: "",
    fyptoken: "",

    loginPassword: "",
    loginEmail: "",
    loginEmailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    emailRules: [
      (v) => !!v || "Required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],

    show1: false,
    rules: {
      required: (value) => !!value || "Required.",
      min: (v) => (v && v.length >= 8) || "Min 8 characters",
    },
  }),
};
</script>
