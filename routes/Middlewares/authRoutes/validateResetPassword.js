const Joi = require("joi");

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().required(),
  confirmNewPassword: Joi.string().required(),
});

function validateResetPassword(req, res, next) {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.send("Données invalides ou manquantes.");
  }
  next();
}

module.exports = validateResetPassword;