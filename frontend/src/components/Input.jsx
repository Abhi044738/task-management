export default function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col mb-4 w-full">
      {label && <label className="mb-1 text-gray-200">{label}</label>}
      <input type={type} className="input" {...props} />
    </div>
  );
}
