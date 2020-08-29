<template>
  <v-container fluid>
    {{steps}}
    {{nbQs}}
    <v-row v-if="(this.e1 <= this.steps - 1)" justify="center" align="center">
      <timer @timePassed="getTime" :nbQs="parseInt(nbQs)" />
      <v-card width="1000" class="mt-6">
        <v-row style="visibility:hidden; display:none">
          <v-col cols="12">
            <v-slider v-model="steps" label="steps"></v-slider>
          </v-col>
          <v-switch v-model="vertical" label="Vertical"></v-switch>
          <v-switch v-model="altLabels" label="altLabels"></v-switch>
          <v-switch v-model="editable" label="Editable"></v-switch>
        </v-row>

        <v-stepper v-model="e1" vertical>
          <template v-if="vertical">
            <template v-for="n in steps">
              <v-stepper-step
                :key="`${n}-step`"
                :complete="e1 > n"
                :step="n"
                :editable="editable"
              >{{NewQuiz[n-1].Question}}</v-stepper-step>

              <v-stepper-content :key="`${n}-content`" :step="n">
                <v-radio-group v-model="answer" class="ml-6">
                  <v-radio :label="NewQuiz[n-1].A" :value="NewQuiz[n-1].A"></v-radio>
                  <v-radio :label="NewQuiz[n-1].B" :value="NewQuiz[n-1].B"></v-radio>
                  <v-radio :label="NewQuiz[n-1].C" :value="NewQuiz[n-1].C"></v-radio>
                  <v-radio :label="NewQuiz[n-1].D" :value="NewQuiz[n-1].D"></v-radio>
                </v-radio-group>
                <v-btn color="primary" @click="click();">Continue</v-btn>
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
      answer: null,
      Answers: [],
      passedTime: null,

      ready: false,
      e1: 1,
      steps: null,
      vertical: true,
      altLabels: false,
      editable: false
    };
  },
  methods: {
    getTime: function(val) {
      this.passedTime = val;
    },
    click() {
      this.Answers.push(this.answer);
      console.log(this.Answers);
      this.e1++;
    }
  },
  watch: {
    vertical() {
      this.e1 = 2;
      requestAnimationFrame(() => (this.e1 = 1)); // Workarounds
    },
    e1() {
      if (this.e1 > this.steps - 1) {
        alert("done");
      }
    }
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
