const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const validatePassword = require("./validatePassword");
const validateEmail = require("./validateEmail");

module.exports = async (req, res) => {
  try {
    const { firstName, name, email, password, confirmPassword } = req.body;

    if (!validateEmail(email)) return res.redirect("/register");

    const emailLower = email.toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) return res.redirect("/register");

    if (!validatePassword(password)) return res.redirect("/register");
    if (password !== confirmPassword) return res.redirect("/register");

    if (!req.file || !req.file.path || !req.file.filename) {
      return res.redirect("/register");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      name,
      email: emailLower,
      password: hashPassword,
      avatar: req.file.path,         
      avatarPublicId: req.file.filename,
      role: "user",
    });

    await newUser.save();

    req.session.userId = newUser._id;
    req.session.role = newUser.role;
    req.session.avatar = newUser.avatar;
    req.session.firstName = newUser.firstName;

    return res.redirect("/");
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return res.redirect("/register");
  }
};
