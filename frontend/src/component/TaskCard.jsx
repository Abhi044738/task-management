export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="card flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <span className="text-xs px-2 py-1 rounded bg-gray-700">
            {task.priority}
          </span>
        </div>
        <p className="text-gray-300 mt-2 text-sm">{task.description}</p>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-400"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className={`px-3 py-1 rounded bg-red-600 hover:bg-red-500 ${
            onDelete ? "" : "collapse"
          }`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
