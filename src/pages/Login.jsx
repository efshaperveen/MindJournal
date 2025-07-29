import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiUser, FiLock } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 w-full animate-fadeIn">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-playwrite font-bold text-neutral-900 dark:text-white mb-2">
          Welcome Back!
        </h1>
        <p className="font-libre-baskerville text-neutral-600 dark:text-neutral-400">
          Sign in to your MindJournal account
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-libre-baskerville font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-neutral-500" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10 font-lora"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-libre-baskerville font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-neutral-500" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10"
              placeholder="••••••••"
            />
          </div>
        </div>
        <div className="text-right text-sm">
          <Link
            to="/forgot-password"
            className="font-lora font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full font-libre-baskerville font-medium"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-[16px] font-lora font-medium text-neutral-600 dark:text-neutral-400">
          or
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <GoogleLogin
          onSuccess={loginWithGoogle}
          onError={() => {
            setError("Google login failed. Please try again.");
          }}
        />
      </div>

      <div className="mt-6 text-center text-sm font-libre-baskerville text-neutral-600 dark:text-neutral-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-playwrite-au font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
