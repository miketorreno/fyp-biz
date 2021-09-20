<template>
  <div class="pa-2 review">
    <v-row>
      <v-col cols="12" md="10">
        <!-- <h2 class="mt-4">Results (32)</h2> -->
      </v-col>
      <v-col class="" cols="12" md="10">
        <!-- <h3 class="mb-3">See the business you’d like to review?</h3> -->
        <v-row v-if="!result[0]" class="pa-2 mt-5" justify="center">
          <h5 class="text-h6 text-center pa-4">
            No result found.
            <br />
            Refine your search and try agin or
            <v-btn plain :to="{ path: '/addabusiness' }" color="primary"
              >add</v-btn
            >
            it here.
          </h5>
        </v-row>
        <v-row v-else>
          <v-col cols="12" md="10">
            <v-card
              v-for="b in result"
              :key="b.__id"
              class="mx-auto mb-4"
              outlineds
              :to="{ path: `/business/${b.__id}` }"
            >
              <v-list-item three-line>
                <v-list-item-avatar tile size="90" color="grey">
                  <v-img :src="b.header_image"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-h6">
                    {{ b.business_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-row class="pa-2">
                      <v-rating
                        :value="4.5"
                        color="amber"
                        dense
                        half-increments
                        readonly
                        size="22"
                      ></v-rating>

                      <div class="grey--text ms-4 subtitle-1">
                        4.5 (413)
                      </div>
                    </v-row>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <p>{{ b.address }}</p>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8000";

export default {
  name: "Search",
  data: () => ({
    result: null,
    query: "",
  }),
  watch: {
    "$route.params.query": function() {
      this.search();
    },
  },
  created() {
    this.search();
  },
  methods: {
    search() {
      (this.query = this.$route.params.query),
        axios({
          url: "/graphql",
          method: "post",
          data: {
            query: `
            query {
              search(search: "${this.$route.params.query}") {
                __id
                business_name
                address
                header_image
                category {
                  id
                }
              }
            }
          `,
          },
        }).then((result) => {
          this.result = result.data.data.search;
          // if (this.result[0]) {
          //   console.log("results in ... sec");
          //   console.log(this.result[0]);
          // }
          // console.log("no results found");
          // // console.log(this.result);
        });
    },
  },
};
</script>

<style>
.search .v-text-field,
.search .v-text-field {
  border-radius: 0 !important;
}
.v-application .fs-125 {
  font-size: 1.25rem !important;
}
</style>
