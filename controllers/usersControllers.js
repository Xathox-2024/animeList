const showLogin = require("./users/show/showLogin");
const showRegister = require("./users/show/showRegister");
const showResetPassword = require("./users/show/showResetPassword");
const login = require("./users/login");
const register = require("./users/register");
const resetPasswordEmail = require("./users/resetPasswordEmail");
const showResetForm = require("./users/show/showResetForm");
const resetPassword = require("./users/resetPassword");
const logout = require("./users/logout");
const showChangePassword = require("./users/show/showChangePassword");
const changePassword = require("./users/changePassword");
const validateEmail = require("./users/validateEmail");
const validatePassword = require("./users/validatePassword");
const deleteMe = require("./users/deleteMe");
const showHome = require("./users/show/showHome");

module.exports = {
  showHome,
  showLogin,
  showRegister,
  showResetPassword,
  login,
  register,
  resetPasswordEmail,
  showResetForm,
  resetPassword,
  logout,
  showChangePassword,
  changePassword,
  validateEmail,
  validatePassword,
  deleteMe,
  showHome,
};
