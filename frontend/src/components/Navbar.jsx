import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-3 py-2 font-medium ${
      location.pathname === path
        ? "text-blue-400 border-b-2 border-blue-400"
        : "text-gray-300 hover:text-blue-400"
    } transition`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 shadow-md z-50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-center space-x-6">
        <Link to="/" className={linkClass("/")}>
          Home
        </Link>
        <Link to="/about" className={linkClass("/about")}>
          About
        </Link>
      </div>
    </nav>
  );
}
