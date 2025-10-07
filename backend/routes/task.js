import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Task } from "../models/Task.js";

const router = express.Router();

// POST /api/tasks
// Create a new task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      dueDate,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err.message);
    res.status(500).json({ message: "Failed to create task" });
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
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

// GET /api/tasks/:id
// desc Get one task by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.error("Get Task Error:", err.message);
    res.status(500).json({ message: "Failed to fetch task" });
  }
});

// PUT /api/tasks/:id
// Update task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { title, description, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (err) {
    console.error("Update Task Error:", err.message);
    res.status(500).json({ message: "Failed to update task" });
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
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err.message);
    res.status(500).json({ message: "Failed to delete task" });
  }
});

export { router as taskRouter };
