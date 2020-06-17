import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.config.ignoredElements = [
  "protvista-sequence",
  "protvista-track",
  "protvista-manager",
  "protvista-navigation"
];

new Vue({
  render: h => h(App)
}).$mount("#app");
