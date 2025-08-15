// Email service for backend
import nodemailer from 'nodemailer';

// Token storage (in production, use a database like Redis)
const resetTokens = new Map();

// Generate secure reset token
export const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

// Store reset token
export const storeResetToken = (token, email) => {
  const expirationTime = Date.now() + (15 * 60 * 1000); // 15 minutes
  resetTokens.set(token, {
    email,
    expirationTime,
    used: false
  });
};

// Verify reset token
export const verifyResetToken = (email, token) => {
  const tokenData = resetTokens.get(token);
  
  if (!tokenData) {
    return { valid: false, error: 'Invalid reset token' };
  }
  
  if (tokenData.email !== email) {
    return { valid: false, error: 'Token does not match email' };
  }
  
  if (tokenData.used) {
    return { valid: false, error: 'Reset token has already been used' };
  }
  
  if (Date.now() > tokenData.expirationTime) {
    resetTokens.delete(token);
    return { valid: false, error: 'Reset token has expired' };
  }
  
  return { valid: true };
};

// Mark token as used
export const useResetToken = (token) => {
  const tokenData = resetTokens.get(token);
  if (tokenData) {
    tokenData.used = true;
    resetTokens.set(token, tokenData);
  }
};

// Clean up expired tokens
export const cleanupExpiredTokens = () => {
  const now = Date.now();
  for (const [token, data] of resetTokens.entries()) {
    if (now > data.expirationTime) {
      resetTokens.delete(token);
    }
  }
};

// Auto cleanup every 30 minutes
setInterval(cleanupExpiredTokens, 30 * 60 * 1000);

// Configure nodemailer transporter
const createTransporter = () => {
  // For development, you can use services like Gmail, Outlook, or other SMTP providers
  // For production, consider using services like SendGrid, Mailgun, or AWS SES
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file');
    return null;
  }
  
  return nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      throw new Error('Email service not configured. Please configure EMAIL_USER and EMAIL_PASS in backend .env file');
    }
    
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your MindJournal Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧠 MindJournal</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Mental Health & Mood Tracking</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
            
            <p>Hello,</p>
            
            <p>We received a request to reset your password for your MindJournal account. If you didn't make this request, you can safely ignore this email.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                Reset My Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
              <strong>⚠️ Important:</strong> This link will expire in 15 minutes for security reasons.
            </p>
            
            <p style="font-size: 14px; color: #666;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetLink}" style="color: #667eea; word-break: break-all;">${resetLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #888; text-align: center;">
              This email was sent by MindJournal. If you have any questions, please contact our support team.<br>
              <strong>Email:</strong> ${email} | <strong>Time:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Password reset email sent successfully:', info.messageId);
    console.log('📧 Email sent to:', email);
    
    return {
      success: true,
      message: 'Password reset instructions have been sent to your email address.',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('❌ Email service error:', error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};
