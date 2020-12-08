<template>
  <div>
    <nav-bar></nav-bar>
    <v-main>
      <v-card class="mx-auto elevation-5 mt-15 card">
        <v-form v-model="valid">
          <v-container class="mx-auto">
            <h1 class="text-center blue-grey--text">Student Registration</h1>
            <v-row>
              <v-col cols="12" md="6" class="mx-auto">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  label="Full name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
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
            <v-row>
              <v-col cols="12" md="6" class="mx-auto">
                <v-select
                  v-model="classGroup"
                  :items="classes"
                  label="Class"
                  :rules="[v => !!v || 'Select class']"
                  dense
                  required
                ></v-select>
              </v-col>
            </v-row>
            <v-row justify="space-around">
              <div>
                <v-btn
                  depressed
                  color="success"
                  class="mx-5"
                  @click="joinClass"
                >
                  Join Class
                </v-btn>
                - or -
                <router-link to="/login" class=" text-decoration-none">
                  <v-btn depressed color="warning" class="mx-5 ">
                    Login
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
    classes: [],
    valid: false,
    name: "",
    nameRules: [v => !!v || "Name is required"],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          v
        ) || "E-mail must be valid"
    ],
    password: "",
    passRules: [
      v => !!v || "Password is required",
      v => (!!v && v.length > 4) || "Password must have at least 5 chars"
    ],
    classGroup: "",
    msg: "",
    msgStyle: "",
    loading: false
  }),
  methods: {
    joinClass() {
      if (this.valid) {
        const data = {
          fullName: this.name,
          email: this.email,
          password: this.password,
          class: this.classGroup
        };
        this.loading = true;
        Axios.post(API_URL + "/student/signup", data, {
          headers: {
            // remove headers
          }
        })
          .then(res => {
            console.log(res.data);
            this.loading = false;
            this.msg = res.data.msg;
            if (res.data.type === "success") {
              this.msgStyle = "green--text";
            } else {
              this.msgStyle = "red--text";
            }
            setTimeout(() => {
              this.msg = "";
            }, 4000);
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
  },
  mounted() {
    this.$nextTick(function() {
      Axios.get(API_URL + "/sheets", {
        headers: {
          // remove headers
        }
      })
        .then(res => {
          const data = res.data;
          this.classes = data[0];
          this.loading = false;
        })
        .catch(() => {
          alert("error occured");
        });
    });
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
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
