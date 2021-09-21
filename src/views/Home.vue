<template>
  <div class="home">
    <ApolloQuery
      :query="require('@/graphql/queries/business/MyBusinesses.gql')"
      :variables="{ user_id: user_id }"
    >
      <template v-slot="{ result: { loading, error, data } }">
        <div v-if="loading" class="loading apollo">Loading...</div>
        <div v-else-if="error" class="error apollo">An error occurred</div>
        <div v-else-if="data" class="result apollo">
          <v-row
            v-if="!data.my_businesses.businesses[0]"
            class="pa-2 mt-5"
            justify="center"
          >
            <h5 class="text-h6 text-center pa-4">
              No business found.
              <br />
              Find & Claim your business or
              <v-btn plain :to="{ path: '/addabusiness' }" color="primary"
                >add</v-btn
              >
              it here.
            </h5>
          </v-row>
          <v-row v-else class="pa-2">
            <v-col
              v-for="b in data.my_businesses.businesses"
              :key="b.__id"
              xs="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
            >
              <v-card
                :loading="loading"
                class="ma-333"
                :to="{ path: `/mybusiness/${b.__id}`, params: { id: b.__id } }"
              >
                <template slot="progress">
                  <v-progress-linear
                    color="primary"
                    height="10"
                    indeterminate
                  ></v-progress-linear>
                </template>

                <v-img height="150" :src="b.header_image"></v-img>

                <v-card-title>
                  <span class="text-truncate">
                    {{ b.business_name }}
                  </span>
                </v-card-title>

                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <v-rating
                      :value="b.ratingAvg"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                    ></v-rating>

                    <div class="grey--text ms-4">
                      {{ b.ratingAvg }} ({{ b.reviewCount }})
                    </div>
                  </v-row>

                  <div class="mt-4 text-subtitle-1 text-truncate">
                    {{ b.address }}
                  </div>
                </v-card-text>

                <v-divider class="mx-4"></v-divider>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div v-else class="no-result apollo">
          No result :(
        </div>
      </template>
    </ApolloQuery>
  </div>
</template>

<script>
export default {
  data: () => ({
    user_id: localStorage.getItem("pidtoken"),
    loading: false,
    selection: 1,
    items: [
      {
        color: "#1F7087",
        src: "@/assets/img/foster.jpg",
        title: "Supermodel",
        artist: "Foster the People",
      },
      {
        color: "#952175",
        src: "@/assets/img/halcyon.png",
        title: "Halcyon Days",
        artist: "Ellie Goulding",
      },
    ],
  }),
  methods: {
    reserve() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 2000);
    },
  },
};
</script>

<style>
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
}
/* .horizontal-scroll::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
} */
</style>
