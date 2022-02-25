import { createStore } from "vuex";
import axios from "@/axios";

export default createStore({
  state: {
    users: [],
    user: {},
    me: null,
    posts: [],
    post: {},
    comments: [],
    toast: {},
    id: "",
    notifications: 0,
    postNotifications: 0,
    postIdType: "PUBLIC",
  },
  mutations: {
    GET_USERS(state, users) {
      state.users = users;
    },
    GET_USER(state, user) {
      state.user = user;
    },
    GET_ME(state, me) {
      state.me = me;
    },
    ADD_ME(state, me) {
      state.me = me;
    },
    DELETE_ME(state) {
      state.me = null;
    },
    GET_POSTS(state, posts) {
      state.posts = posts;
    },
    GET_POST(state, post) {
      state.post = post;
    },
    GET_COMMENTS(state, comments) {
      state.comments = comments;
    },
    GET_TOAST(state, toast) {
      state.toast = toast;
    },
    INCREASE_NOTIFICATIONS(state) {
      state.notifications = state.notifications + 1;
    },
    DECREASE_NOTIFICATIONS(state) {
      state.notifications =
        state.notifications === 0 ? 0 : state.notifications - 1;
    },
    RESET_NOTIFICATIONS(state) {
      state.notifications = 0;
    },
    GET_POST_NOTIFICATIONS(state, notifications) {
      state.postNotifications = notifications;
    },
    GET_POST_ID_TYPE(state, type) {
      state.postIdType = type;
    },
  },
  actions: {
    getUsers({ commit }) {
      return axios
        .get("/api/user")
        .then((res) => commit("GET_USERS", res.data.users))
        .catch((error) => console.error(error));
    },
    getUser({ commit }, id) {
      if (id) {
        return axios
          .get("/api/user/" + id)
          .then((res) => commit("GET_USER", res.data.user))
          .catch((error) => console.error(error));
      }
    },
    getMe({ commit }) {
      return axios
        .get("/api/me")
        .then((res) => commit("GET_ME", res.data.user))
        .catch((error) =>
          error.response.data.message === "apiUserDoesNotExistError"
            ? commit("GET_ME", undefined)
            : console.error(error)
        );
    },
    deleteMe({ commit }) {
      return commit("DELETE_ME");
    },
    addFriend({ dispatch }, friend_id) {
      return axios
        .post("/api/user/friends/" + friend_id)
        .then(
          () =>
            dispatch("getMe") &&
            dispatch("getUser", friend_id) &&
            dispatch("getUsers") &&
            dispatch("getPostNotifications")
        )
        .catch((error) => console.error(error));
    },
    deleteFriend({ dispatch }, friend_id) {
      return axios
        .delete("/api/user/friends/" + friend_id)
        .then(
          () =>
            dispatch("getMe") &&
            dispatch("getUser", friend_id) &&
            dispatch("getUsers") &&
            dispatch("getPostNotifications")
        )
        .catch((error) => console.error(error));
    },
    getAllPosts({ commit, dispatch }, type) {
      return axios
        .get("/api/post/" + type)
        .then((res) => commit("GET_POSTS", res.data.posts))
        .catch(() =>
          dispatch("getToast", { type: "error", message: "Access denied" })
        );
    },
    getUserPosts({ commit, dispatch }, { type, author_id }) {
      return axios
        .get("/api/post/" + type + "/" + author_id)
        .then((res) => commit("GET_POSTS", res.data.posts))
        .catch((error) => {
          console.log(error);
          commit("GET_POSTS", []);
          dispatch("getToast", { type: "error", message: "Access denied" });
        });
    },
    getPost({ commit }, id) {
      return axios
        .get("/api/post/" + id)
        .then((res) => commit("GET_POST", res.data.post))
        .catch((error) => console.error(error));
    },
    getComments({ commit, dispatch, state }, { type, id }) {
      if (state.postIdType.toString().toLowerCase() === type.toLowerCase()) {
        return axios
          .get("/api/comment/" + type + "/" + id)
          .then((res) => commit("GET_COMMENTS", res.data.comments))
          .catch(() => {
            commit("GET_COMMENTS", []);
            dispatch("getToast", { type: "error", message: "Access denied" });
          });
      }
    },
    getToast({ commit }, { type, message }) {
      commit("GET_TOAST", { type, message });
    },
    increaseNotification({ commit, state }, id) {
      if (state.me._id.toString() === id) {
        commit("INCREASE_NOTIFICATIONS");
      }
    },
    decreaseNotification({ commit, state }, id) {
      if (state.me._id.toString() === id) {
        commit("DECREASE_NOTIFICATIONS");
      }
    },
    resetNotification({ commit }) {
      commit("RESET_NOTIFICATIONS");
    },
    getPostNotifications({ commit }) {
      return axios
        .get("/api/post/notifications")
        .then((res) => commit("GET_POST_NOTIFICATIONS", res.data.notifications))
        .catch((error) => console.error(error));
    },
    getPostIdType({ commit }, type) {
      commit("GET_POST_ID_TYPE", type);
    },
  },
  getters: {
    friendStatus: (state) =>
      state.me?.friends.some((friend) => friend.user._id === state.user._id)
        ? state.me.friends.find((friend) => friend.user._id === state.user._id)
            .status
        : 0,
    usersWithoutMe: (state) =>
      state.users.filter((user) => user?._id !== state?.me?._id),
    meId: (state) => state.me?._id.toString(),
  },
});
