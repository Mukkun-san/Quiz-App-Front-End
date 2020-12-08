<template>
  <div>
    <v-container v-if="!ready" fluid>
      <v-row>
        <v-col cols="12">
          <v-row
            align="center"
            justify="center"
            class="grey lighten-5"
            style="height: 300px;"
          >
            <div class="ma-3 pa-6">
              <v-img height="50" width="50" src="@/assets/loading.gif"></v-img>
            </div>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div v-else-if="stp1 == 1">
      <v-row align="center" justify="center" class="mt-10">
        <v-card width="700" class="elevation-6 py-5 pl-10 pr-10">
          <v-form @submit.prevent ref="form" v-model="validForm">
            <v-row>
              <v-col sm="6">
                <h3>Enter your Name:</h3>
                <v-col sm="10">
                  <v-text-field
                    color="#62D969"
                    placeholder="name"
                    v-model="name"
                    :rules="rules.required"
                  ></v-text-field>
                </v-col>
              </v-col>
              <v-col sm="4">
                <h3>Select your Class:</h3>
                <v-col sm="10">
                  <v-col sm="10">
                    <v-select
                      color="#62D969"
                      :items="ranges"
                      v-model="className"
                      :rules="rules.required"
                    ></v-select>
                  </v-col>
                </v-col>
              </v-col>
            </v-row>

            <v-row>
              <v-col sm="6">
                <h3>Enter your Email to get Questions:</h3>
                <v-col sm="10">
                  <v-text-field
                    color="#62D969"
                    width="10"
                    placeholder="email"
                    v-model="email"
                    :rules="[rules.required, rules.email]"
                  ></v-text-field>
                </v-col>
              </v-col>
              <v-col v-if="email" sm="6">
                <h3>How many Questions?</h3>
                <v-col sm="5">
                  <v-select
                    color="#62D969"
                    :items="[5, 10, 15, 20, 25, 30, 35, 40]"
                    v-model="nbQs"
                    :rules="rules.required"
                  ></v-select>
                </v-col>
              </v-col>
            </v-row>
          </v-form>
          <div class="text-center">
            <p class="red--text" v-if="error">Please Fill all fields</p>
            <v-btn
              class="white--text v-size--large"
              color="#62D969"
              @click="verify()"
              >Start Quiz</v-btn
            >
          </div>
        </v-card>
      </v-row>
    </div>
    <div v-else>
      <quiz
        :nbQs="nbQs"
        :NewQuiz="NewQuiz"
        :className="className"
        :email="email"
        :name="name"
      />
    </div>
  </div>
</template>

<script>
import quiz from "@/components/quiz.vue";
import axios from "axios";
import { API_URL } from "../store/consts";

export default {
  name: "quizForm",
  data() {
    return {
      error: false,
      ready: false,
      stp1: 1,
      validForm: false,
      started: false,

      className: null,
      name: null,
      nbQs: null,
      email: null,

      ranges: [],
      Sheets: [],
      NewQuiz: [],
      rules: {
        required: [value => !!value || "Required."],
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      }
    };
  },
  components: {
    quiz
  },
  mounted() {
    this.$nextTick(function() {
      axios
        .get(API_URL + "/sheets")
        .then(res => {
          console.log(res);
          const temp = res.data;
          this.ranges = temp[0];
          temp.shift();
          this.Sheets = temp;
        })
        .then(() => {
          this.ready = true;
        });
    });
  },
  methods: {
    shuffle(arr) {
      const tempArr = [];
      const exist = [];
      let rand = Math.floor(Math.random() * arr.length);
      var test = [];
      let k = 1;
      while (tempArr.length < this.nbQs) {
        while (exist.includes(rand)) {
          rand = Math.floor(Math.random() * arr.length);
        }
        exist.push(rand);
        test = arr[rand];
        test.n = k;
        k++;
        tempArr.push(test);
      }
      return tempArr;
    },
    verify() {
      if (this.validForm) {
        this.Sheets.forEach(el => {
          if (el.sheet == this.className) {
            if (this.nbQs > el.Questions.length) {
              this.nbQs = el.Questions.length;
            }
            this.NewQuiz = this.shuffle(el.Questions);
          }
        });
        this.stp1 = 2;
        this.error = false;
      } else {
        this.error = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h3 {
  font-weight: 300;
}
</style>
