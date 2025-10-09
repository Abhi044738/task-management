import { useEffect, useState } from "react";
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
  const [myTasks, setMyTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getTasks();
      if (res?.data?.success) {
        console.log("data from backend", res.data.data);
        setTasks(res.data.data);
      } else setTasks(res.data || []);
      console.log(res.data.data);
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
    setMyTasks(() => getMyTasks());
    setAssignedTasks(() => getAssignedTasks());
  }, [tasks]);
  useEffect(() => {
    if (!token) return;
    const socket = getSocket() ?? connectSocket(token);
    if (!socket) return;

    const onTaskCreated = (task) => {
      console.log("new task", task);
      setTasks((prev) => [task, ...prev]);
    };
    // const onTaskUpdated = (task) => {
    //   console.log("called", task);
    //   setTasks((prev) => {
    //     console.log(
    //       "prev",
    //       prev,
    //       "new ",
    //       prev.map((t) =>
    //         String(t._id) === String(task._id) ? { ...task, user: t.user } : t
    //       )
    //     );
    //     return prev.map((t) =>
    //       String(t._id) === String(task._id)
    //         ? { ...task, user: t.user, assignedTo: t.assignedTo }
    //         : t
    //     );
    //   });
    // };
    const onTaskUpdated = (task) => {
      console.log("called", task);
      setTasks((prev) => {
        console.log(
          "prev",
          prev,
          "new ",
          prev.map((t) => (String(t._id) === String(task._id) ? task : t))
        );
        return prev.map((t) => (String(t._id) === String(task._id) ? task : t));
      });
    };
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

  const getMyTasks = () => tasks.filter((t) => t.user._id === user.id);
  const getAssignedTasks = () =>
    tasks.filter((t) => t.assignedTo._id === user.id);

  return (
    <div className="pt-20 pb-12 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
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

        {/* My Tasks */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tasks You Created</h2>
          {myTasks.length === 0 ? (
            <p className="text-gray-400">No tasks created yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myTasks.map((t) => (
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
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Tasks Assigned to You</h2>
          {assignedTasks.length === 0 ? (
            <p className="text-gray-400">No tasks assigned to you.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {assignedTasks.map((t) => (
                <TaskCard
                  key={t._id}
                  task={t}
                  onEdit={openEdit}
                  onDelete={null}
                  assignedTask={true}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal for Create/Edit Task */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={cur._id ? "Edit Task" : "New Task"}
      >
        <Input
          label="Title"
          value={cur.title}
          onChange={(e) => setCur({ ...cur, title: e.target.value })}
          disabled={assignedTasks.some((t) => t._id === cur._id)}
        />
        <Input
          label="Description"
          value={cur.description}
          onChange={(e) => setCur({ ...cur, description: e.target.value })}
          disabled={assignedTasks.some((t) => t._id === cur._id)}
        />

        <div
          className={`mb-3 ${
            assignedTasks.some((t) => t._id === cur._id) ? "collapse" : ""
          }`}
        >
          <label className="text-sm text-gray-200 mb-1 block">Priority</label>
          <select
            value={cur.priority}
            onChange={(e) => setCur({ ...cur, priority: e.target.value })}
            className="input bg-gray-700 border-gray-600"
            disabled={assignedTasks.some((t) => t._id === cur._id)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Input
          label="Assign to (User ID)"
          value={cur.assignedTo}
          onChange={(e) => setCur({ ...cur, assignedTo: e.target.value })}
          placeholder="Optional user ID"
          disabled={assignedTasks.some((t) => t._id === cur._id)}
        />

        {/*  Status field visible only during edit */}
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
