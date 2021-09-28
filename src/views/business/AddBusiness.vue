<template>
  <div class="addabusiness">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card flat class="mx-auto my-5" max-width="500">
        <v-card-title class="text-h6 font-weight-regular justify-space-between">
          <span>{{ currentTitle }}</span>
          <v-avatar
            color="primary lighten-2"
            class="subheading white--text"
            size="24"
            v-text="step"
          ></v-avatar>
        </v-card-title>

        <v-window v-model="step">
          <v-window-item :value="1">
            <v-card-text>
              <v-text-field
                v-model="name"
                clearable
                label="Business name*"
                required
                :rules="[(v) => !!v || 'Business name is required']"
              ></v-text-field>
              <v-autocomplete
                v-model="category"
                clearable
                label="Busines category*"
                :items="categories"
                item-text="category"
                item-value="id"
                required
                :rules="[(v) => !!v || 'Category is required']"
              ></v-autocomplete>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="2">
            <v-card-text>
              <v-text-field
                v-model="address"
                clearable
                label="Street address*"
                required
                :rules="[(v) => !!v || 'Street address is required']"
              ></v-text-field>
              <v-text-field
                v-model="city"
                clearable
                label="City*"
                required
                :rules="[(v) => !!v || 'City is required']"
              ></v-text-field>
              <v-autocomplete
                v-model="state"
                clearable
                label="State*"
                :items="states"
                required
                :rules="[(v) => !!v || 'State is required']"
              ></v-autocomplete>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="3">
            <v-card-text>
              <span class="text-caption grey--text"
                >Drag and zoom the map and position the marker on the exact spot
                where your business is located.
              </span>
              <div class="pa-55">
                <GmapMap
                  :center="getPosition(coords)"
                  :zoom="zoom"
                  style="width: 100%; height: 300px"
                  ref="map"
                >
                  <GmapMarker
                    :position="getPosition(coords)"
                    :clickable="true"
                    :draggable="true"
                    @dragend="handleMarkerDrag"
                  />
                </GmapMap>
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="4">
            <v-card-text>
              <v-text-field
                v-model="phone"
                clearable
                label="Phone number*"
                prefix="+251"
                required
                :rules="phoneRules"
              ></v-text-field>
              <v-text-field
                v-model="email"
                clearable
                label="Email"
              ></v-text-field>
              <v-text-field
                v-model="website"
                clearable
                label="Website"
              ></v-text-field>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="5">
            <v-card-text>
              <v-radio-group v-model="verifyBy">
                <v-radio label="Phone" color="primary" value="phone"></v-radio>
                <v-radio label="Email" color="primary" value="email"></v-radio>
              </v-radio-group>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="6">
            <v-card-text>
              <div class="pa-5">
                <h4 class="text-h4 pa-5">
                  Business Hours Picker Goes Here...
                </h4>
              </div>
            </v-card-text>
          </v-window-item>

          <v-window-item :value="7">
            <div class="pa-4 text-center">
              <h3 class="text-h6 mb-2">
                Your Business Profile ready
              </h3>
              <span class="text-caption grey--text"
                >Thanks for signing up!</span
              >
            </div>
          </v-window-item>
        </v-window>

        <v-divider class="mt-5"></v-divider>

        <v-card-actions>
          <v-btn :disabled="step === 1" text @click="step--">
            Back
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn :hidden="step === 7" color="primary" depressed @click="step++">
            Next
          </v-btn>
          <v-btn
            v-if="step === 7"
            :disabled="!valid"
            :loading="loading"
            color="primary"
            class="mr-4"
            @click="validate"
          >
            Continue
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

import gql from "graphql-tag";

export default {
  name: "AddBusiness",
  data: () => ({
    step: 1,
    valid: true,
    loading: false,
    categories: [],
    states: [
      "Addis Ababa",
      "Dire Dawa",
      "Tigray",
      "Afar",
      "Amhara",
      "Oromia",
      "Somali",
      "Benishangul-Gumuz",
      "Southern Nations Nationalities and Peoples Region",
      "Gambella",
      "Harari",
      "Sidama",
    ],
    name: "",
    category: "",
    address: "",
    city: "",
    state: "",
    coords: {
      lat: 8.997419636,
      lng: 38.757316988,
    },
    zoom: 10,
    phone: "",
    phoneRules: [
      (v) => !!v || "Phone is required",
      (v) => v.length == 9 || "Phone number must be valid",
    ],
    email: "",
    website: "",
    verifyBy: "",
    lat: 8.752757435,
    lng: 38.987726492,
    location: "Placeholder",
    header: "http://localhost:8000/storage/business/header/default.png",
    map: null,
    business_id: null,
    business: null,
    issued_by: localStorage.getItem("pidtoken"),
  }),

  apollo: {
    categories: gql`
      query {
        categories {
          id
          parent_id
          __id
          category
        }
      }
    `,
  },

  created() {
    this.$getLocation({})
      .then((coordinates) => {
        this.coords = coordinates;
      })
      .catch((error) => console.log(error));
  },

  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Start building your Business Profile";
        case 2:
          return "What's the address?";
        case 3:
          return "Where are you located?";
        case 4:
          return "What contact details do you want to show to customers?";
        case 5:
          return "Choose a way to verify";
        case 6:
          return "Add business hours";
        default:
          return "You're done!";
      }
    },
  },

  methods: {
    getPosition(b) {
      return {
        lat: parseFloat(b.lat),
        lng: parseFloat(b.lng),
      };
    },
    handleMarkerDrag(e) {
      this.coords = {
        lat: e.latLng.lat().toFixed(9),
        lng: e.latLng.lng().toFixed(9),
      };
    },
    validate() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        axios({
          url: "/graphql",
          method: "post",
          data: {
            query: `
              mutation createBusiness($category_id: Int!, $business_name: String!, $address: String!, $city: String!, $state: String!, $latitude: Float!, $longitude: Float!, $phone: String!, $email: String, $website: String, $location: String!, $header: String!) {
                createBusiness(category_id: $category_id, business_name: $business_name, address: $address, city: $city, state: $state, latitude: $latitude, longitude: $longitude, telephone_number: $phone, email: $email, website: $website, location: $location, header_image: $header) {
                  id
                  __id
                  business_name
                }
              }
            `,
            variables: {
              category_id: parseInt(this.category),
              business_name: this.name,
              address: this.address,
              city: this.city,
              state: this.state,
              latitude: parseFloat(this.coords.lat),
              longitude: parseFloat(this.coords.lng),
              email: this.email,
              website: this.website,
              phone: "+251" + this.phone,
              location: this.location,
              header: this.header,
            },
          },
        })
          .then((result) => {
            this.business_id = parseInt(result.data.data.createBusiness.id);
            this.business = result.data.data.createBusiness.__id;
            axios({
              url: "/graphql",
              method: "post",
              data: {
                query: `
                mutation createBusinessVerification($business_id: Int!, $code: String!, $issued_by: String!) {
                  createBusinessVerification(business_id: $business_id, code: $code, issued_by: $issued_by) {
                    id
                    business_id
                    code
                    issued_by
                  }
                }
              `,
                variables: {
                  business_id: this.business_id,
                  code: this.code(),
                  issued_by: this.issued_by,
                },
              },
            })
              .then((result) => {
                this.loading = false;
                this.$router.push({
                  name: "Verify",
                  params: {
                    id: this.business,
                    business: this.business,
                    bid: this.business_id,
                    code: result.data.data.createBusinessVerification.code,
                    issued_by:
                      result.data.data.createBusinessVerification.issued_by,
                    verificationId:
                      result.data.data.createBusinessVerification.id,
                  },
                });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    code() {
      return "" + (Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111);
    },
  },
};
</script>

<style></style>
