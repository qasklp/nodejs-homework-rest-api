const contacts = require('../models/contacts');
const Joi = require("joi");
const { HttpError } = require("../helpers");

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

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.status(200).json(result);
  }
  catch (error) {
    next(error);
  }
}

const getAllContacts =  async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  }
  catch(error) {
    next(error);
  }
}

const addContact = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  }
  catch (error) {
    next(error);
  }
}

const updateContact = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "missing fields");
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
}

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.json({"message": "contact deleted"});
  }
  catch (error) {
    next(error);
  }
}

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact
}