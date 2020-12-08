<template>
  <div>
    <v-card class="mx-auto elevation-5 mt-15 card">
      <v-form v-model="valid">
        <v-container class="mx-auto pt-10">
          <h1 class="text-center green--text text--lighten-1">Admin Login</h1>
          <br />
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
  </div>
</template>

<script>
import axios from "axios";
import { API_URL } from "@/store/consts";

export default {
  props: {
    classes: Array
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
        axios
          .post(API_URL + "/admin/login", data)
          .then(res => {
            this.loading = false;
            this.msg = res.data.msg;
            if (res.data.authorized) {
              window.localStorage.setItem("adminToken", res.data.accessToken);
              this.$router.push("/admin/dashboard");
            }
            if (res.data.type === "success") {
              this.msgStyle = "green--text";
            } else {
              this.msgStyle = "red--text";
            }
            setTimeout(() => {
              this.msg = "";
            }, 4000);
          })
          .catch(() => {
            this.msg = "Internal Server Error.";
            this.msgStyle = "red--text";
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
