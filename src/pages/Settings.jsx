import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { FiSun, FiMoon, FiUser, FiLock, FiTrash2, FiMail } from 'react-icons/fi'

const Settings = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete all your journal data? This action cannot be undone.')) {
      // Clear journal entries
      localStorage.removeItem(`journal_entries_${user.id}`)
      
      // Keep the user logged in but refresh the page to clear state
      window.location.reload()
    }
  }
  
  const deleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? All your data will be permanently deleted. This action cannot be undone.')) {
      // Get all users
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Filter out current user
      const updatedUsers = users.filter(u => u.id !== user.id)
      
      // Update users in localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      
      // Remove journal entries
      localStorage.removeItem(`journal_entries_${user.id}`)
      
      // Log out the user
      logout()
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white relative inline-block">
        <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
      Settings
    </span>
    <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-20 rounded-full animate-pulse"></span>
  </h1>
      
      <div className="card overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold p-4 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-white relative">
           <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
        Account Settings
      </span>
      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-teal-400 opacity-20 rounded-full"></span>
    </h2>
          
          <div className="p-6 space-y-6">
            <div className="group">
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1 transition-colors group-hover:text-teal-400">
                <FiUser className="mr-2 group-hover:stroke-teal-400 transition-colors" />
                Name
              </div>
              <div className="font-semibold text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-800 rounded-md px-3 py-2 transition-colors duration-200 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
                {user.name}
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1 transition-colors group-hover:text-teal-400">
                <FiMail className="mr-2 group-hover:stroke-teal-400 transition-colors" />
                Email
              </div>
              <div className="font-semibold text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-800 rounded-md px-3 py-2 transition-colors duration-200 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
                {user.email}
              </div>
            </div>
            
            <div className="group">
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1 transition-colors group-hover:text-teal-400">
                <FiLock className="mr-2 group-hover:stroke-teal-400 transition-colors" />
                Password
              </div>
              <div className="font-semibold text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-800 rounded-md px-3 py-2 transition-colors duration-200 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 flex justify-between items-center">
                ••••••••
              </div>
            </div>
            
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={logout}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-md hover:border-teal-500 hover:text-teal-500 transition-all duration-200 shadow-sm hover:shadow-teal-500/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold p-4 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-white relative">
              <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
      Appearance
    </span>
    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-teal-400 opacity-20 rounded-full"></span>
  </h2>
          
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-neutral-800 dark:text-white mb-1">
                 <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Theme
                </span>
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
                </div>
              </div>
              
              <button
      onClick={toggleTheme}
      className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300
        ${theme === 'dark' ? 'bg-teal-500' : 'bg-neutral-300 dark:bg-neutral-600'}
      `}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}
        `}
      ></div>
    </button>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold p-4 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-white relative">
            <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
      Data Management
    </span>
    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-teal-400 opacity-20 rounded-full"></span>
          </h2>
          
          <div className="p-6 space-y-4">
            <div>
              <button
                onClick={clearAllData}
                className="w-full border border-red-500 text-red-500 rounded-md py-2 px-4 font-semibold transition-all duration-200 
                 hover:bg-red-500 hover:text-white shadow-md hover:shadow-red-500/40 active:scale-95"
              >
                Clear All Journal Data
              </button>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                This will delete all your journal entries but keep your account.
              </p>
            </div>
            
            <div>
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="w-full border border-red-500 text-red-500 rounded-md py-2 px-4 font-semibold flex items-center justify-center
               hover:bg-red-500 hover:text-white shadow-md hover:shadow-red-500/40 active:scale-95 transition-all duration-200"
              >
                <FiTrash2 className="mr-2" size={16} />
                Delete Account
              </button>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                This will permanently delete your account and all associated data.
              </p>
            </div>
            
            {showConfirmDelete && (
              <div className="mt-4 p-6 border border-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg animate-fadeIn">
                <p className="text-red-700 dark:text-red-300 font-semibold text-lg mb-3">
                  Are you sure you want to delete your account?
                </p>
                <p className="text-red-600 dark:text-red-400 text-sm mb-6">
                  This action is permanent and cannot be undone. All your data will be lost.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={deleteAccount}
                    className="btn bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, delete my account
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="w-full py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-red-500/40 active:scale-95 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings