<template>
  <div
    v-if="user"
    class="grid grid-cols-[minmax(200px,700px)] gap-8 place-content-center p-6"
  >
    <div
      class="max-w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="flex flex-col items-center py-10">
        <svg width="6rem" height="6rem" viewBox="0 0 24 24">
          <g fill="currentColor">
            <path
              d="M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12z M12 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6zm-5 3a5 5 0 1 1 10 0a5 5 0 0 1-10 0z M12 16a5.003 5.003 0 0 0-4.716 3.333a1 1 0 1 1-1.885-.666a7.002 7.002 0 0 1 13.202 0a1 1 0 1 1-1.885.666A5.002 5.002 0 0 0 12 16z"
            ></path>
          </g>
        </svg>
        <h3
          v-if="user"
          class="mb-1 text-xl font-medium text-center text-gray-900 dark:text-white"
        >
          {{ user.first_name + " " + user.last_name }}
        </h3>
        <div
          v-if="user"
          class="text-sm text-center text-gray-500 dark:text-gray-400"
        >
          {{ "@" + user.username }}
        </div>
        <template v-if="me?._id !== user?._id">
          <!-- Add friend -->
          <div v-if="friendStatus === 0" class="flex mt-4 space-x-3 lg:mt-6">
            <button
              @click="store.dispatch('addFriend', route.params.id)"
              class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add friend
            </button>
          </div>

          <!-- Cancel request -->
          <div
            v-else-if="friendStatus === 1"
            class="flex mt-4 space-x-3 lg:mt-6"
          >
            <button
              @click="store.dispatch('deleteFriend', route.params.id)"
              class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Cancel request
            </button>
          </div>

          <!-- Confirm/Delete request -->
          <div
            v-else-if="friendStatus === 2"
            class="flex mt-4 space-x-3 lg:mt-6"
          >
            <button
              @click="store.dispatch('addFriend', route.params.id)"
              class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Confirm request
            </button>
            <button
              @click="store.dispatch('deleteFriend', route.params.id)"
              class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Delete request
            </button>
          </div>

          <!-- Friends -->
          <div
            v-else-if="friendStatus === 3"
            class="flex mt-4 space-x-3 lg:mt-6"
          >
            <button
              @click="store.dispatch('deleteFriend', route.params.id)"
              class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Friends
            </button>
          </div>
        </template>
        <template v-if="me?._id === user?._id">
          <!-- Edit account -->
          <div class="flex mt-4 space-x-3 lg:mt-6">
            <router-link
              :to="{ name: 'MeEdit' }"
              class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Edit account
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <ul class="flex flex-wrap justify-center">
      <li class="mr-2">
        <button
          id="public-button"
          @click="getPublic"
          class="inline-block py-3 px-4 text-sm font-medium text-center rounded-lg text-white bg-blue-600"
        >
          Public
        </button>
      </li>
      <li class="mr-2">
        <button
          id="private-button"
          @click="getPrivate"
          class="inline-block py-3 px-4 text-sm font-medium text-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Private
        </button>
      </li>
    </ul>
    <Post v-for="(post, i) in posts" :key="i" :post="post" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";
import Post from "@/components/Post.vue";
const store = useStore();
const route = useRoute();

const posts_type = ref("PUBLIC");

const getPublic = () => {
  document
    .querySelector("#public-button")
    .classList.remove(
      "text-gray-500",
      "hover:text-gray-900",
      "hover:bg-gray-100",
      "dark:text-gray-400",
      "dark:hover:bg-gray-800",
      "dark:hover:text-white"
    );
  document
    .querySelector("#public-button")
    .classList.add("text-white", "bg-blue-600");
  document
    .querySelector("#private-button")
    .classList.remove("text-white", "bg-blue-600");
  document
    .querySelector("#private-button")
    .classList.add(
      "text-gray-500",
      "hover:text-gray-900",
      "hover:bg-gray-100",
      "dark:text-gray-400",
      "dark:hover:bg-gray-800",
      "dark:hover:text-white"
    );
  posts_type.value = "PUBLIC";
  store.dispatch("getUserPosts", {
    type: "public",
    author_id: route.params.id,
  });
};

const getPrivate = () => {
  document
    .querySelector("#private-button")
    .classList.remove(
      "text-gray-500",
      "hover:text-gray-900",
      "hover:bg-gray-100",
      "dark:text-gray-400",
      "dark:hover:bg-gray-800",
      "dark:hover:text-white"
    );
  document
    .querySelector("#private-button")
    .classList.add("text-white", "bg-blue-600");
  document
    .querySelector("#public-button")
    .classList.remove("text-white", "bg-blue-600");
  document
    .querySelector("#public-button")
    .classList.add(
      "text-gray-500",
      "hover:text-gray-900",
      "hover:bg-gray-100",
      "dark:text-gray-400",
      "dark:hover:bg-gray-800",
      "dark:hover:text-white"
    );
  posts_type.value = "PRIVATE";
  store.dispatch("getUserPosts", {
    type: "private",
    author_id: route.params.id,
  });
};

onMounted(() => {
  store.dispatch("getUser", route.params.id);
  store.dispatch("getUserPosts", {
    type: "public",
    author_id: route.params.id,
  });
});

const user = computed(() => store.state.user);
const me = computed(() => store.state.me);
const posts = computed(() => store.state.posts);
const friendStatus = computed(() => store.getters.friendStatus);

const socket = io(import.meta.env.VITE_BASE_URL + "/friends", {
  withCredentials: true,
});

socket.on(
  "refresh",
  () =>
    store.dispatch("getMe") &&
    store.dispatch("getUser", route.params.id) &&
    store.dispatch("getUsers")
);

if (store.state.me) {
  // console.log("connecting");
  const usersSocket = io(
    import.meta.env.VITE_BASE_URL + "/user/" + me.value._id.toString(),
    {
      withCredentials: true,
    }
  );

  // usersSocket.on("connect", () => console.dir(usersSocket));

  usersSocket.on("PRIVATE", ({ type, author_id }) => {
    // console.log(type, posts_type.value);
    if (type === posts_type.value || type === "GENERAL") {
      store.dispatch("getUserPosts", {
        type: posts_type.value,
        author_id: author_id,
      });
    }
  });

  usersSocket.on("PUBLIC", ({ type, author_id }) => {
    // console.log(type, posts_type.value);
    if (type === posts_type.value || type === "GENERAL") {
      store.dispatch("getUserPosts", {
        type: posts_type.value,
        author_id: author_id,
      });
    }
  });

  // usersSocket.on("disconnect", () => {
  //   console.dir(usersSocket);
  // });

  onBeforeUnmount(() => {
    // console.log("disconnecting");
    usersSocket.disconnect();
  });
}
</script>
