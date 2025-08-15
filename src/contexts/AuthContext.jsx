import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from "jwt-decode";
import { validatePassword } from '../utils/passwordValidation'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // In a real app, this would be an API call to authenticate
    return new Promise((resolve, reject) => {
      // Find user in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === password)
      
      if (foundUser) {
        // Create a user object without the password
        const { password, ...userWithoutPassword } = foundUser
        
        // Save to state and localStorage
        setUser(userWithoutPassword)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        resolve(userWithoutPassword)
      } else {
        reject(new Error('Invalid email or password'))
      }
    })
  }

  const register = (name, email, password) => {
    // In a real app, this would be an API call to register
    return new Promise((resolve, reject) => {
      // Get existing users or create empty array
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        reject(new Error('User with this email already exists'))
        return
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      }
      
      // Save user to localStorage
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      
      // Login the new user
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      resolve(userWithoutPassword)
    })
  }

  const logout = () => {
    // Remove user from state and localStorage
    setUser(null)
    localStorage.removeItem('user')
    navigate('/login')
  }

  const loginWithGoogle = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { name, email, sub: googleId } = decoded;

    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      let user = users.find(u => u.email === email);

      if (user) {
        // User exists, log them in
        const { password, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      } else {
        // New user, register them
        const newUser = {
          id: googleId,
          name,
          email,
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        resolve(newUser);
      }
    });
  };

  // Password reset functionality - calls backend API
  const requestPasswordReset = async (email) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if user exists locally first
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.find(u => u.email === email);
        
        if (!userExists) {
          reject(new Error('No account found with this email address.'));
          return;
        }
        
        // Call backend API to send reset email
        const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, users }),
        });

        const data = await response.json();

        if (!response.ok) {
          reject(new Error(data.error || 'Failed to send reset email'));
          return;
        }
        
        resolve({ message: data.message || 'Password reset email sent successfully!' });
      } catch (error) {
        console.error('Password reset error:', error);
        reject(new Error('Failed to send password reset email. Please try again.'));
      }
    });
  };

  // Reset password with token - calls backend API
  const resetPassword = async (email, token, newPassword) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Validate password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
          reject(new Error('Password does not meet security requirements.'));
          return;
        }

        // Get current users data
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Call backend API to reset password
        const response = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, token, newPassword, users }),
        });

        const data = await response.json();

        if (!response.ok) {
          reject(new Error(data.error || 'Failed to reset password'));
          return;
        }

        // Update local storage with the hashed password from backend
        if (data.users) {
          localStorage.setItem('users', JSON.stringify(data.users));
        }
        
        resolve({ message: data.message || 'Password reset successfully!' });
      } catch (error) {
        console.error('Reset password error:', error);
        reject(new Error('Failed to reset password. Please try again.'));
      }
    });
  };

  // Update password (from settings)
  const updatePassword = (currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      try {
        // Validate new password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
          reject(new Error('New password does not meet security requirements.'));
          return;
        }

        // Verify current password
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = users.find(u => u.id === user.id);
        
        if (!currentUser || currentUser.password !== currentPassword) {
          reject(new Error('Current password is incorrect.'));
          return;
        }

        // Update password
        const userIndex = users.findIndex(u => u.id === user.id);
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        resolve({ message: 'Password updated successfully!' });
      } catch (error) {
        reject(error);
      }
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    requestPasswordReset,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
