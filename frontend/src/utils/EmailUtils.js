import axios from 'axios';

class EmailUtils {
  static BASE_URL = 'http://localhost:8080';
  
  static generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendConfirmationCode(email) {
    try {
      const confirmationCode = this.generateConfirmationCode();
      
      const response = await axios.post(`${this.BASE_URL}/users/send-confirmation`, {
        email,
        confirmationCode,
        subject: 'Password Reset Confirmation Code',
        text: `Your confirmation code for password reset is: ${confirmationCode}. This code will expire in 15 minutes.`
      });

      if (response.status === 200) {
        sessionStorage.setItem('resetEmail', email);
        sessionStorage.setItem('confirmationCode', confirmationCode);
        return { success: true, message: 'Confirmation code sent successfully' };
      }
      
      return { success: false, message: 'Failed to send confirmation code' };
    } catch (error) {
      console.error('Error sending confirmation code:', error);
      throw new Error(error.response?.data?.message || 'Failed to send confirmation code');
    }
  }


  static verifyConfirmationCode(userInputCode) {
    const storedCode = sessionStorage.getItem('confirmationCode');
    return storedCode === userInputCode;
  }

  static async resetPassword(newPassword) {
    try {
      const email = sessionStorage.getItem('resetEmail');
      if (!email) {
        throw new Error('Email not found in session');
      }

      const response = await axios.post(`${this.BASE_URL}/users/update-password`, {
        email,
        newPassword
      });

      if (response.status === 200) {
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('confirmationCode');
        return { success: true, message: 'Password reset successfully' };
      }

      return { success: false, message: 'Failed to reset password' };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static clearResetSession() {
    sessionStorage.removeItem('resetEmail');
    sessionStorage.removeItem('confirmationCode');
  }
}

export default EmailUtils;