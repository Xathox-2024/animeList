const login = require("./users/login");
const register = require("./users/register");
const resetPasswordEmail = require("./users/resetPasswordEmail");
const resetPassword = require("./users/resetPassword");
const logout = require("./users/logout");
const changePassword = require("./users/changePassword");
const validateEmail = require("./users/validateEmail");
const validatePassword = require("./users/validatePassword");
const deleteMe = require("./users/deleteMe");

module.exports = {
  login,
  register,
  resetPasswordEmail,
  resetPassword,
  logout,
  changePassword,
  validateEmail,
  validatePassword,
  deleteMe,
};
