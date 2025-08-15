import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import PasswordStrengthIndicator from "../components/common/PasswordStrengthIndicator";
import { validatePassword } from "../utils/passwordValidation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      return setError("Password does not meet security requirements");
    }

    try {
      setError("");
      setLoading(true);
      await register(formData.name, formData.email, formData.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 w-full animate-fadeIn">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-libre-baskerville font-bold text-neutral-900 dark:text-white mb-2">
          Create Account
        </h1>
        <p className="font-libre-baskerville text-neutral-600 dark:text-neutral-400">
          Join MindJournal to start your journal!
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-libre-baskerville font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-neutral-500" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input pl-10 font-lora text-neutral-900 dark:text-white"
              placeholder="Your name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-libre-baskerville font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-neutral-500" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input pl-10 font-lora text-neutral-900 dark:text-white"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block  text-sm font-libre-baskerville font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-neutral-500" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              className="input pl-10 pr-10 text-neutral-900 dark:text-white"
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator password={formData.password} />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-libre-baskerville font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-neutral-500" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input pl-10 pr-10 text-neutral-900 dark:text-white"
              placeholder="••••••••"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="text-neutral-500 focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full font-libre-baskerville font-medium"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-4 text-center">
        <p className="text-[16px] font-lora font-medium text-neutral-600 dark:text-neutral-400">
          or
        </p>
      </div>

      {/* Google Login */}
      <div className="mt-4 flex justify-center">
        <GoogleLogin
          onSuccess={loginWithGoogle}
          onError={() => {
            setError("Google login failed. Please try again.");
          }}
        />
      </div>

      {/* Link to login */}
      <div className="mt-6 text-center text-sm font-libre-baskerville text-neutral-600 dark:text-neutral-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-lora font-medium text-[14px] text-primary-600 dark:text-primary-400 hover:text-primary-500"
        >
          Sign in!
        </Link>
      </div>
    </div>
  );
};

export default Register;
