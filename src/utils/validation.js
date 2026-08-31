/**
 * Validation utilities for form fields and authentication
 */

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^(\+84|84|0)[1-9][0-9]{8,9}$/;

export const validateEmailOrPhone = (value) => {
  if (!value || typeof value !== 'string') {
    return { isValid: false, message: 'Vui lòng nhập Email hoặc Số điện thoại' };
  }
  const trimmed = value.trim();
  const isEmail = EMAIL_REGEX.test(trimmed);
  const isPhone = PHONE_REGEX.test(trimmed.replace(/[\s.-]/g, ''));

  if (!isEmail && !isPhone) {
    return { isValid: false, message: 'Email hoặc Số điện thoại không hợp lệ' };
  }
  return { isValid: true, message: '', type: isEmail ? 'email' : 'phone' };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Mật khẩu không được để trống' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' };
  }
  return { isValid: true, message: '' };
};

export const validateLoginForm = ({ account, password }) => {
  const accountValidation = validateEmailOrPhone(account);
  if (!accountValidation.isValid) return accountValidation;

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) return passwordValidation;

  return { isValid: true, message: '' };
};
