const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

function validateRegister(req, res, next) {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.redirect("/register?error=one imput invalid");
  }
  next();
}

module.exports = validateRegister;