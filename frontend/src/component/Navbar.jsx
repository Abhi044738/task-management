import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white shadow sticky top-0 z-50">
      {/* Top Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="font-bold text-lg hover:text-blue-400 transition"
        >
          Task Manager
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link className="hover:text-blue-400" to="/">
            Home
          </Link>
          <Link className="hover:text-blue-400" to="/about">
            About
          </Link>

          {user ? (
            <>
              <Link className="hover:text-blue-400" to="/dashboard">
                Dashboard
              </Link>
              <NotificationBell />
              <button
                onClick={logout}
                className="ml-2 px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white"
              >
                Logout
              </button>
            </>
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

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu ( Navbar) */}
      {menuOpen && (
        <div className="md:hidden bg-gray-700 py-3 flex justify-center flex-wrap gap-3 animate-fadeIn">
          <Link
            to="/"
            className="hover:text-blue-400"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-blue-400"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              {/* Notification + Logout  */}
              <div className="flex items-center space-x-2">
                <NotificationBell />
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-blue-400"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
