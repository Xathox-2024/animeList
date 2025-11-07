const Joi = require("joi");

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().required(),
});

function validateChangePassword(req, res, next) {
  if (!req.body.currentPassword && req.body.oldPassword) {
    req.body.currentPassword = req.body.oldPassword;
  }

  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.redirect("/change-password?error=Champs invalides");
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.redirect("/change-password?error=Les mots de passe ne correspondent pas");
  }

  return next();
}

module.exports = validateChangePassword;
