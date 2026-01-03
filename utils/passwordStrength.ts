/**
 * Password Strength Utilities
 * ============================
 * Evaluates password strength for better security
 */

export type PasswordStrength = 'weak' | 'medium' | 'strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-100
  feedback: string[];
  color: string;
}

/**
 * Evaluate password strength
 * Returns strength level, score (0-100), and feedback
 */
export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      strength: 'weak',
      score: 0,
      feedback: ['Password is required'],
      color: '#ef4444',
    };
  }
  
  let score = 0;
  const feedback: string[] = [];
  
  // Length scoring (40 points max)
  if (password.length >= 8) {
    score += 20;
  } else {
    feedback.push('Use at least 8 characters');
  }
  
  if (password.length >= 12) {
    score += 20;
  } else if (password.length >= 8) {
    feedback.push('Consider using 12+ characters');
  }
  
  // Character variety scoring (60 points max)
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  
  if (hasLowercase) score += 10;
  if (hasUppercase) score += 15;
  else feedback.push('Add uppercase letters');
  
  if (hasNumbers) score += 15;
  else feedback.push('Add numbers');
  
  if (hasSpecial) score += 20;
  else feedback.push('Add special characters (!@#$%^&*)');
  
  // Common patterns penalty
  const commonPatterns = [
    /^123/,
    /^abc/i,
    /^password/i,
    /^qwerty/i,
    /(.)\1{2,}/, // repeating characters
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score = Math.max(0, score - 20);
      feedback.push('Avoid common patterns');
      break;
    }
  }
  
  // Determine strength level
  let strength: PasswordStrength;
  let color: string;
  
  if (score < 40) {
    strength = 'weak';
    color = '#ef4444'; // red
  } else if (score < 70) {
    strength = 'medium';
    color = '#f59e0b'; // orange
  } else {
    strength = 'strong';
    color = '#10b981'; // green
  }
  
  return {
    strength,
    score,
    feedback: feedback.length > 0 ? feedback : ['Strong password!'],
    color,
  };
}

/**
 * Get password strength label for display
 */
export function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'medium':
      return 'Medium';
    case 'strong':
      return 'Strong';
  }
}

/**
 * Get password strength emoji
 */
export function getPasswordStrengthEmoji(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'strong':
      return '🟢';
  }
}
