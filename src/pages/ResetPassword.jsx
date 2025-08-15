import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiLock, FiEye, FiEyeOff, FiShield, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import PasswordStrengthIndicator from "../components/common/PasswordStrengthIndicator";
import { validatePassword } from "../utils/passwordValidation";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    const tokenFromQuery = searchParams.get("token");
    
    if (!emailFromQuery || !tokenFromQuery) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }
    
    setEmail(emailFromQuery);
    setToken(tokenFromQuery);
    setValidToken(true);
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validToken) {
      setError("Invalid reset link.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setError("Password does not meet security requirements");
      return;
    }

    try {
      setError("");
      setLoading(true);
      
      await resetPassword(email, token, formData.password);
      setSuccess(true);
      
      setTimeout(() => {
        navigate("/login", { 
          state: { message: "Password reset successfully! Please log in with your new password." }
        });
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 w-full max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-2xl text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-xl font-libre-baskerville font-bold text-neutral-900 dark:text-white mb-2">
            Invalid Reset Link
          </h1>
          <p className="font-lora text-neutral-600 dark:text-neutral-400 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          
          <Link
            to="/forgot-password"
            className="btn btn-primary font-libre-baskerville font-medium"
          >
            Request New Reset Link
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FiLock className="text-2xl text-primary-600 dark:text-primary-400" />
          </motion.div>
          
          <h1 className="text-2xl font-libre-baskerville font-bold text-neutral-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="font-lora text-neutral-600 dark:text-neutral-400">
            Enter your new password below
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-lg text-sm text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <FiShield className="text-green-500" />
              Password Reset Successfully!
            </div>
            <p className="text-xs">Redirecting to login...</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-libre-baskerville font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              New Password
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
                className="input pl-10 pr-10"
                placeholder="Enter new password"
                disabled={loading}
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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-libre-baskerville font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            >
              Confirm New Password
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
                className="input pl-10 pr-10"
                placeholder="Confirm new password"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-neutral-500 focus:outline-none"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary w-full font-libre-baskerville font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Resetting Password...
              </div>
            ) : success ? (
              "Password Reset!"
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-lora text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
