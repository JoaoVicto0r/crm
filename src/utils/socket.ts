import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io("https://api-royal-hngp.onrender.com"); 
  }
  return socket;
};
