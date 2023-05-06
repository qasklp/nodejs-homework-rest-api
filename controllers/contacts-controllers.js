const contacts = require('../models/contacts');
const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../utils");

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.status(200).json(result);
}

const getAllContacts =  async (req, res) => {
    const result = await contacts.listContacts();
    res.json(result);
}

const addContact = async (req, res) => {
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
}

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.json(result);
}

const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.json({"message": "contact deleted"});
}

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  deleteContact: ctrlWrapper(deleteContact)
}