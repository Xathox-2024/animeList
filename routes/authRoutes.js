const express = require("express");
const router = express.Router();

const isAuthenticated = require("../routes/Middlewares/authRoutes/isAuthenticated");
const usersControllers = require("../controllers/usersControllers");

const validateLogin = require("./Middlewares/authRoutes/validateLogin");
const validateRegister = require("./Middlewares/authRoutes/validateRegister");
const validateResetEmail = require("./Middlewares/authRoutes/validateResetEmail");
const validateResetPassword = require("./Middlewares/authRoutes/validateResetPassword");
const upload = require("../routes/Middlewares/authRoutes/multerCloudinary");
const validateChangePassword = require("./Middlewares/authRoutes/validateChangePassword");

router.get("/", usersControllers.showHome);
router.get("/login", usersControllers.showLogin);
router.get("/register", usersControllers.showRegister);
router.get("/logout", usersControllers.logout);
router.get("/resetpassword", usersControllers.showResetPassword);
router.get("/resetpassword/:token", usersControllers.showResetForm);
router.get("/change-password", isAuthenticated, usersControllers.showChangePassword);

router.post("/login", validateLogin, usersControllers.login);
router.post("/register", upload.single("avatar"), validateRegister, usersControllers.register);
router.post("/resetpassword", validateResetEmail, usersControllers.resetPasswordEmail);
router.post("/resetpassword/:token", validateResetPassword, usersControllers.resetPassword);
router.post("/me/delete", isAuthenticated, usersControllers.deleteMe);
router.post("/change-password", isAuthenticated, validateChangePassword, usersControllers.changePassword);

module.exports = router;
