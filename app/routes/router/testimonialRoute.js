const express = require('express');
const router = express();
const upload = require('../../service/multer');

const testimonialController = require("../../controllers/testimonialController");
const { authenticate } = require("../../helper/authToken");

router.post('/addTestimonial', authenticate, upload.single('img'), testimonialController.addTestimonial);

router.get('/viewTestimonial', authenticate, testimonialController.viewTestimonial);

router.put('/editTestimonial/:id', authenticate, upload.single('img'), testimonialController.editTestimonial);

router.delete('/deleteTestimonial/:id', authenticate, testimonialController.deleteTestimonial);

router.delete('/deleteAllTestimonial', authenticate, testimonialController.deleteAllTestimonial);

router.delete('/multiDeleteTestimonial', authenticate, testimonialController.multiDeleteTestimonial);

module.exports = router;