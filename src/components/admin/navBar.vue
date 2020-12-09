<template>
  <v-app-bar app color="#62D969">
    <router-link to="/admin/dashboard" class="text-decoration-none">
      <v-btn text class="white--text mx-5">
        Dashboard
      </v-btn>
    </router-link>

    <v-spacer class="mx-auto"></v-spacer>
    <router-link to="/admin/requests" class="text-decoration-none">
      <v-btn text class="white--text mx-5">
        Requests
      </v-btn>
    </router-link>

    <router-link to="/admin/students" class="text-decoration-none">
      <v-btn text class="white--text mx-5">
        Students
      </v-btn>
    </router-link>

    <router-link to="/admin/grades" class="text-decoration-none">
      <v-btn text class="white--text mx-5">
        Grades
      </v-btn>
    </router-link>

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
