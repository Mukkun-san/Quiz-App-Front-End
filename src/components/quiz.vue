<template>
  <div>
    <pre>{{NewQuiz}}</pre>
    <v-stepper v-model="e1" :vertical="vertical" :alt-labels="altLabels">
      <template v-for="n in nbQs">
        <v-stepper-step
          :key="`${n}-step`"
          :complete="e1 > n"
          :step="n"
          :editable="editable"
        >Step {{ n }}</v-stepper-step>

        <v-stepper-content :key="`${n}-content`" :step="n">
          <v-radio-group class="ml-6">
            <v-radio :label="NewQuiz[n-1].A" :value="NewQuiz[n-1].A"></v-radio>
            <v-radio :label="NewQuiz[n-1].B" :value="NewQuiz[n-1].B"></v-radio>
            <v-radio :label="NewQuiz[n-1].C" :value="NewQuiz[n-1].C"></v-radio>
            <v-radio :label="NewQuiz[n-1].D" :value="NewQuiz[n-1].D"></v-radio>
          </v-radio-group>

          <v-btn color="primary" @click="e1++">Next</v-btn>

          <v-btn text>Cancel</v-btn>
        </v-stepper-content>
      </template>
    </v-stepper>
  </div>
</template>

<script>
export default {
  name: "quiz",
  props: {
    NewQuiz: Array,
    nbQs: [String, Number],
    name: String,
    className: [String, Number]
  },
  data() {
    return {
      e1: 1
    };
  },
  methods: {}
};
</script>
