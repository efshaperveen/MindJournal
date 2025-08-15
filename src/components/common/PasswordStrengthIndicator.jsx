import { motion } from "framer-motion";
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from "../../utils/passwordValidation";
import { FiCheck, FiX } from "react-icons/fi";

const PasswordStrengthIndicator = ({ password, showCriteria = true }) => {
  const validation = validatePassword(password);
  const { criteria, strength, score } = validation;

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 space-y-3"
    >
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-libre-baskerville text-neutral-700 dark:text-neutral-300">
            Password Strength
          </span>
          <span className={`font-medium ${
            strength === 'strong' ? 'text-green-600 dark:text-green-400' :
            strength === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {getPasswordStrengthText(strength)}
          </span>
        </div>
        
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / 5) * 100}%` }}
            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(strength)}`}
          />
        </div>
      </div>

      {/* Criteria List */}
      {showCriteria && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"
        >
          {Object.entries(criteria).map(([key, met]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2 ${
                met ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <motion.div
                animate={{ scale: met ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {met ? <FiCheck size={14} /> : <FiX size={14} />}
              </motion.div>
              <span className="font-lora text-xs">
                {getCriteriaText(key)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

const getCriteriaText = (key) => {
  const texts = {
    minLength: 'At least 8 characters',
    hasUppercase: 'One uppercase letter',
    hasLowercase: 'One lowercase letter',
    hasNumber: 'One number',
    hasSpecialChar: 'One special character',
  };
  return texts[key] || key;
};

export default PasswordStrengthIndicator;
