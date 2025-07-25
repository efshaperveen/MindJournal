import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (!emailFromQuery) {
      navigate("/forgot-password");
    } else {
      setEmail(emailFromQuery);
    }
  }, [navigate, searchParams]);

  const handleReset = (e) => {
    e.preventDefault();

    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = storedUsers.findIndex((u) => u.email === email);

    if (userIndex === -1) {
      setError("User not found.");
      return;
    }

    storedUsers[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(storedUsers));

    setSuccess(true);
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="Enter new password"
          className="input w-full mb-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm">
            Password updated! Redirecting...
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
