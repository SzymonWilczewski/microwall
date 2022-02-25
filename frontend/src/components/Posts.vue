<template>
  <div
    class="grid grid-cols-[minmax(200px,700px)] gap-8 place-content-center p-6"
  >
    <Post v-for="(post, i) in posts" :key="i" :post="post" />
  </div>
</template>

<script setup>
import { onMounted, computed, onUnmounted } from "vue";
import { useStore } from "vuex";
import { io } from "socket.io-client";
import Post from "@/components/Post.vue";
const store = useStore();

onMounted(() => store.dispatch("getAllPosts", "public"));

const posts = computed(() => store.state.posts);

const socket = io(import.meta.env.VITE_BASE_URL + "/posts", {
  withCredentials: true,
});

socket.on("refresh", () => store.dispatch("getAllPosts", "public"));

onUnmounted(() => {
  socket.disconnect();
});
</script>
