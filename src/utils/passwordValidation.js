// Password validation utility
export const validatePassword = (password) => {
  const criteria = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(criteria).filter(Boolean).length;
  const strength = score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong';

  return {
    criteria,
    score,
    strength,
    isValid: score >= 4, // At least 4 out of 5 criteria
  };
};

export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

export const getPasswordStrengthText = (strength) => {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'medium':
      return 'Medium';
    case 'strong':
      return 'Strong';
    default:
      return '';
  }
};
