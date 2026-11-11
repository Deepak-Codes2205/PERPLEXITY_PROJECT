import { Server } from "socket.io"

let io;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: clientUrl,
      credentials: true
    }
  });

  console.log("Socket.io Server is Running")

    io.on("connection", (socket) => {
        console.log("A user connected: " + socket.id)
    })
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized")
    }
    return io;
}