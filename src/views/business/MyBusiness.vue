<template>
  <div class="business">
    <!-- <v-img
      lazy-src="@/assets/img/coffee_splash.jpg"
      width="100%"
      src="@/assets/img/coffee_splash.jpg"
    ></v-img> -->
    <ApolloQuery
      :query="require('@/graphql/queries/business/Business.gql')"
      :variables="{ id: id }"
    >
      <template v-slot="{ result: { loading, error, data } }">
        <div v-if="loading" class="loading apollo">Loading...</div>
        <div v-else-if="error" class="error apollo">An error occurred</div>
        <div v-else-if="data" class="result apollo">
          <v-card color="basil">
            <v-card-title class="py-4">
              <h4 class="font-weight-bold text-h4 basil--text">
                {{ data.business.business_name }}
              </h4>
            </v-card-title>
            <v-card-subtitle>
              <v-row class="pa-2">
                <v-rating
                  :value="data.business.ratingAvg"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="24"
                ></v-rating>

                <div class="grey--text ms-4 subtitle-1 fs-125">
                  {{ data.business.ratingAvg }} ({{
                    data.business.reviewCount
                  }})
                </div>
              </v-row>
              <v-row class="pa-3">
                <span v-if="data.business.claimed" class="text-uppercase">
                  <v-icon left color="success">
                    mdi-checkbox-marked-circle
                  </v-icon>
                  Claimed
                  <span class="mx-2">&bull;</span>
                </span>

                {{ data.business.business_category.category }}

                <!-- <a href="" class="body-1 ml-1">
                  {{ data.business.business_category.category }}
                </a> -->
                <!-- <span class="mx-1">&bull;</span>
                <span class="body-1">1.8mi</span> -->
              </v-row>
            </v-card-subtitle>

            <v-tabs
              v-model="tab"
              background-color="transparent"
              color="basil"
              grow
            >
              <v-tab href="#about">
                About
              </v-tab>
              <v-tab href="#map">
                Map
              </v-tab>
              <v-tab href="#reviews">
                Reviews
              </v-tab>
              <v-tab href="#photos">
                Photos
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item value="about">
                <v-card color="basil" text>
                  <v-card-text v-if="!editA">
                    <v-btn dark class="float-right" @click="editAbout"
                      >Edit</v-btn
                    >
                    <!-- <p ref="id" class="d-none">{{ data.user.id }}</p> -->
                    <p ref="id" class="d-none">{{ data.business.id }}</p>
                    <p ref="cid" class="d-none">
                      {{ data.business.business_category.id }}
                    </p>
                    <p ref="name" class="d-none">
                      {{ data.business.business_name }}
                    </p>
                    <p class="">
                      <v-icon left>mdi-file-tree-outline</v-icon>
                      <span ref="category">{{
                        data.business.business_category.category
                      }}</span>
                    </p>
                    <p class="">
                      <v-icon left>mdi-road-variant</v-icon>
                      <span ref="address">{{ data.business.address }}</span>
                    </p>
                    <p class="">
                      <v-icon left>mdi-map-marker-outline</v-icon>
                      <span ref="city">{{ data.business.city }}</span>
                    </p>
                    <p class="">
                      <v-icon left>mdi-map-marker-circle</v-icon>
                      <span ref="state">{{ data.business.state }}</span>
                    </p>
                    <p class="">
                      <v-icon left>mdi-map</v-icon>
                      <span ref="lat">{{ data.business.latitude }}</span
                      >,
                      <span ref="lng">{{ data.business.longitude }}</span>
                    </p>
                    <!-- <p class="">
                      <v-icon left>mdi-clock-time-four-outline</v-icon>
                      <span ref="hours">Hours Placeholder</span>
                    </p> -->
                    <!-- <p class="">
                      <v-icon left>mdi-silverware</v-icon>
                      Menu
                    </p> -->
                    <p class="">
                      <v-icon left>mdi-phone-outline</v-icon>
                      <span ref="phone">{{
                        data.business.telephone_number || "N/A"
                      }}</span>
                    </p>
                    <p class="">
                      <v-icon left>mdi-abacus</v-icon>
                      <span ref="email">{{
                        data.business.email || "N/A"
                      }}</span>
                    </p>
                    <p class="">
                      <v-icon left>mdi-at</v-icon>
                      <span ref="website">{{
                        data.business.website || "N/A"
                      }}</span>
                    </p>
                  </v-card-text>
                  <v-card-text v-else>
                    <h2 class="mt-5">Edit Basic Information</h2>
                    <v-row class="mt-2">
                      <v-col cols="12" md="6">
                        <v-form
                          ref="editaboutform"
                          v-model="valid"
                          lazy-validation
                        >
                          <v-text-field
                            v-model="name"
                            :rules="businessNameRules"
                            label="Business Name"
                            required
                          ></v-text-field>

                          <v-text-field
                            v-model="address"
                            :rules="addressRules"
                            label="Address"
                            required
                          ></v-text-field>

                          <v-text-field
                            v-model="city"
                            :rules="cityRules"
                            label="City"
                            required
                          ></v-text-field>

                          <v-text-field
                            v-model="state"
                            :rules="stateRules"
                            label="State"
                            required
                          ></v-text-field>

                          <v-text-field
                            v-model="lat"
                            :rules="latRules"
                            label="Latitude"
                          ></v-text-field>

                          <v-text-field
                            v-model="lng"
                            :rules="lngRules"
                            label="Longitude"
                          ></v-text-field>

                          <v-select
                            v-model="category"
                            :items="categories"
                            item-text="category"
                            item-value="id"
                            label="Category"
                          ></v-select>

                          <v-text-field
                            v-model="website"
                            :rules="websiteRules"
                            label="Website"
                          ></v-text-field>

                          <v-text-field
                            v-model="phone"
                            :rules="phoneRules"
                            label="Phone"
                          ></v-text-field>

                          <v-text-field
                            v-model="email"
                            :rules="emailRules"
                            label="E-mail"
                          ></v-text-field>

                          <v-btn
                            :disabled="!validA"
                            color="primary"
                            class="mr-4"
                            @click="validateAbout"
                          >
                            Update
                          </v-btn>

                          <v-btn class="mr-4" @click="resetAbout">
                            Cancel
                          </v-btn>
                        </v-form>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item value="map">
                <v-card color="basil" text>
                  <v-card-text>
                    <div class="mt-44">
                      <GmapMap
                        :center="mapCenter(data.business)"
                        :zoom="15"
                        style="width: 100%; height: 500px"
                        ref="mapRef"
                        @dragend="handleDrag"
                      >
                        <GmapInfoWindow
                          :options="infoWindowOptions"
                          :position="infoWindowPosition(data.business)"
                          :opened="infoWindowOpened"
                          @closeclick="handleInfoWindowClose"
                        >
                          <div class="info-window">
                            <h2 v-text="data.business.business_name"></h2>
                            <h3 v-text="data.business.address"></h3>
                            <p v-text="data.business.city"></p>
                          </div>
                        </GmapInfoWindow>
                        <!-- <GmapMarker
                          :position="getMyPosition(data.business)"
                          :icon="icon"
                        /> -->

                        <GmapMarker
                          :position="getPosition(data.business)"
                          :clickable="true"
                          :draggable="false"
                          @click="handleMarkerClick(data.business)"
                        />
                      </GmapMap>
                    </div>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item value="reviews">
                <v-card color="basil" text>
                  <v-card-text>
                    <div>
                      <!-- <v-col
                        ><h3>Review count: {{ data.business.reviewCount }}</h3></v-col
                      >
                      <v-col
                        ><h3>
                          Average rating: {{ data.business.ratingAvg }}
                        </h3></v-col
                      > -->
                      <h3 class="mb-3">
                        Reviews Count: {{ data.business.reviewCount }}
                      </h3>
                      <h3 class="mb-3">
                        Average Rating: {{ data.business.ratingAvg }}
                      </h3>
                    </div>
                    <v-row v-if="!data.business.reviews[0]" justify="center">
                      <h3 class="text-h6 my-3">
                        No reviews yet
                      </h3>
                    </v-row>
                    <v-row v-else>
                      <v-col xs="12" sm="12" md="10" lg="8" xl="8">
                        <v-list
                          two-line
                          subheader
                          v-for="r in data.business.reviews"
                          :key="r.__id"
                        >
                          <hr />
                          <v-list-item>
                            <v-list-item-avatar>
                              <v-img :src="r.user.avatar"></v-img>
                            </v-list-item-avatar>
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ r.user.name }}
                              </v-list-item-title>
                              <!-- <v-list-item-subtitle>
                                additional info
                              </v-list-item-subtitle> -->
                            </v-list-item-content>
                          </v-list-item>
                          <div class="mx-4">
                            <v-row class="px-2 py-4">
                              <v-rating
                                :value="r.rating"
                                color="amber"
                                dense
                                half-increments
                                readonly
                                size="14"
                              ></v-rating>

                              <div class="grey--text ms-4">
                                {{ r.created_at }}
                              </div>
                            </v-row>
                            <p>{{ r.review }}</p>
                          </div>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item value="photos">
                <v-card color="basil" text>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="10" lg="8" xl="8">
                        <h2 class="mt-4 mb-2">
                          Upload photos of your business
                        </h2>
                        <v-form
                          ref="photoform"
                          class="mb-4"
                          @submit="uploadPhoto"
                          enctype="multipart/form-data"
                        >
                          <v-file-input
                            v-model="photo"
                            accept="image/*"
                            label="Attach photos"
                            clearable
                          ></v-file-input>
                          <!-- <input
                            type="hidden"
                            name="business_id"
                            :value="data.business.id"
                            required
                          /> -->
                          <div class="text-right">
                            <v-btn color="primary" @click="uploadPhoto">
                              Upload
                            </v-btn>
                          </div>
                        </v-form>
                      </v-col>
                    </v-row>
                    <v-row v-if="!data.business.photos[0]" justify="center">
                      <h3 class="text-h6 my-5">
                        No photos
                      </h3>
                    </v-row>
                    <v-row v-else>
                      <v-col
                        v-for="p in data.business.photos"
                        :key="p.__id"
                        class="d-flex child-flex"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                        xl="2"
                      >
                        <v-img
                          :src="p.url"
                          :lazy-src="p.url"
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
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

import gql from "graphql-tag";

export default {
  name: "MyBusiness",
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
  data() {
    return {
      id: this.$route.params.id,
      // rating: 4,
      tab: null,
      items: ["Overveiw", "Reviews", "Photos", "About"],
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      selectedItem: 1,
      items2: [
        { text: "Real-Time", icon: "mdi-clock" },
        { text: "Audience", icon: "mdi-account" },
        { text: "Conversions", icon: "mdi-flag" },
      ],
      infoWindowOpened: false,
      infoWindowOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      categories: [],
      valid: true,
      rating: 0,
      review: "",
      userId: null,
      bid: "",
      name: "",
      businessNameRules: [
        (v) => !!v || "Business name is required",
        (v) => (v && v.length < 150) || "Enter a valid business name",
      ],
      address: "",
      addressRules: [
        (v) => !!v || "Address is required",
        (v) => v.length < 50 || "Enter a valid address",
      ],
      city: "",
      cityRules: [
        (v) => !!v || "City name is required",
        (v) => v.length < 50 || "Enter a valid city name",
      ],
      state: "",
      stateRules: [
        (v) => !!v || "state is required",
        (v) => v.length < 25 || "Enter a valid state",
      ],
      lat: null,
      latRules: [
        (v) => !!v || "Latitude is required",
        // (v) => (v.value >= -90 && v.value <= 90) || "Latitudes range is from -90 to 90",
      ],
      lng: null,
      lngRules: [
        (v) => !!v || "Longitude is required",
        // (v) => (v.value >= -180 && v.value <= 180) || "longitudes range is from -180 to 180",
      ],
      category: null,
      phone: null,
      phoneRules: [(v) => v.length < 15 || "Phone number must be valid"],
      email: "",
      emailRules: [(v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
      website: "",
      websiteRules: [(v) => v.length < 40 || "Website must be valid"],
      editA: false,
      validA: true,
      photo: null,
    };
  },
  methods: {
    mapCenter(b) {
      return {
        lat: parseFloat(b.latitude),
        lng: parseFloat(b.longitude),
      };
    },
    infoWindowPosition(b) {
      return {
        lat: parseFloat(b.latitude),
        lng: parseFloat(b.longitude),
      };
    },
    getPosition(b) {
      return {
        lat: parseFloat(b.latitude),
        lng: parseFloat(b.longitude),
      };
    },
    getMyPosition(coords) {
      return {
        lat: parseFloat(coords.latitude),
        lng: parseFloat(coords.longitude),
      };
    },
    handleMarkerClick(b) {
      this.activeBusiness = b;
      this.infoWindowOpened = true;
    },
    handleInfoWindowClose() {
      this.activeBusiness = [];
      this.infoWindowOpened = false;
    },
    handleDrag() {
      let center = {
        lat: this.map
          .getCenter()
          .lat()
          .toFixed(7),
        lng: this.map
          .getCenter()
          .lng()
          .toFixed(7),
      };
      let zoom = this.map.getZoom();

      localStorage.center = JSON.stringify(center);
      localStorage.zoom = zoom;
    },
    validateAbout() {
      if (this.$refs.editaboutform.validate()) {
        axios({
          url: "/graphql",
          method: "post",
          data: {
            query: `
              mutation updateBusiness($id: ID!, $business_category_id: Int, $business_name: String!, $address: String!, $city: String!, $state: String, $latitude: Float!, $longitude: Float!, $phone: String, $email: String, $website: String) {
                updateBusiness(id: $id, business_category_id: $business_category_id, business_name: $business_name, address: $address, city: $city, state: $state, latitude: $latitude, longitude: $longitude, telephone_number: $phone, email: $email, website: $website) {
                  id
                  __id
                  business_name
                }
              }
            `,
            variables: {
              id: this.bid,
              business_category_id: parseInt(this.category),
              business_name: this.name,
              address: this.address,
              city: this.city,
              state: this.state,
              latitude: this.lat,
              longitude: this.lng,
              email: this.email,
              website: this.website,
              phone: this.phone,
            },
          },
        }).then((result) => {
          console.log(result.data);
          this.$router.go();
        });
      }
    },
    resetAbout() {
      this.$refs.editaboutform.reset();
      this.editA = false;
    },
    editAbout() {
      this.bid = this.$refs.id.innerText;
      // this.category = this.$refs.business_category.innerText;
      this.name = this.$refs.name.innerText;
      this.address = this.$refs.address.innerText;
      this.city = this.$refs.city.innerText;
      this.state = this.$refs.state.innerText;
      this.lat = parseFloat(this.$refs.lat.innerText);
      this.lng = parseFloat(this.$refs.lng.innerText);
      if (!this.category) {
        this.category = parseInt(this.$refs.cid.innerText);
      }
      if (this.$refs.email.innerText == "N/A") {
        this.email = "";
      } else {
        this.email = this.$refs.email.innerText;
      }
      if (this.$refs.phone.innerText == "N/A") {
        this.phone = "";
      } else {
        this.phone = this.$refs.phone.innerText;
      }
      if (this.$refs.website.innerText == "N/A") {
        this.website = "";
      } else {
        this.website = this.$refs.website.innerText;
      }
      this.editA = true;
    },
    resetPhoto() {
      this.$refs.photoform.reset();
      this.photo = null;
    },
    onChange(e) {
      // this.photo = e.target.photos[0];
      console.log(e.target);
      console.log(this.photo);
    },
    uploadPhoto(e) {
      e.preventDefault();
      let existingObj = this;
      this.bid = this.$refs.id.innerText;

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      let data = new FormData();
      data.append("bid", this.bid);
      data.append("file", this.photo);

      axios
        .post("/upload", data, config)
        .then((res) => {
          console.log(res);
          this.$router.go();
        })
        // .then(function(res) {
        //   console.log(res);
        //   this.$router.go();
        //   console.log("res");
        //   // this.resetPhoto();
        //   // existingObj.success = res.data.success;
        // })
        .catch(function(err) {
          existingObj.output = err;
        });
    },
    // uploadPhoto() {
    // axios({
    //   url: "/graphql",
    //   method: "post",
    //   data: {
    //     query: `
    //         mutation upload($photo: Upload!) {
    //           upload(photo: $photo) {
    //             id
    //           }
    //         }
    //       `,
    //     variables: {
    //       photo: this.photo,
    //     },
    //   },
    // }).then((result) => {
    //   console.log(result.data);
    //   // this.$router.go();
    // });
    // },
  },
  computed: {
    mapCoordinates() {
      if (!this.map) {
        return {
          lat: 0,
          lng: 0,
        };
      }

      return {
        lat: this.map
          .getCenter()
          .lat()
          .toFixed(7),
        lng: this.map
          .getCenter()
          .lng()
          .toFixed(7),
      };
    },
  },
};
</script>

<style>
/* Helper classes */
/* .basil {
  background-color: #fffbe6 !important;
}
.basil--text {
  color: #356859 !important;
} */
.v-application .fs-125 {
  font-size: 1.25rem !important;
}
</style>
