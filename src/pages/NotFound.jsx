import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-libre-baskerville font-semibold text-neutral-800 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="font-lora text-[15px] text-neutral-600 dark:text-neutral-400 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to={user ? "/" : "/login"} className="btn btn-primary">
          {user ? "Return to Dashboard" : "Return to Login"}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
