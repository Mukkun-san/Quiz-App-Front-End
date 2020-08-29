<template>
  <div>
    <v-container v-if="!ready" fluid>
      <v-row>
        <v-col cols="12">
          <v-row align="center" justify="center" class="grey lighten-5" style="height: 300px;">
            <div class="ma-3 pa-6">
              <v-img height="50" width="50" src="../assets/loading.gif"></v-img>
            </div>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div v-else-if="stp1==1">
      <v-stepper v-model="stp1" :vertical="true">
        <v-stepper-step :complete="(stp1 > 1) && validForm" :step="1">Enter Information</v-stepper-step>

        <v-stepper-content :step="1">
          <v-form @submit.prevent ref="form" v-model="validForm">
            <v-row>
              <v-col sm="4" md="3">
                <v-text-field label="Name" v-model="name" :rules="rules.required"></v-text-field>
              </v-col>

              <v-col sm="4">
                <v-select
                  :items="ranges"
                  v-model="className"
                  label="Class Name"
                  :rules="rules.required"
                ></v-select>
              </v-col>

              <v-col sm="4">
                <v-text-field
                  type="number"
                  min="5"
                  v-model="nbQs"
                  label="Number of Questions"
                  :rules="rules.required"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <p class="red--text" v-if="error">Please Fill all fields</p>
          <v-btn color="primary" @click="verify()">Start Quiz</v-btn>
        </v-stepper-content>
      </v-stepper>
    </div>
    <div v-else>
      <quiz :nbQs="nbQs" :NewQuiz="NewQuiz" :className="className" :name="name" />
    </div>
  </div>
</template>

<script>
import quiz from "@/components/quiz.vue";
import axios from "axios";

export default {
  name: "test",
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

      ranges: [],
      Sheets: [],
      NewQuiz: [],
      rules: {
        required: [value => !!value || "Required."],
        maxLength: [value => (value || "").length <= 20 || "Max 20 characters"]
      }
    };
  },
  components: {
    quiz
  },
  beforeMount: function() {
    axios
      .get("https://quizappexcel.herokuapp.com/")
      .then(res => {
        const temp = res.data;
        this.ranges = temp[0];
        temp.shift();
        this.Sheets = temp;
      })
      .then(res => {
        this.ready = true;
      });
  },
  methods: {
    shuffle(arr) {
      const tempArr = [];
      const exist = [];
      let rand = Math.floor(Math.random() * arr.length);
      while (tempArr.length < arr.length) {
        while (exist.includes(rand)) {
          rand = Math.floor(Math.random() * arr.length);
        }
        exist.push(rand);
        tempArr.push(arr[rand]);
      }

      return arr;
    },
    verify() {
      if (this.validForm) {
        this.Sheets.forEach(el => {
          if (el.sheet == this.className) {
            console.log(el.Questions);
            if (this.nbQs > el.Questions.length) {
              console.log(this.nbQs + " > " + el.Questions.length);
              this.nbQs = el.Questions.length;
            } else {
              this.nbQs++;
              console.log(this.nbQs + " < " + el.Questions.length);
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
