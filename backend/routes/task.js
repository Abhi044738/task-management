import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Task } from "../models/Task.js";

const router = express.Router();

// POST /api/tasks
// Create a new task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }
    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: { priority: "Priority must be low, medium, or high" },
      });
    }
    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
      priority,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    console.error("Create Task Error:", err.message);
    if (err.name === "ValidationError") {
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res
        .status(400)
        .json({ success: false, message: "Validation failed", errors });
    }
    res.status(500).json({ success: false, message: "Failed to create task" });
  }
});

// GET /api/tasks
// Get all tasks of user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
});

// GET /api/tasks/:id
// desc Get one task by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    console.error("Get Task Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch task" });
  }
});

// PUT /api/tasks/:id
// Update task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const { title, description, status, dueDate, priority } = req.body;

    if (priority && !["low", "medium", "high"].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: { priority: "Priority must be low, medium, or high" },
      });
    }

    if (status && !["pending", "in-progress", "completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: { status: "Status must be pending, in-progress, or completed" },
      });
    }
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    res.json({ success: true, data: updatedTask });
  } catch (err) {
    console.error("Update Task Error:", err.message);
    if (err.name === "ValidationError") {
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });
      return res
        .status(400)
        .json({ success: false, message: "Validation failed", errors });
    }

    res.status(500).json({ success: false, message: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
});

export { router as taskRouter };
