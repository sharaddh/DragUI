import { io } from "socket.io-client";

const URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const socket = io(URL, {
  auth: {
    token: localStorage.getItem("adminToken"),
  },
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export default socket;
