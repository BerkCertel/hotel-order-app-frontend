import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true, // gerekiyorsa (cookie auth vs.)
      autoConnect: true,
      reconnectionAttempts: 10,
    });

    socket.on("connect", () => {
      console.log("[SOCKET] Connected:", socket?.id);
    });
    socket.on("disconnect", (reason) => {
      console.log("[SOCKET] Disconnected:", reason);
    });
    socket.on("connect_error", (err) => {
      console.error("[SOCKET] Connect error:", err.message);
    });
  }
  return socket;
};
