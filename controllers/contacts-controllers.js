const { Contact } = require('../models/contact');

const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../utils");

const getContactById = async (req, res) => {
    const { contactId } = req.params;
  const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.status(200).json(result);
}

const getAllContacts =  async (req, res) => {
    const result = await Contact.find();
    res.json(result);
}

const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
}

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.json(result);
}

const updateFavorite = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw HttpError(404,"Not found");
    }
    res.json(result);
}

const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.removeContact(contactId);
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
  updateFavorite: ctrlWrapper(updateFavorite),
  deleteContact: ctrlWrapper(deleteContact)
}