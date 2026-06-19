import { createServer } from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { registerSocketHandlers } from "./socket.js";

const app = createApp();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.corsOrigins.includes("*") ? "*" : env.corsOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.set("io", io);
registerSocketHandlers(io);

await connectDatabase();

server.listen(env.PORT, () => {
  console.log(`TrackFlow API listening on port ${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Shutting down TrackFlow API.`);

  io.close();
  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
