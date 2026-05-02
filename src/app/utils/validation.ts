/**
 * Form validation utilities for login/signup
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === "") {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
}

/**
 * Validate password strength
 * - At least 6 characters
 * - Optional: mix of uppercase, lowercase, numbers
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim() === "") {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }

  return { valid: true };
}

/**
 * Validate username
 * - 3-20 characters
 * - Alphanumeric, underscores, hyphens allowed
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim() === "") {
    return { valid: false, error: "Username is required" };
  }

  if (username.length < 3 || username.length > 20) {
    return { valid: false, error: "Username must be 3-20 characters" };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }

  return { valid: true };
}

/**
 * Validate login form
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) return emailValidation;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) return passwordValidation;

  return { valid: true };
}

/**
 * Validate signup form
 */
export function validateSignupForm(username: string, email: string, password: string): ValidationResult {
  const usernameValidation = validateUsername(username);
  if (!usernameValidation.valid) return usernameValidation;

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) return emailValidation;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) return passwordValidation;

  return { valid: true };
}
