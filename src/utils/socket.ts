import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io("https://api-royal-production.up.railway.app0"); 
  }
  return socket;
};
