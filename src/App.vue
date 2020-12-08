<template>
  <v-app>
    <router-view />
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
