<template>
  <div>
    <v-card max-width="450" elevation="5" class="py-8">
      <h1 class="orange--text text-center">- Take a quiz -</h1>
      <br />
      <div>
        <h3 class="text-center">How many Questions?</h3>
        <v-col cols="8" class="mx-auto">
          <v-select
            class="mx-auto"
            color="#62D969"
            :items="[5, 10, 15, 20, 25, 30, 35, 40]"
            v-model="nbQs"
            :rules="[v => !!v || 'Select N° of Questions']"
          >
          </v-select
        ></v-col>
        <v-btn
          class="white--text v-size--large d-block mx-auto"
          color="#62D969"
          @click="start()"
        >
          Start Quiz
        </v-btn>
        <br />
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "startQuiz",
  data() {
    return {
      nbQs: null
    };
  },
  methods: {
    start() {
      this.$emit("startQuiz", this.nbQs);
    }
  }
};
</script>

<style></style>
