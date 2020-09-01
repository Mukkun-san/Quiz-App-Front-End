<template>
  <div class="base-timer">
    <span class="base-timer__label">{{ formattedTimeLeft }}</span>
  </div>
</template>

<script>
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const TIME_LIMIT = 115;
const COLOR_CODES = {
  info: {
    color: "primary"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};
export default {
  props: {
    nbQs: Number
  },
  data() {
    return {
      timePassed: 0,
      timerInterval: null
    };
  },
  computed: {
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
    },
    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
      const minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      return `${minutes}:${seconds}`;
    },
    formattedTimePassed() {
      const timePassed = this.timePassed;
      const minutes = Math.floor(timePassed / 60);
      let seconds = timePassed % 60;
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      return `${minutes}:${seconds}`;
    },
    timeLeft() {
      return TIME_LIMIT * this.nbQs - this.timePassed;
    },
    timeFraction() {
      const rawTimeFraction = this.timeLeft / (TIME_LIMIT * this.nbQs);
      return (
        rawTimeFraction - (1 / (TIME_LIMIT * this.nbQs)) * (1 - rawTimeFraction)
      );
    },
    remainingPathColor() {
      const { alert, warning, info } = COLOR_CODES;
      if (this.timeLeft <= alert.threshold) {
        return alert.color;
      } else if (this.timeLeft <= warning.threshold) {
        return warning.color;
      } else {
        return info.color;
      }
    }
  },
  watch: {
    timePassed() {
      this.$emit(
        "timePassed",
        this.timePassed,
        this.formattedTimePassed,
        TIME_LIMIT
      );
    },
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp();
      }
    }
  },
  mounted() {
    this.startTimer();
  },
  methods: {
    onTimesUp() {
      clearInterval(this.timerInterval);
    },
    startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    }
  }
};
</script>

<style scoped lang="scss">
.base-timer {
  position: relative;
  z-index: 2000;
  right: 1rem;
  width: 80px;
  height: 20px;
  padding: 0;
  margin: 0;
  &__svg {
    transform: scaleX(-1);
  }
  &__circle {
    fill: none;
    stroke: none;
  }
  &__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }
  &__path-remaining {
    stroke-width: 7px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;
    &.primary {
      color: #62d969;
    }
    &.orange {
      color: #f2b705;
    }
    &.red {
      color: red;
    }
  }
  &__label {
    position: absolute;
    width: 80px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
  }
}
</style>
