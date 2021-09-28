<template>
  <div class="verify">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card flat class="mx-auto my-5" max-width="500">
        <v-alert v-if="error" align="left" dense outlined type="error">
          {{ error }}
        </v-alert>

        <v-card-title class="text-h6 font-weight-regular justify-space-between">
          <span>Verify</span>
        </v-card-title>
        <v-card-text>
          <span class="mb-4"
            >We've sent you a confirmation code to your business
            phone/email</span
          >
          <v-text-field
            v-model="verificationCode"
            clearable
            label="Verification code"
            required
            :rules="[(v) => !!v || 'This field is required']"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!valid"
            :loading="loading"
            color="primary"
            @click="validate"
          >
            Verify
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  name: "Verify",
  props: ["bid", "business", "code", "issued_by", "verificationId"],
  data: () => ({
    valid: true,
    loading: false,
    verificationCode: null,
    userId: null,
    error: null,
  }),

  created() {},

  computed: {},

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        if (
          this.$route.params.id == this.business &&
          localStorage.getItem("pidtoken") == this.issued_by &&
          this.verificationCode == this.code
        ) {
          // UPDATE
          axios
            .get("/api/user")
            .then((response) => {
              if (response.status && response.status == 200) {
                this.userId = response.data.id;
                this.updateBusinessStatus();
              }
            })
            .catch((errors) => {
              if (errors.response.status == 401) {
                localStorage.removeItem("fyptoken");
                this.$router.push({ name: "Login" });
              }
              if (errors.response.data.exception) {
                // this.exception = errors.response.data.message;
                console.log(errors.response.data.message);
              }
              // this.errors = errors.response.data.errors;
              console.log(errors.response.data.errors);
            });
          // NAVIGATE
        } else {
          this.error = "Incorrect verification code, please try again";
          this.loading = false;
        }
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    updateBusinessStatus() {
      axios({
        url: "/graphql",
        method: "post",
        data: {
          query: `
                mutation updateBusinessStatus($id: ID!, $claimed: Int!, $user: Int!) {
                  updateBusinessStatus(id: $id, claimed: $claimed, user_id: $user) {
                    __id
                  }
                }
              `,
          variables: {
            id: parseInt(this.bid),
            claimed: 1,
            user: parseInt(this.userId),
          },
        },
      })
        .then((result) => {
          console.log(result.data);
          this.deleteVerification();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteVerification() {
      axios({
        url: "/graphql",
        method: "post",
        data: {
          query: `
                mutation deleteBusinessVerification($id: ID!) {
                  deleteBusinessVerification(id: $id) {
                    id
                  }
                }
              `,
          variables: {
            id: this.verificationId,
          },
        },
      })
        .then((result) => {
          this.loading = false;
          console.log(result.data);
          this.$router.push({
            name: "MyBusiness",
            params: {
              id: this.$route.params.id,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
