const express = require('express');
const router = express();
const upload = require('../../service/multer');

const portfolioController = require("../../controllers/portfolioController");
const { authenticate } = require("../../helper/authToken");

router.post('/addPortfolio', authenticate, upload.array('proj_image', 5), portfolioController.addPortfolio);

router.get('/viewPortfolio', authenticate, portfolioController.viewPortfolio);

router.put('/editPortfolio/:id', authenticate, upload.array('proj_image', 5), portfolioController.editPortfolio);

router.delete('/deletePortfolio/:id', authenticate, portfolioController.deletePortfolio);

router.delete('/deleteAllPortfolio/', authenticate, portfolioController.deleteAllPortfolio);

router.delete('/multiDeletePortfolio/', authenticate, portfolioController.multiDeletePortfolio);

module.exports = router;