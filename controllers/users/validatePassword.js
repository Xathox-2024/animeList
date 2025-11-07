const validator = require("validator");

module.exports = function validatePassword(password) {
  return validator.isStrongPassword(password, {
    minLength: 8,
    minUppercase: 1,
    minSymbols: 1,
  });
};