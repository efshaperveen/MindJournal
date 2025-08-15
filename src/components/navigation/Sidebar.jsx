import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  FiHome,
  FiBook,
  FiCalendar,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiMessageCircle,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";
import ThemeToggle from "../common/ThemeToggle";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <FiHome size={20} /> },
    { name: "Journal", path: "/journal", icon: <FiBook size={20} /> },
    { name: "Private Vault", path: "/private-vault", icon: <FiShield size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <FiCalendar size={20} /> },
    { name: "Insights", path: "/stats", icon: <FiPieChart size={20} /> },
    { name: "Gratitude", path: "/gratitude", icon: <FiCheckCircle size={20} /> }, 
    { name: "Settings", path: "/settings", icon: <FiSettings size={20} /> },
    {
      name: "MindBot-AI",
      path: "/mindchat",
      icon: <FiMessageCircle size={20} />,
    },
  ];

  const activeClass =
    "bg-gradient-primary text-white shadow-glow scale-105";
  const inactiveClass =
    "text-neutral-600 hover:bg-white/50 dark:text-neutral-300 dark:hover:bg-neutral-800/50 hover:scale-105 transition-all duration-300";

  return (
    <aside className="h-screen sticky top-0 glass-card border-r border-neutral-200/50 dark:border-neutral-700/50 p-6 flex flex-col backdrop-blur-xl z-50 w-64 lg:w-72 overflow-y-auto">
      {/* Logo Section */}
      <div className="mb-8 flex items-center space-x-3 pt-2 slide-in-left flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
          <span className="text-white font-bold text-lg">M</span>
        </div>
        <h1 className="text-xl font-bold gradient-text">
          MindJournal
        </h1>
      </div>

      {/* User Profile Card */}
      <div className="glass-card p-4 mb-6 rounded-xl border-gradient slide-in-up flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-neutral-900 dark:text-white truncate">
              {user?.name}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {user?.email}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center space-x-2">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-success-600 dark:text-success-400 font-medium">
            Online
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:translate-x-1 ${
                isActive ? activeClass : inactiveClass
              }`
            }
            style={{ animationDelay: `${index * 0.1}s` }}
            end={item.path === "/"}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="font-medium">
              {item.name}
            </span>
            {item.path === "/mindchat" && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-700/50 space-y-4 slide-in-up flex-shrink-0">
        {/* Theme Toggle */}
        <div className="glass-card p-3 rounded-xl border-gradient">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-neutral-600 dark:text-neutral-300">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20 transition-all duration-300 hover:scale-105 hover:shadow-glow-red"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Log out</span>
        </button>

        {/* Version Info */}
        <div className="text-center">
          <div className="text-xs text-neutral-400 dark:text-neutral-500">
            v2.0.0 • MindJournal
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
