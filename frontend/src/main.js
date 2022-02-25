import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import { plugin, defaultConfig } from "@formkit/vue";
import "virtual:windi.css";
import "flowbite";

createApp(App).use(store).use(router).use(plugin, defaultConfig).mount("#app");
