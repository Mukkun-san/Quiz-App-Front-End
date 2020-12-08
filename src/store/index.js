import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    admin: {
      loggedIn: false
    }
  },
  mutations: {
    adminLogout(state) {
      state.admin.loggedIn = false;
    },
    adminLogin(state) {
      state.admin.loggedIn = true;
    }
  },
  actions: {},
  modules: {}
});
