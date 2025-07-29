import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiHome,
  FiBook,
  FiCalendar,
  FiPieChart,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const MobileMenu = ({ onClose }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FiHome size={20} /> },
    { name: "Journal", path: "/journal", icon: <FiBook size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <FiCalendar size={20} /> },
    { name: "Insights", path: "/stats", icon: <FiPieChart size={20} /> },
    { name: "Settings", path: "/settings", icon: <FiSettings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  const activeClass =
    "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200";
  const inactiveClass =
    "text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800";

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-neutral-900/50 dark:bg-black/50 backdrop-blur-sm">
      <div className="absolute top-16 left-0 right-0 bottom-0 bg-white dark:bg-neutral-800 flex flex-col animate-slideIn">
        {/* User info */}
        <div className="p-4 mb-2 border-b border-neutral-200 dark:border-neutral-700">
          <div className="font-playwrite-au font-medium text-neutral-900 dark:text-white">
            {user?.name}
          </div>
          <div className="font-lora text-sm text-neutral-500 dark:text-neutral-400">
            {user?.email}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 pb-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive ? activeClass : inactiveClass
                }`
              }
              end={item.path === "/"}
            >
              <span>{item.icon}</span>
              <span className="font-libre-baskerville font-medium">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={handleLogout}
            className="font-playwrite-au font-light w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-neutral-700 transition-colors"
          >
            <FiLogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
