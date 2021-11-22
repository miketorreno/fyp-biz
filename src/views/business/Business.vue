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
                <span v-else class="mr-2">
                  <v-btn
                    small
                    dark
                    :loading="claiming"
                    @click="claim(data.business.id, data.business.__id)"
                  >
                    Claim
                  </v-btn>
                </span>
                <span class="ml-2 mr-3">&bull;</span>

                {{ data.business.business_category.category }}

                <!-- <a href="" class="body-1 ml-1">
                  {{ data.business.category.category }}
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
              <v-tab href="#overview">
                Overveiw
              </v-tab>
              <v-tab href="#reviews">
                Reviews
              </v-tab>
              <v-tab href="#photos">
                Photos
              </v-tab>
              <v-tab href="#about">
                About
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item value="overview">
                <v-card color="basil" text>
                  <v-card-text>
                    <div class="mb-4">
                      <span class="mr-5">
                        <v-icon color="success">mdi-check</v-icon>
                        Takeaway
                      </span>
                      <span class="mr-5">
                        <v-icon color="success">mdi-check</v-icon>
                        Dining
                      </span>
                    </div>
                    <hr />
                    <div class="mt-4">
                      <p class="">
                        <v-icon left>mdi-abacus</v-icon>
                        {{ data.business.address }}
                      </p>
                      <p class="">
                        <v-icon left>mdi-map-marker-outline</v-icon>
                        {{ data.business.city }}
                      </p>
                      <!-- <p class="">
                        <v-icon left>mdi-clock-time-four-outline</v-icon>
                        Hours Placeholder
                      </p> -->
                    </div>
                    <div class="mt-44">
                      <GmapMap
                        :center="mapCenter(data.business)"
                        :zoom="15"
                        style="width: 100%; height: 300px"
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
                    <hr />
                    <v-row class="mt-4">
                      <v-col xs="12" sm="12" md="10" lg="8" xl="8">
                        <!-- <h4>Rate and review</h4>
                        <p>Share your experience to help others</p>
                        <v-form class="mb-6">
                          <v-container>
                            <v-row>
                              <v-col cols="12" md="10">
                                <v-rating
                                  background-color="amber lighten-3"
                                  color="amber"
                                ></v-rating>

                                <v-textarea
                                  clearable
                                  clear-icon="mdi-close-circle"
                                  placeholder="Share details of your own experience at this place"
                                  rows="2"
                                ></v-textarea>

                                <div class="text-right">
                                  <v-btn small color="" class="mr-4" @click="reset">
                                    Cancel
                                  </v-btn>

                                  <v-btn small color="primary">
                                    Submit
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form> -->
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
                            <v-btn-toggle
                              v-model="text"
                              tile
                              color="deep-purple accent-3"
                              group
                            >
                            </v-btn-toggle>
                          </div>
                        </v-list>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item value="reviews">
                <v-card color="basil" text>
                  <v-card-text>
                    <v-row>
                      <v-col xs="12" sm="12" md="10" lg="8" xl="8">
                        <h4>Rate and review</h4>
                        <p>Share your experience to help others</p>
                        <v-form
                          ref="review"
                          v-model="valid"
                          lazy-validation
                          class="mb-6"
                        >
                          <v-container>
                            <v-row>
                              <v-col cols="12" md="10">
                                <v-rating
                                  v-model="rating"
                                  background-color="amber lighten-3"
                                  color="amber"
                                ></v-rating>

                                <v-textarea
                                  v-model="review"
                                  clearable
                                  clear-icon="mdi-close-circle"
                                  placeholder="Share details of your own experience at this place"
                                  rows="2"
                                ></v-textarea>

                                <input
                                  type="hidden"
                                  :value="data.business.id"
                                  ref="business"
                                />

                                <div class="text-right">
                                  <v-btn
                                    small
                                    color=""
                                    class="mr-4"
                                    @click="reset"
                                  >
                                    Cancel
                                  </v-btn>

                                  <v-btn
                                    :disabled="!valid"
                                    @click="validate"
                                    small
                                    color="primary"
                                  >
                                    Submit
                                  </v-btn>
                                </div>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
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
                            <!-- <v-btn-toggle
                              v-model="text"
                              tile
                              color="deep-purple accent-3"
                              group
                            > -->
                            <v-btn small @click="vote(r.id, 1)" class="mr-3">
                              <v-icon left>mdi-thumb-up-outline</v-icon>
                              helpful
                            </v-btn>
                            <span class="subtitle-1 mr-5 mt-4">{{
                              r.voteCount
                            }}</span>

                            <!-- <v-btn
                              small
                              outlined
                              @click="vote(r.id, 0)"
                              class="mr-1"
                            >
                              <v-icon left>mdi-thumb-down-outline</v-icon>
                              {{ r.voteCount }}
                            </v-btn> -->
                            <!-- <span class="subtitle-1 mr-4">{{
                              r.voteCount
                            }}</span> -->
                            <!-- </v-btn-toggle> -->
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
                      <v-col
                        v-for="n in 9"
                        :key="n"
                        class="d-flex child-flex"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                        xl="2"
                      >
                        <v-img
                          :src="
                            `https://picsum.photos/500/300?image=${n * 5 + 10}`
                          "
                          :lazy-src="
                            `https://picsum.photos/10/6?image=${n * 5 + 10}`
                          "
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
              <v-tab-item value="about">
                <v-card color="basil" text>
                  <v-card-text>
                    <p class="">
                      <v-icon left>mdi-abacus</v-icon>
                      {{ data.business.address }}
                    </p>
                    <p class="">
                      <v-icon left>mdi-map-marker-outline</v-icon>
                      {{ data.business.city }}
                    </p>
                    <!-- <p class="">
                      <v-icon left>mdi-clock-time-four-outline</v-icon>
                      Hours Placeholder
                    </p> -->
                    <!-- <p class="">
                      <v-icon left>mdi-silverware</v-icon>
                      Menu
                    </p> -->
                    <p class="">
                      <v-icon left>mdi-map-marker-outline</v-icon>
                      {{ data.business.city }}
                    </p>
                    <p class="">
                      <v-icon left>mdi-phone-outline</v-icon>
                      {{ data.business.telephone_number || "N/A" }}
                    </p>
                    <p class="">
                      <v-icon left>mdi-abacus</v-icon>
                      {{ data.business.email || "N/A" }}
                    </p>
                    <p class="">
                      <v-icon left>mdi-shield-check-outline</v-icon>
                      <v-btn
                        small
                        text
                        depressed
                        :loading="claiming"
                        @click="claim(data.business.id, data.business.__id)"
                      >
                        Claim
                      </v-btn>
                    </p>
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

export default {
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
      valid: true,
      rating: 0,
      review: "",
      claiming: false,
      userId: null,
      business_id: null,
      issued_by: localStorage.getItem("pidtoken"),
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
          .toFixed(9),
        lng: this.map
          .getCenter()
          .lng()
          .toFixed(9),
      };
      let zoom = this.map.getZoom();

      localStorage.center = JSON.stringify(center);
      localStorage.zoom = zoom;
    },
    reset() {
      this.rating = 0;
      this.$refs.review.reset();
    },
    validate() {
      if (this.$refs.review.validate()) {
        if (localStorage.getItem("fyptoken")) {
          axios
            .get("/api/user")
            .then((response) => {
              if (response.status && response.status == 200) {
                this.userId = response.data.id;
                this.submitReview();
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
        } else {
          this.$router.push({ name: "Login" });
        }
        // console.log(this.$refs.business.value, this.rating, this.review);
      }
    },
    submitReview() {
      axios({
        url: "/graphql",
        method: "post",
        data: {
          query: `
            mutation createReview($businessId: Int!, $userId: Int!, $rating: Int!, $review: String!) {
              createReview(business_id: $businessId, user_id: $userId, rating: $rating, review: $review) {
                id
                __id
                rating
                review
              }
            }
          `,
          variables: {
            businessId: parseInt(this.$refs.business.value),
            userId: parseInt(this.userId),
            rating: parseInt(this.rating),
            review: this.review,
          },
        },
      }).then((result) => {
        console.log(result.data);
        this.$router.go();
      });
    },
    vote(r, v) {
      if (localStorage.getItem("fyptoken")) {
        axios
          .get("/api/user")
          .then((response) => {
            if (response.status && response.status == 200) {
              this.userId = response.data.id;
              this.submitVote(r, v);
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
      } else {
        this.$router.push({ name: "Login" });
      }
      console.log(this.userId, r, v);
    },
    submitVote(r, v) {
      axios({
        url: "/graphql",
        method: "post",
        data: {
          query: `
            mutation createVote($reviewId: Int!, $userId: Int!, $vote: Int!) {
              createVote(review_id: $reviewId, user_id: $userId, val: $vote) {
                id
                val
              }
            }
          `,
          variables: {
            reviewId: parseInt(r),
            userId: parseInt(this.userId),
            vote: parseInt(v),
          },
        },
      }).then((result) => {
        console.log(result.data);
      });
    },
    claim(bid, business) {
      this.claiming = true;
      if (localStorage.getItem("fyptoken")) {
        axios
          .get("/api/user")
          .then((response) => {
            if (response.status && response.status == 200) {
              this.userId = response.data.id;
              this.claimBusiness(bid, business);
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
      } else {
        this.$router.push({ name: "Login" });
      }
    },
    claimBusiness(bid, business) {
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
            business_id: parseInt(bid),
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
              id: business,
              business: business,
              bid: parseInt(bid),
              code: result.data.data.createBusinessVerification.code,
              issued_by: result.data.data.createBusinessVerification.issued_by,
              verificationId: result.data.data.createBusinessVerification.id,
            },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    code() {
      return "" + (Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111);
    },
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
          .toFixed(9),
        lng: this.map
          .getCenter()
          .lng()
          .toFixed(9),
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
