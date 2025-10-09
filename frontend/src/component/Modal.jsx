export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-gray-800 rounded w-full max-w-lg p-6 relative">
        <button
          className="absolute right-3 top-3 text-gray-400"
          onClick={onClose}
        >
          ×
        </button>
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
