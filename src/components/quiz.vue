<template>
  <v-container fluid>
    <v-row v-if="e1 <= NewQuiz.length" justify="center" align="center">
      <timer @timePassed="getTime" :nbQs="parseInt(nbQs)" @timeOver="alert('f')" />
      <v-card width="1000" class="mt-6">
        <v-row style="visibility:hidden; display:none">
          <v-col cols="12">
            <v-slider v-model="steps" label="steps"></v-slider>
          </v-col>
          <v-switch v-model="vertical" label="Vertical"></v-switch>
          <v-switch v-model="altLabels" label="altLabels"></v-switch>
          <v-switch v-model="editable" label="Editable"></v-switch>
        </v-row>

        <v-stepper v-if="ready" v-model="e1" vertical>
          <template v-if="vertical">
            <template v-for="Qs in NewQuiz">
              <v-stepper-step
                :key="`${Qs.Question}-qs`"
                :complete="e1 > Qs.n"
                :step="Qs.n"
                :editable="editable"
              >{{Qs.Question}}</v-stepper-step>

              <v-stepper-content :key="`${Qs.Question}-c`" :step="Qs.n">
                <v-radio-group v-model="answer" class="ml-6">
                  <v-radio :label="Qs.A.toString()" :value="Qs.A.toString()"></v-radio>
                  <v-radio :label="Qs.B.toString()" :value="Qs.B.toString()"></v-radio>
                  <v-radio :label="Qs.C.toString()" :value="Qs.C.toString()"></v-radio>
                  <v-radio :label="Qs.D.toString()" :value="Qs.D.toString()"></v-radio>
                </v-radio-group>
                <v-btn v-if="Qs.n < NewQuiz.length" color="primary" @click="click();">Next</v-btn>
                <v-btn v-else color="green" @click="click();">Finish the Quiz</v-btn>
              </v-stepper-content>
            </template>
          </template>
          <template v-else>
            <v-stepper-header>
              <template v-for="n in steps">
                <v-stepper-step
                  :key="`${n}-step`"
                  :complete="e1 > n"
                  :step="n"
                  :editable="editable"
                >Step {{ n }}</v-stepper-step>

                <v-divider v-if="n !== steps" :key="n"></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
                <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

                <v-btn color="primary" @click="nextStep(n)">Continue</v-btn>

                <v-btn text>Cancel</v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </template>
        </v-stepper>
      </v-card>
    </v-row>
    <v-row v-else>
      <v-card width="100vw" class="mx-5 px-10">
        <div>
          <h1 class="text-center display-3 py-10">Quiz Result</h1>
          <h1 class="font-weight-regular">
            Finished in:
            <b>{{parsedTime}}</b>
          </h1>
          <h1 class="font-weight-regular">
            Correct Answers:
            <b>{{answerCount.C}}</b>
          </h1>
          <h1 class="font-weight-regular">
            Wrong Answers:
            <b>{{answerCount.W}}</b>
          </h1>
          <h1 class="font-weight-regular">
            Total Grade:
            <b>{{Grade}}</b>
          </h1>
        </div>

        <br />

        <v-data-table
          :headers="tabHeaders"
          :items="Results"
          :items-per-page="5"
          class="px-5 py-5 elevation-8"
          style="font-size:100px;"
        ></v-data-table>

        <br />
        <div class="mx-5 my-5">
          <h2 class="font-weight-regular">
            Name:
            <b>{{name}}</b>
          </h2>
          <h2 class="font-weight-regular">
            Class:
            <b>{{className}}</b>
          </h2>
          <h2 class="font-weight-regular">
            Nb Questions:
            <b>{{nbQs}}</b>
          </h2>
          <h2 class="font-weight-regular">
            Date:
            <b>{{date}}</b>
            <b></b>
          </h2>
        </div>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import timer from "./timer";
export default {
  name: "quiz",
  props: {
    NewQuiz: Array,
    nbQs: [String, Number],
    name: String,
    className: [String, Number]
  },
  components: {
    timer
  },
  data() {
    return {
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

      ready: false,
      e1: 1,
      steps: null,

      vertical: true,
      altLabels: false,
      editable: false
    };
  },
  methods: {
    calcGrade() {
      let CA = 0;
      let WA = 0;
      console.log(this.Answers);
      for (let i = 0; i < this.NewQuiz.length; i++) {
        if (this.Answers[i] == this.NewQuiz[i].Correct_Answer) {
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
      this.answerCount.C = CA;
      this.answerCount.W = WA;
      this.Grade =
        (Math.floor((CA / this.NewQuiz.length) * 100) / 100) * 100 + "/100";
      this.date = new Date().toUTCString();
    },
    getTime: function(raw, parsed) {
      this.passedTime = raw;
      this.parsedTime = parsed;
      if (raw == 10 * this.nbQs) {
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
  watch: {
    vertical() {
      this.e1 = 2;
      requestAnimationFrame(() => (this.e1 = 1)); // Workarounds
    },
    e1() {}
  },
  beforeMount() {
    this.steps = this.nbQs;
  },
  mounted() {
    this.$nextTick(function(x) {
      this.ready = true;
    });
  }
};
</script>
<style>
th,
td,
tr {
  padding: 20px !important;
  border-top: 2px solid rgb(71, 71, 71);
  border-bottom: 2px solid rgb(71, 71, 71);
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
</style>
