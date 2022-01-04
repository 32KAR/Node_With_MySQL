const jwt = require("jsonwebtoken");
const logger = require('../service/logging');

// Middeware for Generating a new JWT Token
const generateToken = (req, res, next) => {
    let token = jwt.sign({ email: req.body.email }, process.env.PRIVATE_KEY);
    res.cookie("jwt", token);
    next();
};

//authenticate
const authenticate = (req, res, next) => {

    try {
        const token = req.cookies.jwt;
        if (token == undefined) {
            res.redirect('/');
        }

        const verifyUser = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user = verifyUser;
        next();
    } catch (error) {
        logger.info(error);
    }
}

module.exports = {
    authenticate,
    generateToken
};