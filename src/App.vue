<template>
  <v-app>
    <v-dialog
        v-model="dialog"
        max-width="300px"
    >

      <v-card-title class="teal lighten-3">
        Current location
      </v-card-title>
      <v-form class="teal lighten-3">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-model="city"
                  label="Add location"
                  type="text"
              >
                <template v-slot:append>
                  <v-fade-transition leave-absolute>
                    <v-btn
                        @click="addLocation"
                        icon>
                      <v-icon>
                        mdi-check-bold
                      </v-icon>
                    </v-btn>
                  </v-fade-transition>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-dialog>
    <v-card
        v-model="locations"
        v-for="(location, index) in locations" :key="index"
        class="teal lighten-3 mx-auto"
        width="200"
    >
      <v-card-text v-if="!settings">
        <v-row align="center">
          <v-col
              cols="8"
              class="pa-4"
          >
            {{ `${location.name}, ${location.sys.country}` }}
          </v-col>
          <v-col
              cols="4"
          >
            <v-btn
                v-if="index < 1"
                @click="openSettings"
                icon
            >
              <v-icon >
                {{ settings ? 'mdi-close' : 'mdi-cog' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider v-if="!settings"></v-divider>

      <v-card-text v-if="!settings" >
        <v-row align="center" >
          <v-col
              align="center"
              class="text-h4 pa-0"
              cols="6"
              dark
          >
            {{ Math.round(location.main.temp) }}&deg;C
          </v-col>
          <v-col cols="6">
            <v-img
                :src="`http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`"
                width="92"
            ></v-img>
          </v-col>
        </v-row>
        <p class="mb-1 ma-0">
          {{ `Feels like ${Math.round(location.main.feels_like)}&deg;C, ${location.weather[0].description}` }}
        </p>
      </v-card-text>

      <v-divider v-if="!settings"></v-divider>

      <v-list-group v-if="!settings">
        <v-list-item class="d-flex justify-space-around flex-wrap teal lighten-4">
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-weather-windy</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle>{{ `${location.wind.speed}m/s`}}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-weather-rainy</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle>{{ `${location.main.humidity}%` }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-subtitle>{{ `Pressure: ${location.main.pressure}hPa` }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-subtitle>{{ `Visibility: ${location.visibility}km` }}</v-list-item-subtitle>
          </v-list-item>
        </v-list-item>
      </v-list-group>
    </v-card>

    <v-card
        v-if="settings"
        class="teal lighten-3 mx-auto"
        width="200"
    >
      <v-card-text>
        <v-row align="center">
          <v-col
              cols="8"
          >
            Settings
          </v-col>
          <v-col cols="4" >
            <v-btn
                @click="openSettings"
                icon
            >
              <v-icon >
                {{ settings ? 'mdi-close' : 'mdi-cog' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <draggable
          v-model="locations"
          handle=".handle"
          @end="onSort"
      >
        <v-card
            v-for="(item, index) in locations" :key="index"
            class="ml-2 mr-2"
        >
          <v-alert
              class="teal lighten-4 pa-1 mt-2">
            <v-btn icon>
              <v-icon class="handle">
                mdi-reorder-horizontal
              </v-icon>
            </v-btn>
            {{ `${item.name}, ${item.sys.country}` }}
            <v-btn icon>
              <v-icon
                  @click="removeLocation(index)"
              >
                mdi-delete
              </v-icon>
            </v-btn>
          </v-alert>
        </v-card>
      </draggable>

      <v-form v-if="settings">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  clean
                  v-model="city"
                  label="Add location"
                  type="text"
              >
                <template v-slot:append>
                  <v-fade-transition leave-absolute>
                    <v-btn
                        @click="addLocation"
                        icon>
                      <v-icon
                      >
                        mdi-check-bold
                      </v-icon>
                    </v-btn>
                  </v-fade-transition>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </v-app>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'App',

  components: {
    draggable,
  },

  data: () => ({
    dialog: true,
    settings: false,
    city: null,
    locations: [],
    location: null,
    index: null,
    key: '91e0e4aba0f156757cb04fbcab6cbc67',
  }),

  created() {
    this.initialize()
  },

  methods: {
    onSort() {
      let index = 0
      localStorage.clear()
      for (const location of this.locations) {
        localStorage.setItem(`${index}`, JSON.stringify(location))
        index += 1
      }
    },

    initialize() {
      if (localStorage.length) {
        this.dialog = false

        for (let index = 0; index < localStorage.length; index++) {
          const dataCities = JSON.parse(localStorage.getItem(`${index}`))
          this.locations.push(dataCities)
        }
      }
    },

    async getLocation(location) {
      let index = localStorage.length
      let response = await
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.key}&units=metric`)

      this.index = index
      this.location = response.data
    },

    openSettings() {
      if (this.settings) {
        this.settings = false
      } else {
        this.settings = true
      }
    },

    async addLocation() {
      await (this.getLocation(this.city))
      if (!localStorage.length) {
        localStorage.setItem(`${this.index}`, JSON.stringify(this.location))
        this.locations.push(this.location)
      } else {
        let a = 0
        for (const location of this.locations) {
          if (this.location.name === location.name) {
            a += 1
          }
        }
        if (a === 0) {
          localStorage.setItem(`${this.index}`, JSON.stringify(this.location))
          this.locations.push(this.location)
        }
      }
      this.dialog = false
    },

    removeLocation(indexLocation) {
      this.locations.splice(indexLocation, 1);
      let index = 0
      localStorage.clear()
      for (const location of this.locations) {
        localStorage.setItem(`${index}`, JSON.stringify(location))
        index += 1
      }
    },
  },
};
</script>

<style>
.v-alert__content {
  justify-content: space-between !important;
  display: flex !important;
  align-items: center;
}
.v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
  margin: 0 auto 0 auto;
  min-width: 24px;
}
.v-card__text {
  padding-bottom: 0;
}
.v-list-item {
  flex: unset;
}
</style>
