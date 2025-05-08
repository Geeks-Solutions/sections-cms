import Vue from "vue";
import Sections from "@geeks.solutions/vue-sections";

export default function() {
  Vue.use(Sections, {
    projectId: "",
    projectUrl: "",
    environment: ""
  });
}
