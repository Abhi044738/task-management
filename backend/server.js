import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import statusRouter from "./routes/status.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/status", statusRouter);

app.use(errorHandler);

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
