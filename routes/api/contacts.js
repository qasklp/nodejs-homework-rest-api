const express = require('express');

const ctrl = require("../../controllers/contacts-controllers");
const { validateBody } = require('../../utils');
const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', ctrl.getAllContacts )

router.get('/:contactId', ctrl.getContactById )

router.post('/', validateBody(schemas.addSchema), ctrl.addContact)

router.delete('/:contactId', ctrl.deleteContact)

router.put('/:contactId', validateBody(schemas.addSchema), ctrl.updateContact)

router.patch('/:contactId/favorite', validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite)

module.exports = router
