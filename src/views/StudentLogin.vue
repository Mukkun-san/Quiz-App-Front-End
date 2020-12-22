<template>
  <div>
    <nav-bar></nav-bar>
    <v-main>
      <v-card class="mx-auto elevation-5 mt-15 card">
        <v-form v-model="valid">
          <v-container class="mx-auto">
            <h1 class="text-center blue-grey--text">Student Login</h1>
            <v-row>
              <v-col cols="12" md="6" class="mx-auto">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="mx-auto">
                <v-text-field
                  type="password"
                  v-model="password"
                  :rules="passRules"
                  label="Password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="space-around">
              <div>
                <v-btn depressed color="warning" @click="login" class="mx-5">
                  Login
                </v-btn>
                - or -
                <router-link to="/signup" class=" text-decoration-none">
                  <v-btn depressed color="success" class="mx-5">
                    Join Class
                  </v-btn>
                </router-link>
              </div>
            </v-row>
            <v-row justify="space-around">
              <div :class="msgStyle + ' mt-5'" style="min-height:40px">
                <transition name="fade">
                  <pre v-if="msg && msg.length">{{ msg }}</pre>
                </transition>
              </div>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </v-main>
  </div>
</template>

<script>
import navBar from "@/components/navbar.vue";

import Axios from "axios";
import { API_URL } from "@/store/consts";

export default {
  components: {
    navBar
  },
  data: () => ({
    valid: false,
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          v
        ) || "E-mail must be valid"
    ],
    password: "",
    passRules: [v => !!v || "Password is required"],
    msg: "",
    msgStyle: "",
    loading: false
  }),
  methods: {
    login() {
      if (this.valid) {
        const data = {
          email: this.email,
          password: this.password
        };
        this.loading = true;
        Axios.post(API_URL + "/student/login", data)
          .then(res => {
            this.loading = false;
            if (res.data.authorized) {
              const student = {
                accessToken: res.data.accessToken,
                email: res.data.email,
                name: res.data.name,
                class: res.data.class
              };
              console.log(res.data);
              window.localStorage.setItem("student", JSON.stringify(student));
              this.$router.push("/");
            } else {
              this.msg = res.data.msg;
              this.msgStyle = "red--text";
              setTimeout(() => {
                this.msg = "";
              }, 4000);
            }
          })
          .catch(err => {
            console.log(err);
            this.loading = false;
          });
      } else {
        this.msg = "Please verify all information.";
        this.msgStyle = "red--text";
        setTimeout(() => {
          this.msg = "";
        }, 1500);
      }
    }
  }
};
</script>

<style scoped>
@media only screen and (max-width: 600px) {
  .card {
    width: 80vw;
  }
}
@media only screen and (min-width: 600px) {
  .card {
    width: 60vw;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
