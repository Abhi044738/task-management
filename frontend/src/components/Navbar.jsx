import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn = false }) {
  return (
    <nav className="bg-gray-800 text-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="font-bold text-lg mb-2 sm:mb-0">Task Manager</div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <Link className="hover:text-blue-400" to="/">
            Home
          </Link>
          <Link className="hover:text-blue-400" to="/about">
            About
          </Link>
          {isLoggedIn ? (
            <Link className="hover:text-blue-400" to="/dashboard">
              Dashboard
            </Link>
          ) : (
            <>
              <Link className="hover:text-blue-400" to="/login">
                Login
              </Link>
              <Link className="hover:text-blue-400" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
