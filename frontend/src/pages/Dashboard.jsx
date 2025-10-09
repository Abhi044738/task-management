import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { connectSocket, getSocket } from "../services/socket";

import TaskCard from "../component/TaskCard";
import Modal from "../component/Modal";
import Input from "../component/Input";
import Button from "../component/Button";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Filters & search
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getTasks();
      if (res?.data?.success) setTasks(res.data.data);
      else setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!token) return;
    const socket = getSocket() ?? connectSocket(token);
    if (!socket) return;

    const onTaskCreated = (task) => setTasks((prev) => [task, ...prev]);
    const onTaskUpdated = (task) =>
      setTasks((prev) =>
        prev.map((t) => (String(t._id) === String(task._id) ? task : t))
      );
    const onTaskDeleted = (payload) =>
      setTasks((prev) =>
        prev.filter((t) => String(t._id) !== String(payload.id))
      );

    socket.on("taskCreated", onTaskCreated);
    socket.on("taskUpdated", onTaskUpdated);
    socket.on("taskDeleted", onTaskDeleted);

    return () => {
      socket.off("taskCreated", onTaskCreated);
      socket.off("taskUpdated", onTaskUpdated);
      socket.off("taskDeleted", onTaskDeleted);
    };
  }, [token]);

  const openNew = () => {
    setCur({
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
      status: "pending",
    });
    setOpen(true);
  };

  const openEdit = (task) => {
    setCur({
      ...task,
      assignedTo: task.assignedTo?._id || (task.assignedTo ?? ""),
      status: task.status || "pending",
    });
    setOpen(true);
  };

  const saveTask = async () => {
    try {
      if (!cur.title) return alert("Title required");
      if (cur._id) {
        const res = await api.updateTask(cur._id, cur);
        if (res?.data?.success) {
          setOpen(false);
          load();
        }
      } else {
        const res = await api.createTask(cur);
        if (res?.data?.success) setOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save task");
    }
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.deleteTask(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  const copyUserId = async () => {
    if (!user?.id) return;
    await navigator.clipboard.writeText(user.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const myTasks = useMemo(
    () => tasks.filter((t) => t.user._id === user.id),
    [tasks, user]
  );

  const assignedTasks = useMemo(
    () => tasks.filter((t) => t.assignedTo._id === user.id),
    [tasks, user]
  );

  // 🔍 Filter + Search logic
  const filterTasks = (list) =>
    list.filter((t) => {
      const searchMatch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.assignedTo?.username?.toLowerCase().includes(search.toLowerCase());
      const priorityMatch =
        priorityFilter === "all" || t.priority === priorityFilter;
      const statusMatch = statusFilter === "all" || t.status === statusFilter;
      return searchMatch && priorityMatch && statusMatch;
    });

  const filteredMyTasks = filterTasks(myTasks);
  const filteredAssignedTasks = filterTasks(assignedTasks);

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 text-center sm:text-left">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-400">
              Welcome back,{" "}
              <span className="font-semibold">{user?.username || "User"}</span>{" "}
              👋
            </p>
          </div>
          <Button
            onClick={openNew}
            className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-500 transition-all"
          >
            ➕ Add Task
          </Button>
        </div>

        {/* User Info */}
        {user?.id && (
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Your User ID</p>
              <p className="text-blue-400 font-mono text-sm break-all">
                {user.id}
              </p>
            </div>
            <button
              onClick={copyUserId}
              className={`px-3 py-1 text-sm rounded transition-all ${
                copied
                  ? "bg-green-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        {/* Search + Filters */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search by title, desc or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm text-gray-200"
          />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 text-sm text-gray-200"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded bg-gray-700 border border-gray-600 text-sm text-gray-200"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && (
          <>
            {/* My Tasks */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Tasks You Created</h2>
              {filteredMyTasks.length === 0 ? (
                <p className="text-gray-400">No tasks found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredMyTasks.map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onEdit={openEdit}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Assigned Tasks */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Tasks Assigned to You
              </h2>
              {filteredAssignedTasks.length === 0 ? (
                <p className="text-gray-400">No tasks found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredAssignedTasks.map((t) => (
                    <TaskCard
                      key={t._id}
                      task={t}
                      onEdit={openEdit}
                      assignedTask
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={cur._id ? "Edit Task" : "New Task"}
      >
        <Input
          label="Title"
          value={cur.title}
          onChange={(e) => setCur({ ...cur, title: e.target.value })}
        />
        <Input
          label="Description"
          value={cur.description}
          onChange={(e) => setCur({ ...cur, description: e.target.value })}
        />

        <label className="text-sm text-gray-200 mb-1 block">Priority</label>
        <select
          value={cur.priority}
          onChange={(e) => setCur({ ...cur, priority: e.target.value })}
          className="input bg-gray-700 border-gray-600 mb-3"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <Input
          label="Assign to (User ID)"
          value={cur.assignedTo}
          onChange={(e) => setCur({ ...cur, assignedTo: e.target.value })}
          placeholder="Optional user ID"
        />

        {cur._id && (
          <div className="mb-3">
            <label className="text-sm text-gray-200 mb-1 block">Status</label>
            <select
              value={cur.status}
              onChange={(e) => setCur({ ...cur, status: e.target.value })}
              className="input bg-gray-700 border-gray-600"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={saveTask}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
