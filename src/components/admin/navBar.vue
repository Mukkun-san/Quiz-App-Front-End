<template>
  <v-app-bar app color="#62D969">
    <v-btn text class="white--text mx-5">
      <router-link
        to="/admin/dashboard"
        style="color:white;text-decoration:none;"
        >Dashboard</router-link
      >
    </v-btn>
    <v-spacer class="mx-auto"></v-spacer>
    <v-btn text class="white--text mx-5">
      <router-link
        to="/admin/requests"
        style="color:white;text-decoration:none;"
        >Requests</router-link
      >
    </v-btn>
    <v-btn text class="white--text mx-5">
      <router-link
        to="/admin/students"
        style="color:white;text-decoration:none;"
      >
        Students
      </router-link>
    </v-btn>
    <v-btn text class="white--text mx-5">
      <router-link to="/admin/grades" style="color:white;text-decoration:none;">
        Grades
      </router-link>
    </v-btn>
    <v-spacer class="mx-auto"> </v-spacer>
    <v-btn text class="white--text mx-5" @click="logout">
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "adminNavBar",
  methods: {
    logout() {
      window.localStorage.removeItem("adminToken");
      this.$router.push("/admin/login");
    }
  }
};
</script>

<style scoped></style>
