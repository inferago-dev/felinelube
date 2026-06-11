// backend/utils/emailService.js
// Mock email service for development. In production, integrate with SendGrid, Nodemailer, etc.

const sendPasswordReset = async (email, resetToken) => {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`
  console.log(`\n=============================================================`)
  console.log(`[EMAIL MOCK] Sending Password Reset Link to: ${email}`)
  console.log(`[EMAIL MOCK] Click here to reset: ${resetLink}`)
  console.log(`=============================================================\n`)
  return true
}

module.exports = { sendPasswordReset }
