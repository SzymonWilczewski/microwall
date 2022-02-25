<template>
  <div
    class="max-w-sm bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="flex flex-col items-center py-10">
      <router-link
        v-if="user?._id !== undefined"
        :to="{
          name: 'UserId',
          params: { id: user?._id },
        }"
      >
        <svg width="6rem" height="6rem" viewBox="0 0 24 24" class="mx-auto">
          <g fill="currentColor">
            <path
              d="M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12z M12 8a3 3 0 1 0 0 6a3 3 0 0 0 0-6zm-5 3a5 5 0 1 1 10 0a5 5 0 0 1-10 0z M12 16a5.003 5.003 0 0 0-4.716 3.333a1 1 0 1 1-1.885-.666a7.002 7.002 0 0 1 13.202 0a1 1 0 1 1-1.885.666A5.002 5.002 0 0 0 12 16z"
            ></path>
          </g>
        </svg>
        <h3
          class="mb-1 text-xl font-medium text-center text-gray-900 dark:text-white"
        >
          {{ user.first_name + " " + user.last_name }}
        </h3>
        <div class="text-sm text-center text-gray-500 dark:text-gray-400">
          {{ "@" + user.username }}
        </div>
      </router-link>
      <template v-if="me?._id !== user?._id">
        <!-- Add friend -->
        <div v-if="friendStatus === 0" class="flex mt-4 space-x-3 lg:mt-6">
          <button
            @click="store.dispatch('addFriend', user?._id)"
            class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add friend
          </button>
        </div>

        <!-- Confirm/Delete request -->
        <div v-else-if="friendStatus === 1" class="flex mt-4 space-x-3 lg:mt-6">
          <button
            @click="store.dispatch('addFriend', user?._id)"
            class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Confirm request
          </button>
          <button
            @click="store.dispatch('deleteFriend', user?._id)"
            class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Delete request
          </button>
        </div>

        <!-- Cancel request -->
        <div v-else-if="friendStatus === 2" class="flex mt-4 space-x-3 lg:mt-6">
          <button
            @click="store.dispatch('deleteFriend', user?._id)"
            class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Cancel request
          </button>
        </div>

        <!-- Friends -->
        <div v-else-if="friendStatus === 3" class="flex mt-4 space-x-3 lg:mt-6">
          <button
            @click="store.dispatch('deleteFriend', user?._id)"
            class="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Friends
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { io } from "socket.io-client";
const store = useStore();

const props = defineProps({
  user: Object,
});

const me = computed(() => store.state.me);
const friendStatus = computed(() =>
  props.user &&
  me.value &&
  props.user?.friends.some((friend) => friend.user._id === me.value._id)
    ? props.user.friends.find((friend) => friend.user._id === me.value._id)
        .status
    : 0
);

const socket = io(import.meta.env.VITE_BASE_URL + "/friends", {
  withCredentials: true,
});

socket.on(
  "refresh",
  () =>
    store.dispatch("getMe") &&
    store.dispatch("getUser", props.user._id) &&
    store.dispatch("getUsers")
);
</script>
