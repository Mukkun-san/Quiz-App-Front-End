<template>
  <v-container fluid>
    <v-row v-if="e1 <= NewQuiz.length" justify="center" align="center">
      <v-card width="1000" class="mt-6 mx-16">
        <v-stepper v-if="ready" v-model="e1" :vertical="false">
          <template v-for="Qs in NewQuiz">
            <v-stepper-content :key="`${Qs.Question}-c`" :step="Qs.n">
              <h3>
                <b>{{ Qs.n }}-</b>
                {{ Qs.Question }}:
              </h3>
              <v-radio-group v-model="answer" class="ml-6">
                <v-radio
                  :label="Qs.A.toString()"
                  :value="Qs.A.toString()"
                ></v-radio>
                <v-radio
                  :label="Qs.B.toString()"
                  :value="Qs.B.toString()"
                ></v-radio>
                <v-radio
                  :label="Qs.C.toString()"
                  :value="Qs.C.toString()"
                ></v-radio>
                <v-radio
                  :label="Qs.D.toString()"
                  :value="Qs.D.toString()"
                ></v-radio>
              </v-radio-group>
              <v-btn
                color="#62d969"
                v-if="Qs.n < NewQuiz.length"
                @click="click()"
                >Next</v-btn
              >
              <v-btn v-else color="#d9a689" @click="click()"
                >Finish the Quiz</v-btn
              >
            </v-stepper-content>
          </template>
          <v-progress-linear
            color="#04b2d4"
            :value="Math.floor(((e1 - 1) / nbQs) * 100)"
          ></v-progress-linear>
          <v-card>
            <v-container>
              <v-row>
                <v-col>
                  <h3 class="pl-10 font-weight-light">
                    <b>{{ Math.floor(((e1 - 1) / nbQs) * 100) }}%</b> Completed
                  </h3>
                </v-col>
                <v-col>
                  <timer
                    class="float-right"
                    @timePassed="getTime"
                    :nbQs="parseInt(nbQs)"
                    @timeOver="alert('f')"
                  />
                  <p class="float-right pt-2 pr-5">Time Remaining:</p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-stepper>
      </v-card>
    </v-row>
    <v-row v-else>
      <v-card width="100vw" class="mx-5 px-10 elevation-12">
        <h1 class="text-center display-3 py-10">Quiz Result</h1>
        <v-container>
          <v-row>
            <v-col cols="6" sm="6">
              <h1 class="font-weight-regular">
                Finished in:
                <b>{{ parsedTime }}</b>
              </h1>
              <h1 class="font-weight-regular">
                Total Grade:
                <b>{{ Grade }}</b>
              </h1>
            </v-col>
            <v-col cols="6" sm="6">
              <GChart
                style="width: 500px; height: 278px;"
                class="float-right"
                :settings="{ packages: ['corechart', 'table', 'map'] }"
                :options="chartOptions.chart"
                type="PieChart"
                :data="chartData"
              />
            </v-col>
          </v-row>
        </v-container>

        <br />

        <v-data-table
          :headers="tabHeaders"
          :items="Results"
          :items-per-page="5"
          class="px-5 py-5"
          style="font-size:100px;"
        ></v-data-table>

        <br />
        <div class="mx-5 my-5">
          <h2>Additional Information:</h2>
          <h2 class="font-weight-regular">
            Name:
            <b>{{ name }}</b>
          </h2>
          <h2 class="font-weight-regular">
            Email:
            <b>{{ email }}</b>
          </h2>
          <h2 class="font-weight-regular">
            Class:
            <b>{{ className }}</b>
          </h2>
          <h2 class="font-weight-regular">
            Nb Questions:
            <b>{{ nbQs }}</b>
          </h2>
          <h2 class="font-weight-regular">
            Date:
            <b>{{ date }}</b>
            <b></b>
          </h2>
        </div>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import timer from "./timer";
import axios from "axios";
import { GChart } from "vue-google-charts";

export default {
  name: "quiz",
  props: {
    questions: Array,
    nbQs: [String, Number],
    name: String,
    className: [String, Number],
    email: String
  },
  components: {
    timer,
    GChart
  },
  data() {
    return {
      chartData: [
        ["Answer", "Number"],
        ["Correct", 0],
        ["Wrong", 0],
        ["Skipped", 0]
      ],
      chartOptions: {
        chart: {
          title: "Answers:",
          colors: ["#28a745", "#dc3545", "#6c757d"]
        }
      },
      tabHeaders: [
        {
          text: "Question",
          align: "start",
          sortable: false,
          value: "Question"
        },
        { text: "Your Answer", sortable: false, value: "Answer" },
        { text: "Correct Answer", sortable: false, value: "C_Answer" }
      ],
      Results: [],
      answerCount: {},
      Grade: null,
      date: null,

      answer: null,
      Answers: [],
      passedTime: null,
      parsedTime: null,
      quiz: null,

      NewQuiz: [],

      ready: false,
      e1: 1,
      steps: null
    };
  },
  methods: {
    shuffle(arr) {
      console.log(arr);
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
    calcGrade() {
      let CA = 0;
      let WA = 0;
      console.log(this.Answers);
      for (let i = 0; i < this.NewQuiz.length; i++) {
        if (
          this.Answers[i] &&
          this.Answers[i].toUpperCase() ==
            this.NewQuiz[i].Correct_Answer.toUpperCase()
        ) {
          CA++;
        } else {
          WA++;
        }
        this.Results.push({
          Question: this.NewQuiz[i].Question,
          Answer: this.Answers[i] || "---",
          C_Answer: this.NewQuiz[i].Correct_Answer
        });
      }
      this.answerCount.C = this.chartData[1][1] = CA;
      this.answerCount.W = this.chartData[2][1] = WA;

      this.Grade =
        (Math.floor((CA / this.NewQuiz.length) * 100) / 100) * 100 + "%";
      this.date = new Date().toUTCString();
      axios
        .post("https://quizappexcel.herokuapp.com/sheet", {
          name: this.name,
          email: this.email,
          class: this.className,
          date: this.date,
          nbQs: this.nbQs,
          time: this.parsedTime,
          score: this.Grade
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getTime: function(raw, parsed, limit) {
      this.passedTime = raw;
      this.parsedTime = parsed;
      if (raw == limit * this.nbQs) {
        alert("time ran out");
        this.e1 = this.NewQuiz.length;
        this.click();
      }
    },
    click() {
      this.Answers.push(this.answer);
      this.e1++;
      if (this.e1 > this.NewQuiz.length) {
        this.calcGrade();
      }
      this.answer = null;
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.steps = this.nbQs;
      this.ready = true;
      this.NewQuiz = this.shuffle(this.questions);
    });
  }
};
</script>
<style>
@media screen and (min-width: 600px) {
  th {
    padding: 20px !important;
  }
  td,
  tr {
    padding: 20px !important;
    border-top: 1px solid rgb(71, 71, 71);
    border-bottom: 1px solid rgb(71, 71, 71);
  }
  th {
    font-size: 25px !important;
  }
  td {
    font-size: 20px !important;
  }
  .v-data-footer,
  .v-input__append-inner,
  .v-select__selection .v-select__selection--comma {
    font-size: 18px !important;
  }
}
</style>
