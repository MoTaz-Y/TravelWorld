//  Validate Email
export const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) return { valid: false, message: 'Email Required' };
  if (!regex.test(value)) return { valid: false, message: 'not a valid email' }; // الإيميل غير صحيح' };
  return { valid: true, message: 'valid email' };
};

//  Validate Password (8+ chars, 1 Uppercase, 1 Number, 1 Symbol)
export const validatePassword = (value) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!value) return { valid: false, message: 'Password Required' };
  if (!regex.test(value))
    return {
      valid: false,
      message:
        'Password must be at least 8 characters, 1 Uppercase, 1 Number, 1 Symbol',
    };
  return { valid: true, message: 'Password is valid' };
};
// Validate Confirm Password
export const validateConfirmPassword = (value, password) => {
  if (!value) return { valid: false, message: 'Confirm Password Required' };
  if (value !== password)
    return { valid: false, message: 'Passwords do not match' };
  return { valid: true, message: 'Passwords match' };
};

// Validate Phone Number
export const validatePhone = (value) => {
  const regex = /^[0-9]{10,11}$/;
  if (!value) return { valid: false, message: 'Phone Number Required' };
  if (!regex.test(value))
    return { valid: false, message: 'Phone Number must be 10 or 11 digits' };
  return { valid: true, message: 'Phone Number is valid' };
};

//Validate Name
export const validateName = (value) => {
  const regex = /^[A-Za-z\u0600-\u06FF\s]{3,}$/;
  if (!value) return { valid: false, message: 'Name Required' };
  if (!regex.test(value))
    return { valid: false, message: 'Name must be at least 3 characters' };
  return { valid: true, message: 'Name is valid' };
};

// Validate Guest Size
export const validateGuests = (value) => {
  if (!value) return { valid: false, message: 'Guests Required' };
  if (isNaN(value) || value <= 0)
    return { valid: false, message: 'Guests must be a positive number' };
  return { valid: true, message: 'Guests is valid' };
};

// Validate Date
export const validateDate = (value) => {
  if (!value) return { valid: false, message: 'Date Required' };
  const today = new Date();
  const chosen = new Date(value);
  if (chosen < today)
    return { valid: false, message: 'Chosen Date is in the past' };
  return { valid: true, message: 'Date is valid' };
};
