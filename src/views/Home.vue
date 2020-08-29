<template>
  <div class="home">
    <test />
  </div>
</template>

<script>
// @ is an alias to /src
import test from "@/components/test.vue"

export default {
  name: "Home",
  data() {
    return {}
  },
  components: {
    test
  },
  mounted() {
    this.$nextTick(function() {})
  }
}
</script>
