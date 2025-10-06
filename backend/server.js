import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import { errorHandler } from "./middleware/errorHandler.js";
import { statusRouter } from "./routes/status.js";
import { authRouter } from "./routes/auth.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/status", statusRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;
const MONGO_URI = process.env.MONGO_URI;

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      console.error("MONGO_URI is not set.");
      process.exit(1);
    }
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
