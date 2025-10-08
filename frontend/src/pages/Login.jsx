import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-gray-800 rounded shadow px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <form className="flex flex-col">
        <Input label="Email" type="email" placeholder="Enter your email" />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
        <Button type="submit" className="mt-4">
          Login
        </Button>
      </form>
      <p className="text-gray-400 mt-4 text-center">
        Don't have an account?{" "}
        <Link className="text-blue-400 hover:underline" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}
