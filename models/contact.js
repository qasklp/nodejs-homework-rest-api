const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../utils");

const Joi = require("joi");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }
});

const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": "missing required name field"
  }),
  email: Joi.string().email({minDomainSegments: 2,}).required().messages({
    "any.required": "missing required email field"
  }),
  phone: Joi.string().pattern(/^[0-9 ()\-]+$/).required().messages({
    "any.required": "missing required phone field"
  }),
  favorite: Joi.boolean(),
})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const Contact = model("contact", contactSchema);

contactSchema.post("save", handleMongooseError);

const schemas = {
    addSchema,
    updateFavoriteSchema,
}

module.exports = {
    Contact,
    schemas,
};

