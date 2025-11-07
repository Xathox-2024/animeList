const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const validatePassword = require("./validatePassword");

module.exports = async (req, res) => {
  try {
    const { newPassword, confirmNewPassword } = req.body;
    const token = req.params.token;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.send("Token invalide ou expiré. Faites une nouvelle demande.");
    }

    if (newPassword !== confirmNewPassword) {
      return res.send("Les mots de passe ne correspondent pas.");
    }

    if (!validatePassword(newPassword)) {
      return res.send("Le mot de passe doit contenir au moins 8 caractères, 1 majuscule et 1 caractère spécial.");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return res.redirect("/login");
  } catch (error) {
    return res.redirect("/login");
  }
};
