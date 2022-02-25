<template>
  <div
    v-if="post"
    class="grid grid-cols-[minmax(200px,700px)] gap-8 place-content-center p-6"
  >
    <div class="bg-white p-4 rounded-lg dark:bg-gray-800">
      <router-link
        v-if="post?.author?._id !== undefined"
        :to="{
          name: 'UserId',
          params: { id: post?.author?._id },
        }"
      >
        <div class="grid grid-cols-[auto,75px]">
          <div
            class="text-gray-500 text-xl mb-3 dark:text-gray-400 hover:(text-black dark:text-white)"
          >
            {{ post?.author?.first_name + " " + post?.author?.last_name }}
          </div>
          <div
            v-if="post?.author"
            class="text-right text-gray-500 text-lg mb-3 dark:text-gray-400"
          >
            {{ post.type }}
          </div>
        </div>
      </router-link>
      <div v-html="post?.text"></div>
    </div>
    <div
      class="p-6 bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <form class="space-y-6" @submit.prevent="submitForm">
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">
          Add comment
        </h3>
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
          Add comment
        </button>
      </form>
    </div>
    <ul v-if="post?.type === 'GENERAL'" class="flex flex-wrap justify-center">
      <li class="mr-2">
        <button
          id="public-comments-button"
          @click="getPublic"
          class="inline-block py-3 px-4 text-sm font-medium text-center rounded-lg text-white bg-blue-600"
        >
          Public
        </button>
      </li>
      <li class="mr-2">
        <button
          id="private-comments-button"
          @click="getPrivate"
          class="inline-block py-3 px-4 text-sm font-medium text-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Private
        </button>
      </li>
    </ul>
    <Comment v-for="(comment, i) in comments" :key="i" :comment="comment" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import axios from "@/axios";
import Autolinker from "autolinker";
import { io } from "socket.io-client";
import Comment from "@/components/Comment.vue";
const store = useStore();
const route = useRoute();

const type = computed(() => store.state.postIdType);
const text = ref("");

const submitForm = () =>
  axios
    .post("/api/comment", {
      _id: route.params.id,
      type: type.value,
      text: Autolinker.link(text.value),
    })
    .then(() => {
      store.dispatch("getToast", {
        type: "success",
        message: "Comment added successfully",
      });
      store.dispatch("getComments", {
        type: type.value,
        id: route.params.id,
      });
      text.value = "";
    })
    .catch((error) => console.error(error));

const getPublic = () => {
  document
    .querySelector("#public-comments-button")
    .classList.remove(
      "text-gray-500",
      "hover:text-gray-900",
      "hover:bg-gray-100",
      "dark:text-gray-400",
      "dark:hover:bg-gray-800",
      "dark:hover:text-white"
    );
  document
    .querySelector("#public-comments-button")
    .classList.add("text-white", "bg-blue-600");
  document
    .querySelector("#private-comments-button")
    .classList.remove("text-white", "bg-blue-600");
  document
    .querySelector("#private-comments-button")
    .classList.add(
      "text-gray-500",
      "hover:text-gray-900",
      "hover:bg-gray-100",
      "dark:text-gray-400",
      "dark:hover:bg-gray-800",
      "dark:hover:text-white"
    );
  // type.value = "PUBLIC";
  store.dispatch("getPostIdType", "PUBLIC");
  store.dispatch("getComments", {
    type: "public",
    id: route.params.id,
  });
  // if (comments.value.length === 0) {
  //   store.dispatch("getToast", {
  //     type: "warning",
  //     message: "No comments to show",
  //   });
  // }
};

const getPrivate = () => {
  document
    .querySelector("#private-comments-button")
    .classList.remove(
      "text-gray-500",
      "hover:text-gray-900",
      "hover:bg-gray-100",
      "dark:text-gray-400",
      "dark:hover:bg-gray-800",
      "dark:hover:text-white"
    );
  document
    .querySelector("#private-comments-button")
    .classList.add("text-white", "bg-blue-600");
  document
    .querySelector("#public-comments-button")
    .classList.remove("text-white", "bg-blue-600");
  document
    .querySelector("#public-comments-button")
    .classList.add(
      "text-gray-500",
      "hover:text-gray-900",
      "hover:bg-gray-100",
      "dark:text-gray-400",
      "dark:hover:bg-gray-800",
      "dark:hover:text-white"
    );
  // type.value = "PRIVATE";
  store.dispatch("getPostIdType", "PRIVATE");
  store.dispatch("getComments", {
    type: "private",
    id: route.params.id,
  });
  // if (comments.value.length === 0) {
  //   store.dispatch("getToast", {
  //     type: "warning",
  //     message: "No comments to show",
  //   });
  // }
};

onMounted(() => {
  store.dispatch("getPost", route.params.id);
  store.dispatch("getComments", {
    type: "public",
    id: route.params.id,
  });
});

const post = computed(() => store.state.post);
const comments = computed(() => store.state.comments);

const socket = io(import.meta.env.VITE_BASE_URL + route.path, {
  withCredentials: true,
});

socket.on("commentsPublic", ({ type, id }) =>
  store.dispatch("getComments", { type, id })
);
socket.on("commentsPrivate", ({ type, id }) =>
  store.dispatch("getComments", { type, id })
);
</script>
