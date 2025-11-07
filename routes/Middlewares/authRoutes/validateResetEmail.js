const Joi = require("joi");

const resetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

function validateResetEmail(req, res, next) {
  const { error } = resetEmailSchema.validate(req.body);
  if (error) {
    return res.redirect("/resetpassword?error=Email invalide ou manquant");
  }
  next();
}

module.exports = validateResetEmail;