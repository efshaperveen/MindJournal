import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useJournal } from '../contexts/JournalContext'
import { FiSun, FiMoon, FiUser, FiLock, FiTrash2, FiMail, FiShield } from 'react-icons/fi'

const Settings = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { pin, setPin } = useJournal()
  
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinSuccess, setPinSuccess] = useState('')
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleSetPin = (e) => {
    e.preventDefault()
    setPinError('')
    setPinSuccess('')

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinError('PIN must be 4 digits.')
      return
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match.')
      return
    }
    
    setPin(newPin)
    setPinSuccess('PIN has been updated successfully!')
    setNewPin('')
    setConfirmPin('')
  }
  
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
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
        Settings
      </h1>
      
      <div className="card overflow-hidden">
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium p-4 bg-neutral-50 dark:bg-neutral-800">
            Account Settings
          </h2>
          
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                <FiUser className="mr-2" />
                Name
              </div>
              <div className="font-medium text-neutral-800 dark:text-white">
                {user.name}
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                <FiMail className="mr-2" />
                Email
              </div>
              <div className="font-medium text-neutral-800 dark:text-white">
                {user.email}
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                <FiLock className="mr-2" />
                Password
              </div>
              <div className="font-medium text-neutral-800 dark:text-white">
                ••••••••
              </div>
            </div>
            
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={logout}
                className="btn btn-outline w-full"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium p-4 bg-neutral-50 dark:bg-neutral-800">
            Appearance
          </h2>
          
          <div className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-neutral-800 dark:text-white mb-1">
                  Theme
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {theme === 'dark' ? 'Dark mode is on' : 'Light mode is on'}
                </div>
              </div>
              
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-neutral-300 dark:bg-neutral-600"
              >
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-6 bg-primary-600' : 'translate-x-1 bg-white'
                  } inline-block h-4 w-4 transform rounded-full transition-transform`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-medium p-4 bg-neutral-50 dark:bg-neutral-800 flex items-center mb-4">
            Vault Settings
          </h2>
          
          <form onSubmit={handleSetPin} className="px-6 space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {pin ? 'Change Vault PIN' : 'Set Vault PIN'}
              </label>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                Set a 4-digit PIN
              </p>
              <input
                type="password"
                placeholder="New 4-digit PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                maxLength="4"
                className="input w-full"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                maxLength="4"
                className="input w-full"
              />
            </div>
            
            {pinError && <p className="text-sm text-red-600 dark:text-red-400">{pinError}</p>}
            {pinSuccess && <p className="text-sm text-green-600 dark:text-green-400">{pinSuccess}</p>}
            
            <button type="submit" className="btn btn-primary w-full">
              {pin ? 'Update PIN' : 'Save PIN'}
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-lg font-medium p-4 bg-neutral-50 dark:bg-neutral-800">
            Data Management
          </h2>
          
          <div className="p-6 space-y-4">
            <div>
              <button
                onClick={clearAllData}
                className="btn w-full border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                className="btn w-full border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
              >
                <FiTrash2 className="mr-2" size={16} />
                Delete Account
              </button>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                This will permanently delete your account and all associated data.
              </p>
            </div>
            
            {showConfirmDelete && (
              <div className="mt-4 p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium mb-3">
                  Are you sure you want to delete your account?
                </p>
                <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                  This action is permanent and cannot be undone. All your data will be lost.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={deleteAccount}
                    className="btn bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, delete my account
                  </button>
                  <button
                    onClick={() => setShowConfirmDelete(false)}
                    className="btn btn-outline"
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
