import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          Organize. Collaborate. Achieve.
        </h1>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
          Welcome to{" "}
          <span className="text-blue-400 font-semibold">Task Manager</span> —
          your one-stop platform to create, assign, and track tasks
          effortlessly. Stay productive and connected with real-time updates.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 text-amber-50 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/about"
            className="px-6 py-3 border border-gray-600 hover:border-blue-400 hover:text-blue-400 rounded-lg font-medium transition"
          >
            Learn More
          </Link>
        </div>

        <div className="pt-12 text-gray-400 text-sm">
          <p>Built using React, Vite, TailwindCSS, Node.js & MongoDB</p>
        </div>
      </div>
    </section>
  );
}
