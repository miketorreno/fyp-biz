<template>
  <div class="profile">
    <div v-if="!edit">
      <ApolloQuery
        :query="require('@/graphql/queries/User.gql')"
        :variables="{ id: id }"
      >
        <template v-slot="{ result: { loading, error, data } }">
          <div v-if="loading" class="loading apollo">Loading...</div>
          <div v-else-if="error" class="error apollo">An error occurred</div>
          <div v-else-if="data" class="result apollo">
            <v-card color="basil" class="pa-2">
              <v-row>
                <v-col cols="4" sm="3" md="2" lg="2" xl="2">
                  <v-img
                    src="http://localhost:8000/storage/profile/user.jpg"
                    lazy-src="http://localhost:8000/storage/profile/user.jpg"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-col>
                <v-col cols="6" sm="8" md="8" lg="8" xl="8">
                  <v-card-title class="py-4">
                    <h4 ref="name" class="font-weight-bold text-h4 basil--text">
                      {{ data.user.name }}
                    </h4>
                  </v-card-title>
                  <v-card-subtitle>
                    <v-row class="pt-2">
                      <div ref="bio" class="grey--text ms-4 subtitle-1 fs-125s">
                        {{ data.user.bio }}
                      </div>
                    </v-row>
                    <!-- <v-row v-else class="pt-2">
                    <div class="grey--text ms-4 subtitle-1 fs-125s">
                      <v-btn small dark>
                        Add bio
                      </v-btn>
                    </div>
                  </v-row> -->
                    <v-row class="pt-2">
                      <div class="grey--text ms-4 subtitle-1 fs-125s">
                        <v-btn small dark @click="editProfile">
                          Edit Profile
                        </v-btn>
                      </div>
                    </v-row>
                  </v-card-subtitle>
                </v-col>
              </v-row>

              <v-tabs
                v-model="tab"
                background-color="transparent"
                color="basil"
                grow
              >
                <v-tab href="#about">
                  About
                </v-tab>
                <v-tab href="#reviews">
                  Reviews
                </v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab">
                <v-tab-item value="about">
                  <v-card color="basil" text>
                    <v-card-text>
                      <p ref="id" class="d-none">{{ data.user.id }}</p>
                      <!-- <p class="">
                        <v-icon left>mdi-map-marker-outline</v-icon>
                        {{ data.user.__id }}
                      </p> -->
                      <p class="">
                        <v-icon left>mdi-calendar-account</v-icon>
                        {{ data.user.created_at }}
                      </p>
                      <p class="">
                        <v-icon left>mdi-phone-outline</v-icon>
                        <span ref="phone">{{ data.user.phone }}</span>
                      </p>
                      <p class="">
                        <v-icon left>mdi-abacus</v-icon>
                        <span ref="email">{{ data.user.email }}</span>
                      </p>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item value="reviews">
                  <v-card color="basil" text>
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="9">
                          <v-card
                            v-for="(r, index) in data.user.reviews"
                            :key="index"
                            class="mx-auto mb-4"
                            outlineds
                            :to="{
                              path: `/business/${r.business.__id}`,
                            }"
                          >
                            <v-list-item two-line>
                              <v-list-item-avatar tile size="70" color="grey">
                                <v-img :src="r.business.header_image"></v-img>
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title class="text-h6">
                                  {{ r.business.business_name }}
                                </v-list-item-title>
                                <!-- <v-list-item-subtitle>
                                <v-row class="pt-2 pb-2">
                                  <div class="grey--text ms-4 subtitle-1">
                                    additional info
                                  </div>
                                </v-row>
                              </v-list-item-subtitle> -->
                                <v-list-item-subtitle class="mt-2">
                                  <p>{{ r.business.address }}</p>
                                </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                            <div class="mx-4 mb-2">
                              <v-rating
                                :value="r.rating"
                                color="amber"
                                dense
                                half-increments
                                readonly
                                size="17"
                              ></v-rating>
                              <p class="subtitle-1 grey--text">
                                {{ r.review }}
                              </p>
                            </div>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-card>
          </div>

          <!-- No result -->
          <!-- <div v-else class="no-result apollo">No result :(</div> -->
        </template>
      </ApolloQuery>
    </div>
    <div v-else class="pa-2">
      <h2>Edit Profile</h2>
      <v-row>
        <v-col cols="12" md="6">
          <v-form ref="editform" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="phone"
              :rules="phoneRules"
              label="Phone"
              required
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-textarea v-model="bio" label="Bio" auto-grow></v-textarea>

            <v-btn
              :disabled="!valid"
              color="primary"
              class="mr-4"
              @click="validate"
            >
              Update
            </v-btn>

            <v-btn class="mr-4" @click="reset">
              Cancel
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  name: "Profile",
  data: () => ({
    id: localStorage.getItem("pidtoken"),
    tab: null,
    // items: ["About", "Reviews", "Overveiw", "Photos"],
    loading: true,
    errors: null,
    edit: false,
    valid: true,
    uid: null,
    name: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => (v && v.length < 100) || "Enter a valid name",
    ],
    phone: "",
    phoneRules: [(v) => v.length < 15 || "Phone number must be valid"],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    bio: "",
    bioRules: [(v) => v.length < 255 || "Bio must be less than 255 characters"],
  }),
  /*   created() {
    axios
      .get("/api/user")
      .then((response) => {
        if (response.status && response.status == 200) {
          this.name = response.data.name;
          this.email = response.data.email;
        }
      })
      .catch((errors) => {
        if (errors.response.status == 401) {
          localStorage.removeItem("fyptoken");
          this.$router.push({ name: "Login" });
        }
        if (errors.response.data.exception) {
          this.exception = errors.response.data.message;
        }
        this.errors = errors.response.data.errors;
        console.log(errors, this.exception, this.errors);
      })
      .finally(() => (this.loading = false));
  }, */
  methods: {
    validate() {
      if (this.$refs.editform.validate()) {
        axios({
          url: "/graphql",
          method: "post",
          data: {
            query: `
              mutation updateUser($id: ID!, $name: String, $email: String, $phone: String, $bio: String) {
                updateUser(id: $id, name: $name, email: $email, phone: $phone, bio: $bio) {
                  id
                  __id
                  name
                  email
                  phone
                  bio
                }
              }
            `,
            variables: {
              id: this.uid,
              name: this.name,
              email: this.email,
              phone: this.phone,
              bio: this.bio,
            },
          },
        }).then((result) => {
          console.log(result.data);
          this.$router.go();
        });
      }
    },
    reset() {
      this.$refs.editform.reset();
      this.edit = false;
    },
    editProfile() {
      this.uid = this.$refs.id.innerText;
      this.name = this.$refs.name.innerText;
      this.email = this.$refs.email.innerText;
      this.phone = this.$refs.phone.innerText;
      this.bio = this.$refs.bio.innerText;
      this.edit = true;
    },
  },
};
</script>
