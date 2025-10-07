import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Notification } from "../models/Notification.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: notifs });
  } catch (err) {
    console.error("Get notifications error", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
});

router.put("/:id/read", protect, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif)
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    res.json({ success: true, data: notif });
  } catch (err) {
    console.error("Mark notification read error", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update notification" });
  }
});

export { router as notificationRouter };
