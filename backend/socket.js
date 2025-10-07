import jwt from "jsonwebtoken";

export const setupSocket = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      return next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      "Socket connected:",
      socket.id,
      "user:",
      socket.userId ?? "anon"
    );

    if (socket.userId) {
      socket.join(String(socket.userId));
    }

    socket.on("joinTask", (taskId) => {
      if (!taskId) return;
      socket.join(`task_${taskId}`);
    });
    socket.on("leaveTask", (taskId) => {
      if (!taskId) return;
      socket.leave(`task_${taskId}`);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", socket.id, "reason:", reason);
    });
  });
};
