<template>
  <div>
    <div v-if="!ready">
      <v-img
        height="200"
        width="200"
        src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif"
      ></v-img>
    </div>
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
    <quiz v-else :nbQs="nbQs" :NewQuiz="NewQuiz" :className="className" :name="name" />
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
      .get("http://localhost:3000")
      .then(res => {
        const temp = res.data;
        this.ranges = temp[0];
        temp.shift();
        this.Sheets = temp;
        console.log(this.Sheets);
      })
      .then(res => {
        this.ready = true;
      });
  },
  methods: {
    verify() {
      if (this.validForm) {
        this.Sheets.forEach(el => {
          if (el.sheet == this.className) {
            console.log(el.Questions);
            this.NewQuiz = el.Questions;
          }
        });
        console.log();
        this.stp1 = 2;
        this.error = false;
      } else {
        this.error = true;
      }
    }
  }
};
</script>

<style>
</style>
