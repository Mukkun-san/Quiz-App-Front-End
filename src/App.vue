<template>
  <v-app>
    <v-app-bar height="100%" app color="#62D969">
      <div>
        <v-row class="text-center">
          <v-col cols="3" sm="4" class="pt-5">
            <v-col>
              <v-img class="logo" src="./assets/logo.jpg" height="70" @click="home" contain></v-img>
            </v-col>
          </v-col>
          <v-col cols="9" sm="8">
            <v-spacer class="py-8">
              <h1
                id="welcome"
                class="display-1 font-weight-light white--text"
                color="white"
              >Welcome to Shyam Sir Classes!</h1>
            </v-spacer>
          </v-col>
        </v-row>
      </div>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  methods: {
    home: () => {
      location.reload();
    }
  }
};
</script>
<style>
@media screen AND (max-width: 876px) {
  #welcome {
    font-size: 23px !important;
  }
}
.logo {
  cursor: pointer;
}
</style>
