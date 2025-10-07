import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Task } from "../models/Task.js";
import mongoose from "mongoose";
import { Notification } from "../models/Notification.js";

const router = express.Router();

const emit = (io, room, event, payload) => {
  try {
    if (!io) return;
    io.to(room).emit(event, payload);
  } catch (e) {
    console.error("Emit error", e);
  }
};

// POST /api/tasks
// Create a new task
router.post("/", protect, async (req, res) => {
  const io = req.app.get("io");
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;

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
      assignedTo,
      description,
      dueDate,
      priority,
    });
    emit(io, String(req.user._id), "taskCreated", task);
    emit(io, `task_${task._id}`, "taskCreated", task);

    if (assignedTo && String(assignedTo) !== String(req.user._id)) {
      const message = `You were assigned a new task: "${task.title}"`;
      const notif = await Notification.create({
        user: assignedTo,
        task: task._id,
        message,
        type: "task_assigned",
      });
      emit(io, String(assignedTo), "notification", {
        id: notif._id,
        message,
        taskId: task._id,
        type: "task_assigned",
      });
    }

    return res.status(201).json({ success: true, data: task });
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
    return res
      .status(500)
      .json({ success: false, message: "Failed to create task" });
  }
});

// GET /api/tasks
// Get all tasks of user
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [{ user: req.user._id }, { assignedTo: req.user._id }],
    })
      .populate("user", "username email")
      .populate("assignedTo", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: tasks });
  } catch (err) {
    console.error("Get Tasks Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch tasks" });
  }
});

// GET /api/tasks/:id
// desc Get one task by ID
router.get("/:id", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task id" });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { assignedTo: req.user._id }],
    })
      .populate("user", "username email")
      .populate("assignedTo", "username email");

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    return res.json({ success: true, data: task });
  } catch (err) {
    console.error("Get Task Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch task" });
  }
});

// PUT /api/tasks/:id
// Update task
router.put("/:id", protect, async (req, res) => {
  const io = req.app.get("io");
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task id" });
    }
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    const isOwnerOrAssignee =
      String(task.user) === String(req.user._id) ||
      String(task.assignedTo) === String(req.user._id);
    if (!isOwnerOrAssignee) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { title, description, status, dueDate, priority, assignedTo } =
      req.body;

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
    const prevAssignedTo = task.assignedTo ? String(task.assignedTo) : null;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    const updatedTask = await task.save();

    emit(io, `task_${updatedTask._id}`, "taskUpdated", updatedTask);
    emit(io, String(updatedTask.user), "taskUpdated", updatedTask);
    if (updatedTask.assignedTo)
      emit(io, String(updatedTask.assignedTo), "taskUpdated", updatedTask);

    if (
      assignedTo &&
      String(assignedTo) !== prevAssignedTo &&
      String(assignedTo) !== String(req.user._id)
    ) {
      const message = `You were assigned to task "${updatedTask.title}"`;
      const notif = await Notification.create({
        user: assignedTo,
        task: updatedTask._id,
        message,
        type: "task_assigned",
      });
      emit(io, String(assignedTo), "notification", {
        id: notif._id,
        message,
        taskId: updatedTask._id,
        type: "task_assigned",
      });
    }

    return res.json({ success: true, data: updatedTask });
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

    return res
      .status(500)
      .json({ success: false, message: "Failed to update task" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", protect, async (req, res) => {
  const io = req.app.get("io");

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task id" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (String(task.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const assignedTo = task.assignedTo ? String(task.assignedTo) : null;

    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete task" });
    }

    // Emit delete event
    emit(io, `task_${req.params.id}`, "taskDeleted", { id: req.params.id });
    emit(io, String(req.user._id), "taskDeleted", { id: req.params.id });
    if (assignedTo)
      emit(io, String(assignedTo), "taskDeleted", { id: req.params.id });

    return res.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete Task Error:", err?.message ?? err);
    res.status(500).json({ success: false, message: "Failed to delete task" });
  }
});

export { router as taskRouter };
