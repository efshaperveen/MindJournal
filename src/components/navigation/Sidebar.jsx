import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { FiHome, FiBook, FiCalendar, FiPieChart, FiSettings, FiLogOut,FiMessageCircle } from 'react-icons/fi'
import ThemeToggle from '../common/ThemeToggle'

const Sidebar = () => {
  const { user, logout } = useAuth()
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FiHome size={20} /> },
    { name: 'Journal', path: '/journal', icon: <FiBook size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <FiCalendar size={20} /> },
    { name: 'Insights', path: '/stats', icon: <FiPieChart size={20} /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings size={20} /> },
    { name: 'MindBot-AI', path: '/mindchat', icon: <FiMessageCircle  size={20} /> }

  ]
  
  const activeClass = "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200"
  const inactiveClass = "text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-800"
  
  return (
    <aside className="h-screen sticky top-0 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 p-4 flex flex-col">
      <div className="mb-8 flex items-center space-x-2 pt-2">
        <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center">
          <span className="text-white font-bold">M</span>
        </div>
        <h1 className="text-xl font-bold text-neutral-800 dark:text-white">MindJournal</h1>
      </div>
      
      {/* User info */}
      <div className="p-3 mb-6 rounded-lg bg-neutral-100 dark:bg-neutral-700">
        <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">
          {user?.name}
        </div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {user?.email}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? activeClass : inactiveClass}`
            }
            end={item.path === '/'}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Theme</span>
          <ThemeToggle />
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-neutral-800 transition-colors"
        >
          <FiLogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar