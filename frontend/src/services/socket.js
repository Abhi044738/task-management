import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (!token) return null;
  const SOCKET_URL =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";
  socket = io(SOCKET_URL, { auth: { token } });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
