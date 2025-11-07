const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Je cherche l'utilisateur avec l'email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Utilisateur introuvable");
      return res.redirect("/login");
    }

    // Je compare les mots de passe
    const bcryptCompare = await bcrypt.compare(password, user.password);
    if (!bcryptCompare) {
      console.log("Mot de passe incorrect");
      return res.redirect("/login");
    }

    // Je stocke les infos utiles dans la session
    req.session.userId = user._id;
    req.session.avatar = user.avatar; 
    req.session.role = user.role;
    req.session.firstName = user.firstName;
    req.session.name = user.name;

    // Je redirige vers la page principale
    res.redirect("/");

  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.redirect("/login");
  }
};
