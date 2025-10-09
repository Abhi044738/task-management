import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

export default function App() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
