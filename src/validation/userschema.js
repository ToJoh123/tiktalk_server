const Joi = require('joi');

const userSchema = Joi.object({
  firstname: Joi.string().required().messages({
    'any.required': 'First name is required'
  }),
  surname: Joi.string().required().messages({
    'any.required': 'Surname is required'
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username must contain only letters and numbers',
    'string.min': 'Username must be at least {#limit} characters long',
    'string.max': 'Username must be at most {#limit} characters long',
    'any.required': 'Username is required'
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required().messages({
    'string.pattern.base': 'Password must be alphanumeric and between 6 and 30 characters long',
    'any.required': 'Password is required'
  })
});

module.exports = {
  userSchema
};