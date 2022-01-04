const express = require('express');
const router = express();
const upload = require('../../service/multer');

const authController = require("../../controllers/authController");
const { generateToken, authenticate } = require("../../helper/authToken");

router.post("/loginUser", generateToken, authController.authUser);

router.post("/registration", upload.single('img'), authController.registration);

router.post('/verifyEmail', authController.verifyEmail);
router.post("/verifyOtp", authController.verifyOtp);
router.put("/updatePassword", authController.updatePassword);

router.get("/viewProfile", authenticate, authController.viewProfile);
router.put("/updateProfile", authenticate, upload.single('img'), authController.updateProfile);
router.put("/resetPass", authenticate, authController.resetPass);

module.exports = router;
