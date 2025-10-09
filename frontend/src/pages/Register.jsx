import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Input from "../component/Input";
import Button from "../component/Button";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.register({ username, email, password });
      if (res?.data?.token) {
        login(res.data.user, res.data.token);
        nav("/dashboard");
      } else {
        setErr("Registration failed. Please try again.");
      }
    } catch (error) {
      setErr(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Your Account 🚀
        </h2>

        {err && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm p-3 rounded mb-4 animate-fade-in">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <Input
            label="Name"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
