// Email Validation
function isValidEmail(email) {
  if (!email) return false;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|co|in)$/i;

  return emailRegex.test(email.trim());
}

// Mobile Validation (Indian Numbers)
function isValidMobile(mobile) {
  if (!mobile) return false;

  const mobileRegex = /^[6-9]\d{9}$/;

  return mobileRegex.test(mobile.trim());
}

// Username Validation
function isValidUsername(username) {
  if (!username) return false;

  return username.trim().length >= 3;
}

// Required Field Validation
function isRequired(value) {
  if (value === undefined || value === null) {
    return false;
  }

  return value.toString().trim() !== "";
}

// Validate Complete User
function validateUser(data) {
  const errors = {};

  // Username
  if (!isRequired(data.username)) {
    errors.username = "Username is required.";
  } else if (!isValidUsername(data.username)) {
    errors.username = "Username must be at least 3 characters.";
  }

  // Email
  if (!isRequired(data.email)) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Invalid email address.";
  }

  // Mobile
  if (!isRequired(data.mobile)) {
    errors.mobile = "Mobile number is required.";
  } else if (!isValidMobile(data.mobile)) {
    errors.mobile = "Invalid mobile number.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  isValidEmail,
  isValidMobile,
  isValidUsername,
  isRequired,
  validateUser,
};