import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Users from "@/views/Users.vue";
import UserId from "@/views/UserId.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import AddPost from "@/views/AddPost.vue";
import MeEdit from "@/views/MeEdit.vue";
import PostId from "@/views/PostId.vue";

export default createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/users",
      name: "Users",
      component: Users,
    },
    {
      path: "/user/:id",
      name: "UserId",
      props: true,
      component: UserId,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/post/add",
      name: "AddPost",
      component: AddPost,
    },
    {
      path: "/me/edit",
      name: "MeEdit",
      component: MeEdit,
    },
    {
      path: "/post/:id",
      name: "PostId",
      props: true,
      component: PostId,
    },
  ],
});
