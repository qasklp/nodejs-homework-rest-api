const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": "missing required name field"
  }),
  email: Joi.string().email({minDomainSegments: 2,}).required().messages({
    "any.required": "missing required name field"
  }),
  phone: Joi.string().pattern(/^[0-9 ()\-]+$/).required().messages({
    "any.required": "missing required name field"
  }),
})

module.exports = {
    addSchema,
}