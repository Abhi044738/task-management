export default function About() {
  return (
    <section className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-10 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          About Task Manager
        </h1>

        <p className="text-gray-300 leading-relaxed">
          <span className="text-blue-400 font-semibold">Task Manager</span> is a
          full-featured web application designed to help individuals and teams
          manage their work effectively. It allows users to create, assign, and
          track tasks in real time.
        </p>

        <p className="text-gray-300 leading-relaxed">
          The system integrates{" "}
          <span className="font-semibold text-blue-400">WebSockets</span> for
          instant notifications and updates, ensuring that everyone stays in
          sync at all times.
        </p>

        <div className="border-t border-gray-700 my-4"></div>

        <p className="text-gray-400 text-sm text-center">
          Built with modern technologies:
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-300 text-center">
          <li className="bg-gray-700 rounded-lg py-2 hover:bg-gray-600 transition">
            React
          </li>
          <li className="bg-gray-700 rounded-lg py-2 hover:bg-gray-600 transition">
            Vite
          </li>
          <li className="bg-gray-700 rounded-lg py-2 hover:bg-gray-600 transition">
            Tailwind CSS
          </li>
          <li className="bg-gray-700 rounded-lg py-2 hover:bg-gray-600 transition">
            Node.js
          </li>
          <li className="bg-gray-700 rounded-lg py-2 hover:bg-gray-600 transition">
            Express
          </li>
          <li className="bg-gray-700 rounded-lg py-2 hover:bg-gray-600 transition">
            MongoDB
          </li>
        </ul>

        <p className="text-gray-300 leading-relaxed mt-6 text-center">
          This project emphasizes{" "}
          <span className="text-blue-400 font-semibold">
            real-time collaboration
          </span>
          , scalability, and a clean user experience.
        </p>
      </div>
    </section>
  );
}
