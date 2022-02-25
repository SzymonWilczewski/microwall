<template>
  <div class="grid place-items-center h-[calc(100vh-96px)]">
    <div
      class="p-6 md:w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <form class="space-y-6" @submit.prevent="submitForm">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">
          What's on your mind?
        </h3>
        <div>
          <label
            for="type"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Post type</label
          >
          <select
            v-model="type"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required="true"
          >
            <option value="GENERAL">General</option>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>
        <div>
          <label
            for="text"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Text</label
          >
          <textarea
            v-model="text"
            rows="4"
            class="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Text"
            required="true"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add post
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import axios from "@/axios";
import Autolinker from "autolinker";
const store = useStore();
const router = useRouter();

const type = ref("");
const text = ref("");

const submitForm = () =>
  axios
    .post("/api/post", {
      type: type.value,
      text: Autolinker.link(text.value),
    })
    .then(() => {
      store.dispatch("getToast", {
        type: "success",
        message: "Post added successfully",
      });
      store.dispatch("getAllPosts", "public");
      router.push({ name: "Home" });
    })
    .catch((error) => console.error(error));
</script>
