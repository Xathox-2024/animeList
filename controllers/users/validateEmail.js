const customEmailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

module.exports = function validateEmail(email) {
  return customEmailRegex.test(email);
};