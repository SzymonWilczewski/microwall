<template>
  <div class="grid place-items-center h-[calc(100vh-96px)]">
    <div
      class="p-6 md:w-sm bg-white rounded-lg border border-gray-200 shadow-md sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <FormKit
        id="form"
        type="form"
        v-model="form"
        :actions="false"
        form-class="space-y-6"
        @submit="submitForm"
        message-class="text-sm text-red-600 dark:text-red-500"
      >
        <h3 class="text-xl font-medium text-gray-900 dark:text-white">
          Edit your account
        </h3>

        <!-- First name -->
        <FormKit
          type="text"
          name="first_name"
          label="First name"
          label-class="block text-sm font-medium text-gray-900 dark:text-gray-300"
          input-class="bg-gray-50 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="First name"
          validation="alpha|length:2,64"
          validation-visibility="live"
          message-class="text-sm text-red-600 dark:text-red-500"
        />

        <!-- Last name -->
        <FormKit
          type="text"
          name="last_name"
          label="Last name"
          label-class="block text-sm font-medium text-gray-900 dark:text-gray-300"
          input-class="bg-gray-50 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Last name"
          validation="alpha|length:2,64"
          validation-visibility="live"
          message-class="text-sm text-red-600 dark:text-red-500"
        />

        <!-- Username -->
        <FormKit
          type="text"
          name="username"
          label="Username"
          label-class="block text-sm font-medium text-gray-900 dark:text-gray-300"
          input-class="bg-gray-50 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Username"
          validation="length:2,64"
          validation-visibility="live"
          message-class="text-sm text-red-600 dark:text-red-500"
        />

        <!-- Old password -->
        <FormKit
          type="password"
          name="old_password"
          label="Old password"
          label-class="block text-sm font-medium text-gray-900 dark:text-gray-300"
          input-class="bg-gray-50 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="••••••••"
        />

        <!-- New password -->
        <FormKit
          type="password"
          name="new_password"
          label="New password"
          label-class="block text-sm font-medium text-gray-900 dark:text-gray-300"
          input-class="bg-gray-50 my-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="••••••••"
        />

        <!-- Submit -->
        <FormKit
          type="submit"
          label="Edit account"
          input-class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        />
      </FormKit>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { setErrors } from "@formkit/vue";
import axios from "@/axios";
const store = useStore();
const router = useRouter();

const form = ref({
  first_name: store.state.me?.first_name,
  last_name: store.state.me?.last_name,
  username: store.state.me?.username,
  old_password: undefined,
  new_password: undefined,
});

const submitForm = (form) =>
  axios
    .patch("/api/user", {
      first_name: form.first_name ? form.first_name : undefined,
      last_name: form.last_name ? form.last_name : undefined,
      username: form.username ? form.username : undefined,
      old_password: form.old_password ? form.old_password : undefined,
      new_password: form.new_password ? form.new_password : undefined,
    })
    .then(() => {
      store.dispatch("getToast", {
        type: "success",
        message: "Account edited successfully",
      });
      store.dispatch("getMe");
      if (
        (form.username && form.username !== me.value.username) ||
        (form.old_password && form.new_password)
      ) {
        router.push({ name: "Login" });
      } else {
        router.push({ name: "UserId", params: { id: me.value._id } });
      }
    })
    .catch((error) => {
      if (
        error.response.data.message ===
        "apiIncorrectPasswordError: Password or username is incorrect"
      ) {
        setErrors("form", ["Password or username is incorrect"]);
      } else {
        setErrors("form", [error.response.data.message]);
      }
      console.error(error);
    });

const me = computed(() => store.state.me);
</script>
