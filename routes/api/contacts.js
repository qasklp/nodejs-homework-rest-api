const express = require('express');

const ctrl = require("../../controllers/contacts-controllers");
const { validateBody } = require('../../utils');
const { schemas } = require('../../models/contact');
const { isValidId, authenticate } = require("../../midlewares");

const router = express.Router();

router.get('/', authenticate, ctrl.getAllContacts )

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById )

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addContact)

router.delete('/:contactId', authenticate, isValidId, ctrl.deleteContact)

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.updateContact)

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite)

module.exports = router
