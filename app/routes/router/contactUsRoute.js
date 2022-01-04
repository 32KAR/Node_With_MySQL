const express = require('express');
const router = express();

const contactUsController = require("../../controllers/contactUsController");
const { authenticate } = require("../../helper/authToken");

router.post('/addContactUs', authenticate, contactUsController.addContactUs);

router.get('/viewContactUs', authenticate, contactUsController.viewContactUs);

router.put('/editContactUs/:id', authenticate, contactUsController.editContactUs);

router.delete('/deleteContactUs/:id', authenticate, contactUsController.deleteContactUs);

router.delete('/deleteAllContactUs', authenticate, contactUsController.deleteAllContactUs);

router.delete('/multiDeleteContactUs', authenticate, contactUsController.multiDeleteContactUs);

module.exports = router;