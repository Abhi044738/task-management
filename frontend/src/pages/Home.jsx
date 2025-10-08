export default function Home() {
  return (
    <div className="pt-28 flex flex-col items-center justify-center text-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to Task Manager</h1>
      <p className="text-gray-300 max-w-lg mb-8">
        Manage tasks efficiently, stay organized, and collaborate in real time.
      </p>
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg transition">
        Get Started
      </button>
    </div>
  );
}
