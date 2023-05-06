const express = require('express');

const cntrl = require("../../controllers/contacts-controllers")

const router = express.Router();

router.get('/', cntrl.getAllContacts )

router.get('/:contactId', cntrl.getContactById )

router.post('/', cntrl.addContact)

router.delete('/:contactId', cntrl.deleteContact)

router.put('/:contactId', cntrl.updateContact)

module.exports = router
