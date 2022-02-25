<template>
  <div
    class="grid grid-cols-[repeat(auto-fit,minmax(150px,300px))] gap-8 place-content-center p-6 md:px-16 lg:px-48"
  >
    <User v-for="(user, i) in usersWithoutMe" :key="i" :user="user" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import User from "@/components/User.vue";
const store = useStore();

store.dispatch("getUsers");

const usersWithoutMe = computed(() => store.getters.usersWithoutMe);

onMounted(() => store.dispatch("resetNotification"));

watch(
  () => store.state.notifications,
  () => store.dispatch("resetNotification")
);
</script>
