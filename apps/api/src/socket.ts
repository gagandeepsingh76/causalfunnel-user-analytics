import type { Server } from "socket.io";
import { getLiveVisitorsCount } from "./services/analytics.service.js";

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket) => {
    socket.emit("socket:ready", {
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });

    void getLiveVisitorsCount().then((count) => {
      socket.emit("live:count", count);
    });
  });
}
