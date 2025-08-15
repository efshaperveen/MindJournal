// Password reset API routes
import express from 'express';
import { 
  sendPasswordResetEmail, 
  generateResetToken, 
  storeResetToken, 
  verifyResetToken, 
  useResetToken 
} from '../services/emailService.js';

const router = express.Router();

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, users } = req.body;
    
    if (!email || !users) {
      return res.status(400).json({ error: 'Email and users data are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    // Check if user exists in the provided users array
    const userExists = users.some(u => u.email === email);
    if (!userExists) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }
    
    // Generate token
    const token = generateResetToken();
    
    // Store token using email service
    storeResetToken(token, email);
    
    // Send email using the backend email service
    const result = await sendPasswordResetEmail(email, token);
    
    res.json(result);
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to send password reset email. Please try again.' 
    });
  }
});

// Verify reset token
router.post('/verify-token', (req, res) => {
  try {
    const { email, token } = req.body;
    
    if (!email || !token) {
      return res.status(400).json({ error: 'Email and token are required' });
    }
    
    const tokenValidation = verifyResetToken(email, token);
    
    if (!tokenValidation.valid) {
      return res.status(400).json({ error: tokenValidation.error });
    }
    
    res.json({ valid: true });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
});

// Reset password
router.post('/reset-password', (req, res) => {
  try {
    const { email, token, newPassword, users } = req.body;
    
    if (!email || !token || !newPassword || !users) {
      return res.status(400).json({ error: 'Email, token, new password, and users data are required' });
    }
    
    const tokenValidation = verifyResetToken(email, token);
    
    if (!tokenValidation.valid) {
      return res.status(400).json({ error: tokenValidation.error });
    }
    
    // Mark token as used
    useResetToken(token);
    
    // Update password (no hashing for localStorage compatibility)
    // Find and update user in the provided users array
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update the user's password (store as plain text for localStorage compatibility)
    users[userIndex].password = newPassword;
    
    // Return the updated users array so frontend can update localStorage
    res.json({ 
      success: true, 
      message: 'Password reset successfully!',
      users: users
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
