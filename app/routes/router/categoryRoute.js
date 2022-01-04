const express = require('express');
const router = express();

const categoryController = require("../../controllers/categoryController");
const { authenticate } = require("../../helper/authToken");

router.post('/addCategory', authenticate, categoryController.addCategory);

router.get('/viewCategory', authenticate, categoryController.viewCategory);

router.put('/editCategory/:id', authenticate, categoryController.editCategory);

router.delete('/deleteCategory/:id', authenticate, categoryController.deleteCategory);

router.delete('/deleteAllCategory', authenticate, categoryController.deleteAllCategory);

router.delete('/multiDeleteCategory', authenticate, categoryController.multiDeleteCategory);

module.exports = router;