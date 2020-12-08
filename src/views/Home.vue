<template>
  <div class="home">
    <nav-bar />
    <v-main>
      <loader v-if="loading" />
      <div v-else>
        <br /><br />
        <h1 class="text-center">Hello {{ student.name }}!</h1>
        <br />
        <v-card v-if="!quizStart" max-width="450" class="mx-auto">
          <start-quiz @startQuiz="startQuiz" />
        </v-card>
        <quiz
          v-else
          :nbQs="nbQs"
          :questions="questions"
          :className="student.class"
          :email="student.email"
          :name="student.name"
        />
        <br />
        <v-row>
          <v-btn
            class="white--text v-size--large d-block mx-auto"
            @click="logout"
            dark
            >Logout</v-btn
          >
        </v-row>
      </div>
    </v-main>
  </div>
</template>

<script>
// @ is an alias to /src
import navBar from "@/components/navbar.vue";
import startQuiz from "@/components/startQuiz.vue";
import loader from "@/components/loader.vue";
import quiz from "@/components/quiz.vue";

import Axios from "axios";
import { API_URL } from "@/store/consts";

export default {
  name: "Home",
  data() {
    return {
      loading: false,
      loggedin: false,
      student: JSON.parse(window.localStorage.getItem("student")),
      questions: [],
      nbQs: 0,
      quizStart: false
    };
  },
  components: {
    navBar,
    startQuiz,
    loader,
    quiz
  },
  methods: {
    startQuiz(nbQs) {
      if (nbQs) {
        this.loading = true;
        this.nbQs = nbQs;
        Axios.get(API_URL + "/sheets/" + this.student.class)
          .then(res => {
            this.loading = false;
            this.questions = res.data;
            this.quizStart = true;
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    logout() {
      window.localStorage.removeItem("student");
      this.$router.push("/login");
    }
  }
};
</script>
