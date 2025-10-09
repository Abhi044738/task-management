export default function TaskCard({ task, onEdit, onDelete, assignedTask }) {
  return (
    <div className="bg-gray-800/70 border border-gray-700 rounded-xl p-4 flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/10 transition">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <span
            className={`text-xs px-2 py-1 rounded ${
              task.priority === "high"
                ? "bg-red-600/70"
                : task.priority === "medium"
                ? "bg-yellow-600/70"
                : "bg-green-600/70"
            }`}
          >
            {task.priority}
          </span>
        </div>

        <p className="text-gray-300 mt-2 text-sm line-clamp-3">
          {task.description || "No description provided."}
        </p>

        <div className="mt-3 text-xs text-gray-400 space-y-1">
          <p>
            🧑‍💼 Created by:{" "}
            <span className="text-blue-400">{task.user?.username}</span>
          </p>
          {task.assignedTo && (
            <p>
              🎯 Assigned to:{" "}
              <span className="text-green-400">
                {task.assignedTo?.username || "—"}
              </span>
            </p>
          )}
          <p>
            📅 Status:{" "}
            <span
              className={`${
                task.status === "completed"
                  ? "text-green-400"
                  : task.status === "in-progress"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }`}
            >
              {task.status}
            </span>
          </p>
          <p>
            ⏱ Updated:{" "}
            {new Date(task.updatedAt).toLocaleString("en-IN", {
              hour12: true,
            })}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-400"
        >
          Edit
        </button>
        {onDelete && !assignedTask && (
          <button
            onClick={() => onDelete(task._id)}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
