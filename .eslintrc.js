module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/base"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "vue/valid-v-slot": "off",
    "no-unused-vars": "warn",
    "prefer-const": "warn",
    "space-before-function-paren": "off",
    eqeqeq: "off",
    semi: "warn",
    quotes: "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
