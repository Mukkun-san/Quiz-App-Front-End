<template>
  <div class="mx-16 my-16">
    <nav-bar></nav-bar>
    <loader v-if="loading" />
    <v-main v-else>
      <v-row>
        <v-col>
          <a
            href="https://docs.google.com/spreadsheets/d/1q_QzlenVYyTuPGDbudIy1vQvFnOhEYJZZecocIwZsKI/edit#gid=178018846"
            style="color:white;text-decoration:none;"
          >
            <v-alert dense type="info">
              Open Associated Speadsheet.
            </v-alert>
          </a>
        </v-col>
      </v-row>

      <br />
      <v-row justify="space-around">
        <v-card class="mx-auto" max-width="300" outlined elevation="5">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4 text-center">
                <h2>
                  Pending <br />
                  Requests
                </h2>
              </div>
              <v-list-item-title class="headline mb-1">
                <h1 class="text-center green--text">{{ requests }}</h1>
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card class="mx-auto" max-width="300" outlined elevation="5">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4 text-center">
                <h2>
                  Total <br />
                  Students
                </h2>
              </div>
              <v-list-item-title class="headline mb-1">
                <h1 class="text-center green--text">{{ students }}</h1>
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-card class="mx-auto" max-width="300" outlined elevation="5">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4 text-center">
                <h2>
                  Total <br />
                  Quizzes
                </h2>
              </div>
              <v-list-item-title class="headline mb-1">
                <h1 class="text-center green--text">{{ quizzes }}</h1>
              </v-list-item-title>
              <v-list-item-subtitle></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-row>
    </v-main>
  </div>
</template>

<script>
import navBar from "@/components/admin/navBar.vue";
import loader from "@/components/loader.vue";
import Axios from "axios";
import { API_URL } from "@/store/consts";

export default {
  components: {
    navBar,
    loader
  },
  data() {
    return {
      loading: true,
      requests: 0,
      students: 0,
      quizzes: 0
    };
  },
  mounted() {
    this.$nextTick(function() {
      Axios.get(API_URL + "/student/all", {
        headers: { authorization: window.localStorage.getItem("adminToken") }
      })
        .then(res => {
          console.log();
          this.requests = res.data.filter(v => {
            return !v.confirmed;
          }).length;
          this.students = res.data.filter(v => {
            return !!v.confirmed;
          }).length;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    });
  }
};
</script>

<style></style>
