<template>
  <div class="h-full">
    <div class="overflow-auto h-full bg-gray-200 dark:(bg-gray-900 text-white)">
      <Navbar />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";

if (window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.add("dark");
else document.documentElement.classList.add("light");
</script>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
