import express from "express";

const router = express.Router();

// api/status
router.get("/", (req, res) => {
  const uptimeSeconds = process.uptime();
  res.json({
    status: "ok",
    uptime: `${Math.floor(uptimeSeconds)}s`,
    timestamp: new Date().toISOString(),
  });
});

export default router;
