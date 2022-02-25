<template>
  <div class="bg-white p-4 rounded-lg dark:bg-gray-800">
    <router-link
      :to="{
        name: 'UserId',
        params: { id: post.author._id },
      }"
      v-if="post.author"
    >
      <div class="grid grid-cols-[auto,75px]">
        <div
          class="text-gray-500 text-xl mb-3 dark:text-gray-400 hover:(text-black dark:text-white)"
        >
          {{ post.author.first_name + " " + post.author.last_name }}
        </div>
        <div
          v-if="post?.author"
          class="text-right text-gray-500 text-lg mb-3 dark:text-gray-400"
        >
          {{ post.type }}
        </div>
      </div>
    </router-link>

    <router-link
      :to="{
        name: 'PostId',
        params: { id: post._id },
      }"
    >
      <div v-html="post.text"></div>
    </router-link>
  </div>
</template>

<script setup>
defineProps({
  post: Object,
});
</script>
