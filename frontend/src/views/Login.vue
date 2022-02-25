<template>
  <div class="grid place-items-center h-[calc(100vh-96px)]">
    <div
      class="p-6 md:w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <form class="space-y-6" @submit.prevent="submitForm">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">
          Login to MicroWall
        </h3>
        <div>
          <label
            for="username"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Username</label
          >
          <input
            type="username"
            v-model="username"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Username"
            required="true"
          />
        </div>
        <div>
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Password</label
          >
          <input
            type="password"
            v-model="password"
            placeholder="••••••••"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            required="true"
          />
        </div>
        <button
          type="submit"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login to your account
        </button>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
          Not registered?
          <router-link :to="{ name: 'Register' }">
            <span class="text-blue-700 hover:underline dark:text-blue-500">
              Create account
            </span>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "@/axios";
const store = useStore();
const router = useRouter();

const username = ref("");
const password = ref("");

const submitForm = () =>
  axios
    .post("/api/login", {
      username: username.value,
      password: password.value,
    })
    .then(() => {
      store.dispatch("getToast", {
        type: "success",
        message: "Login successful",
      });
      store.dispatch("getMe");
      store.dispatch("getPostNotifications");
      router.push({ name: "Home" });
    })
    .catch((error) => console.error(error));
</script>
