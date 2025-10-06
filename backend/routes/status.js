import express from "express";

const router = express.Router();

// api/status
router.get("/", (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  res.json({
    status: "ok",
    uptime: `${uptimeSeconds}s`,
    timestamp: new Date().toISOString(),
  });
});

export default router;
