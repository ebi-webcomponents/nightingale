import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.config.ignoredElements = [
  "nightingale-sequence",
  "nightingale-track",
  "nightingale-manager",
  "nightingale-navigation",
];

new Vue({
  render: (h) => h(App),
}).$mount("#app");
