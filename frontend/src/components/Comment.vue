<template>
  <div class="bg-white p-4 rounded-lg dark:bg-gray-800">
    <router-link
      v-if="comment?.author"
      :to="{
        name: 'UserId',
        params: { id: comment?.author?._id },
      }"
    >
      <div
        class="text-gray-500 text-xl mb-3 dark:text-gray-400 hover:(text-black dark:text-white)"
      >
        {{ comment?.author?.first_name + " " + comment?.author?.last_name }}
      </div>
    </router-link>
    <div v-html="comment?.text"></div>
  </div>
</template>

<script setup>
defineProps({
  comment: Object,
});
</script>
