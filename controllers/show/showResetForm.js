const Joi = require("joi");
const User = require("../../models/userModel");

const tokenSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = async (req, res) => {
  try {
    const { error, value } = tokenSchema.validate({ token: req.params.token });
    if (error) {
      return res.send("Lien de réinitialisation invalide.");
    }

    const user = await User.findOne({
      resetToken: value.token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Token introuvable ou expiré !");
      return res
        .send("Lien de réinitialisation invalide ou expiré.");
    }

    res.render("resetPassword", { token: value.token });
  } catch (error) {
    console.error(
      "Erreur lors du chargement de la page de réinitialisation :",
      error
    );
    res
      .redirect("/login?error=Erreur lors du chargement de la page de réinitialisation.");
  }
};
