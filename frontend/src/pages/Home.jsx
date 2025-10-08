export default function About() {
  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 bg-gray-800 rounded shadow text-white px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4 text-center">
        About Task Manager
      </h1>
      <p className="text-gray-300 mb-4">
        Task Manager is a web application designed to help you manage your tasks
        efficiently. You can create, update, and delete tasks, as well as
        collaborate with team members in real-time.
      </p>
      <p className="text-gray-300 mb-4">
        Built using <span className="font-semibold text-blue-400">React</span>{" "}
        (frontend),
        <span className="font-semibold text-blue-400"> Vite</span> (build tool),
        and <span className="font-semibold text-blue-400">Tailwind CSS</span>{" "}
        (styling).
      </p>
      <p className="text-gray-300">
        Modular, responsive, and designed with reusable components for faster
        development and easier maintenance.
      </p>
    </div>
  );
}
