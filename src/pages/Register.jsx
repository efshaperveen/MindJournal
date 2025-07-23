import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiUser, FiMail, FiLock } from 'react-icons/fi'
import axios from 'axios'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const sendOtp = async () => {
    try {
      setError('')
      await axios.post('http://localhost:5000/send-otp', { email: formData.email })
      setOtpSent(true)
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    }
  }

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', {
        email: formData.email,
        otp
      })

      if (response.data.verified) {
        setOtpVerified(true)
        handleFinalSubmit()
      } else {
        setError('Invalid OTP')
      }
    } catch {
      setError('OTP verification failed')
    }
  }

  const handleFinalSubmit = async () => {
    try {
      setError('')
      setLoading(true)
      await register(formData.name, formData.email, formData.password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    if (!otpSent) {
      await sendOtp()
      return
    }

    if (!otpVerified) {
      return // wait for OTP input and verification
    }
  }

  return (
    <div className="card p-6 w-full animate-fadeIn">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Create Account</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Join MindJournal to start your journal</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
              className="input pl-10"
              placeholder="Your name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
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
              className="input pl-10"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-neutral-500" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input pl-10"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-neutral-500" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input pl-10"
              placeholder="••••••••"
            />
          </div>
        </div>

        {otpSent && !otpVerified && (
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input"
              placeholder="Enter OTP sent to email"
            />
            <button
              type="button"
              onClick={verifyOtp}
              className="btn btn-secondary mt-2 w-full"
            >
              Verify OTP
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || otpSent && !otpVerified}
          className="btn btn-primary w-full"
        >
          {loading ? 'Creating account...' : otpSent ? 'Verify OTP to complete' : 'Create account'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
          Sign in
        </Link>
      </div>
    </div>
  )
}

export default Register
