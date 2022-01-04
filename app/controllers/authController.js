const bcrypt = require("bcrypt");
const logger = require('../service/logging');
const { OTPsend } = require("../service/otpSend");
const { registerValidate, loginValidate, passwordValidate, newPasswordValidate, profileValidate, resetPasswordValidate } = require('../validation/authValidation');
const db = require('../dbConnection/mySqlConnection');
const saltRounds = 10;
let otp = Math.floor(100000 + Math.random() * 900000);

exports.registration = async (req, res) => {
    try {
        let { error } = registerValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        else {
            const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
            const fname = req.body.fname;
            const lname = req.body.lname;
            const email = req.body.email;
            const password = encryptedPassword;
            const phone = req.body.phone;
            const img = req.file.filename;
            const country = req.body.country;
            const gender = req.body.gender;
            const hobbies = req.body.hobbies;

            const sql = `INSERT INTO registration(fname,lname,email,password,phone,img,country,gender,hobbies) VALUES('${fname}','${lname}','${email}','${password}','${phone}','${img}','${country}','${gender}','${hobbies}')`;

            db.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    res.send("Data Inserted...");
                }
            })

        }
    }
    catch (err) {
        logger.error("err", err);
    }
};

exports.authUser = async (req, res) => {
    try {
        let { error } = loginValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.body.email;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (err) {
                    logger.error(err);
                } else {
                    if (response.length > 0) {
                        const comparision = await bcrypt.compare(req.body.password, response[0].password);
                        if (comparision)
                            res.send('Login successfully...');
                        else
                            res.send('Password is not correct!');
                    } else {
                        res.send('Email is not correct!');
                    }
                }
            });
        }
    } catch (err) {
        logger.error("err", err);
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        let { error } = passwordValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.body.email;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (err) {
                    logger.error(err);
                } else {
                    if (response.length > 0) {
                        OTPsend(req.body.email, otp);
                        res.send('OTP sended...');
                    } else {
                        res.send('Please enter valid Email!');
                    }
                }
            });
        }
    } catch (err) {
        logger.error("err", err);

    }
};

exports.verifyOtp = async (req, res) => {
    try {
        if (otp == req.body.otp) {
            res.send('OTP Matched...');

        } else {
            return res.send("Please enter correct OTP!");
        }
    }
    catch (err) {
        logger.error("err", err);
    }
};

exports.updatePassword = async (req, res) => {
    try {
        let { error } = newPasswordValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.body.email;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
                    if (encryptedPassword) {
                        db.query(`UPDATE registration set password = ? WHERE email = ?`, [encryptedPassword, email]);
                        res.send('Password is set...');
                    }
                    else
                        res.send('Password is not set...');
                } else {
                    res.send('Email is not correct...');
                }
            });
        }
    }
    catch (err) {
        logger.error("err", err);
    }
};

exports.viewProfile = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                res.send(response);
            } else {
                res.send('Not valid email!');
            }
        });
    } catch (err) {
        logger.error("err", err);
    }
}

exports.updateProfile = async (req, res) => {
    try {
        let { error } = registerValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    const fname = req.body.fname;
                    const lname = req.body.lname;
                    const setEmail = req.body.email;
                    const phone = req.body.phone;
                    const img = req.file.filename;
                    const country = req.body.country;
                    const gender = req.body.gender;
                    const hobbies = req.body.hobbies;

                    db.query(`UPDATE registration set fname='${fname}', lname='${lname}' ,email='${setEmail}' ,phone='${phone}',img='${img}',country='${country}',gender='${gender}',hobbies='${hobbies}' WHERE email = ?`, [email], (err, response1) => {
                        console.log(response1);
                        if (response1) {
                            res.send("Data Updated...");
                        } else {
                            res.send('Data Not Updated!');
                        }
                    })
                } else {
                    res.send('Not valid email!');
                }
            });
        }
    }
    catch (err) {
        logger.error("err", err);
    }
};

exports.resetPass = async (req, res) => {
    try {
        let { error } = resetPasswordValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                console.log(response);
                if (response) {
                    const comparision = await bcrypt.compare(req.body.current_password, response[0].password);
                    if (comparision) {
                        const updatePassword = await bcrypt.hash(req.body.password, saltRounds);
                        db.query(`UPDATE registration set password='${updatePassword}'WHERE email = ?`, [email], (err, response1) => {
                            if (response1)
                                res.send("Your Password has been Reset...");
                            else
                                res.send("Your Password has not been Reset");
                        });
                    } else
                        res.send("Current Password is incorrect");
                } else
                    res.send("Not valid email!");
            });
        }
    }
    catch (err) {
        logger.error("err", err);
    }
};
