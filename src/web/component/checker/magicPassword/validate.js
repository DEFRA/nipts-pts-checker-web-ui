import Joi from "joi";
import config from "../../../../config/index.js";

const getPassword = () => {
  return config.authConfig.magicPassword.password;
};

const validatePassword = (password) => {
  const passwordSchema = Joi.string().valid(getPassword()).required().messages({
    "any.only": "The password is not correct",
    "any.required": "The password is required",
    "string.empty": "The password is required",
  });

  const { error } = passwordSchema.validate(password);
  return {
    isValid: !error,
    error: error ? error.details[0].message : null,
  };
};

export { validatePassword };
