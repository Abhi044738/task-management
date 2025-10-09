export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col mb-3">
      {label && <label className="mb-1 text-sm text-gray-200">{label}</label>}
      <input
        className={`input ${
          props.disabled ? "bg-gray-700 cursor-not-allowed opacity-70" : ""
        }`}
        {...props}
      />
    </div>
  );
}
