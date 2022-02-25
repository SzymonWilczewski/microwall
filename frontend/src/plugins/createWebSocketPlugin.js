import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_BASE_URL + "/friends/notifications", {
  withCredentials: true,
});

export default function createWebSocketPlugin() {
  return (store) => {
    socket.on("event", function () {
      store.dispatch("");
    });
  };
}
