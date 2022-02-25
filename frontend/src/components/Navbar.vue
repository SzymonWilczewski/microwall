<template>
  <nav
    class="sticky w-11/12 mx-auto my-4 bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded-xl dark:bg-gray-800"
  >
    <div class="container flex flex-wrap justify-between items-center mx-auto">
      <router-link :to="{ name: 'Home' }" class="flex">
        <svg class="mr-3" width="2.5rem" height="2.5rem" viewBox="0 0 20 20">
          <path
            d="M9.546 17.258h.955v2.143c6.51-.684 9.982-7.143 9.421-11.691C19.358 3.16 14.471.018 8.978.69C3.486 1.364-.49 5.598.072 10.149c.513 4.138 4.602 7.113 9.474 7.109zm6.148-4.398h-1.831V7.907a2.78 2.78 0 0 0-.053-.557a.926.926 0 0 0-.164-.381a.808.808 0 0 0-.33-.244c-.152-.066-.363-.1-.623-.1c-.537 0-.957.141-1.251.416c-.291.273-.433.633-.433 1.1v4.719h-1.83V7.907c0-.205-.019-.395-.059-.564a1.006 1.006 0 0 0-.173-.387a.757.757 0 0 0-.314-.237a1.5 1.5 0 0 0-.58-.094c-.312 0-.58.059-.795.174c-.223.117-.405.26-.541.422a1.627 1.627 0 0 0-.299.506c-.062.172-.092.31-.092.414v4.719H4.494V5.164h1.758v.6c.574-.508 1.306-.766 2.181-.766c.51 0 .981.103 1.399.305c.306.147.554.365.738.652c.231-.248.504-.451.814-.609a3.271 3.271 0 0 1 1.499-.348c.402 0 .773.043 1.102.127c.343.086.644.225.895.412c.258.193.46.445.602.75c.141.301.212.66.212 1.07v5.503z"
            fill="currentColor"
          ></path>
        </svg>
        <span class="self-center text-lg font-semibold whitespace-nowrap"
          >MicroWall</span
        >
      </router-link>
      <div class="flex items-center md:order-2">
        <button
          type="button"
          class="flex mr-3 text-sm rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="dropdown"
        >
          <span class="sr-only">Open user menu</span>
          <svg width="2.5rem" height="2.5rem" viewBox="0 0 24 24">
            <g fill="currentColor">
              <path
                d="M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12z M12 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6zm-5 3a5 5 0 1 1 10 0a5 5 0 0 1-10 0z M12 16a5.003 5.003 0 0 0-4.716 3.333a1 1 0 1 1-1.885-.666a7.002 7.002 0 0 1 13.202 0a1 1 0 1 1-1.885.666A5.002 5.002 0 0 0 12 16z"
              ></path>
            </g>
          </svg>
        </button>
        <!-- Dropdown menu -->
        <div
          class="hidden z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:(bg-gray-700 divide-gray-600)"
          id="dropdown"
        >
          <div v-if="me" class="py-3 px-4">
            <span class="block text-sm text-gray-900 dark:text-white">{{
              me.first_name + " " + me.last_name
            }}</span>
            <span
              class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400"
              >@{{ me.username }}</span
            >
          </div>
          <ul class="py-1" aria-labelledby="dropdown">
            <li v-if="!me">
              <router-link :to="{ name: 'Login' }">
                <div
                  class="w-full block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Login
                </div>
              </router-link>
            </li>
            <li v-if="!me">
              <router-link :to="{ name: 'Register' }">
                <div
                  class="w-full block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Register
                </div>
              </router-link>
            </li>
            <li v-if="me">
              <router-link
                :to="{
                  name: 'UserId',
                  params: { id: me._id },
                }"
              >
                <div
                  class="w-full block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  My account
                </div>
              </router-link>
            </li>
            <li v-if="me">
              <form @submit.prevent="submitForm">
                <button
                  type="submit"
                  class="w-full block py-2 px-4 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Logout
                </button>
              </form>
            </li>
          </ul>
        </div>
        <button
          data-collapse-toggle="mobile-menu-2"
          type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg
            class="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <svg
            class="hidden w-6 h-6"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
      <div
        class="hidden justify-between items-center w-full md:flex md:w-auto md:order-1"
        id="mobile-menu-2"
      >
        <ul
          class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium"
        >
          <li>
            <router-link :to="{ name: 'Home' }">
              <div
                v-if="me"
                class="text-gray-700 dark:text-gray-400 md:(hover:text-blue-700 dark:hover:text-white)"
                :class="{
                  'text-blue-700 !dark:text-white': route.name === 'Home',
                }"
              >
                Posts {{ postNotifications }}
              </div>
              <div
                v-else
                class="text-gray-700 dark:text-gray-400 md:(hover:text-blue-700 dark:hover:text-white)"
                :class="{
                  'text-blue-700 !dark:text-white': route.name === 'Home',
                }"
              >
                Posts
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Users' }">
              <div
                v-if="me"
                class="text-gray-700 dark:text-gray-400 md:(hover:text-blue-700 dark:hover:text-white)"
                :class="{
                  'text-blue-700 !dark:text-white': route.name === 'Users',
                }"
              >
                Users {{ notifications }}
              </div>
              <div
                v-else
                class="text-gray-700 dark:text-gray-400 md:(hover:text-blue-700 dark:hover:text-white)"
                :class="{
                  'text-blue-700 !dark:text-white': route.name === 'Users',
                }"
              >
                Users
              </div>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'AddPost' }">
              <div
                class="text-gray-700 dark:text-gray-400 md:(hover:text-blue-700 dark:hover:text-white)"
                :class="{
                  'text-blue-700 !dark:text-white': route.name === 'AddPost',
                }"
              >
                Add post
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <Toasts />
  </nav>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import axios from "@/axios";
import { io } from "socket.io-client";
import Toasts from "@/components/Toasts.vue";
const store = useStore();
const router = useRouter();
const route = useRoute();

onMounted(() => store.dispatch("getMe"));

const submitForm = () =>
  axios
    .post("/api/logout")
    .then(() => {
      store.dispatch("getToast", {
        type: "success",
        message: "Logout successful",
      });
      store.dispatch("deleteMe");
      router.push({ name: "Home" });
    })
    .catch((error) => console.error(error));

const me = computed(() => store.state.me);
const notifications = computed(() => store.state.notifications);
const postNotifications = computed(() => store.state.postNotifications);

const notificationsSocket = io(
  import.meta.env.VITE_BASE_URL + "/friends/notifications",
  {
    withCredentials: true,
  }
);

// const meId = computed(() => store.getters.meId);
// socket.on(meId.value, (x) => console.log(x));
// if (store.state.me) {
//   console.log(store.state.me?._id);
//   socket.on(store.state.me?._id.toString(), () => store.dispatch("getMe"));
// }
notificationsSocket.on("+", (id) => store.dispatch("increaseNotification", id));
notificationsSocket.on("-", (id) => store.dispatch("decreaseNotification", id));

store.dispatch("getPostNotifications");

const postNotificationsSocket = io(
  import.meta.env.VITE_BASE_URL + "/post/notifications",
  {
    withCredentials: true,
  }
);

postNotificationsSocket.on("refresh", () =>
  store.dispatch("getPostNotifications")
);

// io
watch(
  () => store.state.me,
  (me) => {
    if (me) {
      // console.log("/user/" + me._id);
      const socket = io(import.meta.env.VITE_BASE_URL + "/user/" + me._id, {
        withCredentials: true,
      });

      // socket.on("connect", () => console.dir(socket));

      socket.on("getAllPosts", (type) => {
        // console.log("getAllPosts");
        store.dispatch("getAllPosts", type);
      });

      socket.on("getUserPosts", ({ type, author_id }) => {
        // console.log("getUserPosts");
        store.dispatch("getUserPosts", { type, author_id });
      });

      // socket.on("disconnect", () => {
      //   console.dir(socket);
      // });

      // socket.on("getPostNotifications", () => {
      //   console.log("getPostNotifications");
      //   store.dispatch("getPostNotifications");
      // });
    }
  }
);
</script>
