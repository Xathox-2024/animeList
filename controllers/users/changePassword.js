const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

module.exports = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // 1) connecté ?
    if (!req.session || !req.session.userId) {
      return res.redirect("/login");
    }

    // 2) récupérer le hash (password a select:false dans le schéma)
    const user = await User.findById(req.session.userId).select("+password");
    if (!user) {
      return res.redirect("/login");
    }

    // 3) vérifier l'ancien mot de passe
    const ok = await bcrypt.compare(currentPassword || "", user.password || "");
    if (!ok) {
      return res.redirect("/change-password?error=Mot de passe actuel incorrect");
    }

    // 4) empêcher de remettre le même mdp
    const sameAsOld = await bcrypt.compare(newPassword || "", user.password || "");
    if (sameAsOld) {
      return res.redirect("/change-password?error=Le nouveau mot de passe doit être différent de l’actuel");
    }

    // 5) hasher + update ciblée
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: req.session.userId },
      { $set: { password: hashed } }
    );

    return res.redirect("/change-password?message=Mot de passe mis à jour");
  } catch (e) {
    console.error("changePassword error:", e);
    return res.redirect("/change-password?error=Erreur serveur");
  }
};
