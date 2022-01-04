const logger = require('../service/logging');
const db = require('../dbConnection/mySqlConnection');
const { contactUsValidation, multipleDeleteValidation } = require('../validation/contactUsValidation');

exports.addContactUs = async (req, res) => {
    try {
        let { error } = contactUsValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const contact_name = req.body.contact_name;
            const contact_email = req.body.contact_email;
            const contact_no = req.body.contact_no;
            const message = req.body.message;
            const date = req.body.date;

            const sql = `INSERT INTO contactus (contact_name, contact_email, contact_no, message, date) VALUES('${contact_name}', '${contact_email}', '${contact_no}', '${message}', '${date}')`;
            db.query(sql, (err, result) => {
                if (result) {
                    res.send("Data inserted...");
                } else {
                    res.send("Data not inserted!");
                }
            })
        }
    }
    catch (err) {
        logger.error("err", err);
        res.send(err);
    }
};

exports.viewContactUs = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`SELECT * FROM contactus`, async (err, response1) => {
                    if (response1) {
                        res.send(response1);
                    } else {
                        res.send('Contact Not found!');
                    }
                });
            } else {
                res.send('Not valid email!');
            }
        });
    } catch (err) {
        logger.error("err", err);
        res.send(err);
    }
}

exports.editContactUs = async (req, res) => {
    try {
        let { error } = contactUsValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const id = req.params.id;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    const contact_name = req.body.contact_name;
                    const contact_email = req.body.contact_email;
                    const contact_no = req.body.contact_no;
                    const message = req.body.message;
                    const date = req.body.date;

                    db.query(`UPDATE contactus set contact_name = '${contact_name}', contact_email = '${contact_email}', contact_no = '${contact_no}', message = '${message}', date = '${date}' WHERE id = ?`, [id], (err, response1) => {
                        if (response1) {
                            res.send("Contact Updated...");
                        } else {
                            res.send('Contact Not Updated!');
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
        res.send(err);
    }
}

exports.deleteContactUs = async (req, res) => {
    try {
        const email = req.user.email;
        const id = req.params.id;
        db.query(`SELECT * FROM registration WHERE email = ? `, [email], async (err, response) => {
            if (response) {
                db.query(`DELETE FROM contactus WHERE id = ? `, [id], (err, response1) => {
                    console.log(err);
                    if (response1) {
                        res.send("Contact Deleted...");
                    } else {
                        res.send('Contact Not Deleted!');
                    }
                })
            } else {
                res.send('Not valid email!');
            }
        })
    }
    catch (err) {
        logger.error("err", err);
        res.send(err);
    }
}

exports.deleteAllContactUs = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`DELETE FROM contactus`, (err, response1) => {
                    if (response1) {
                        res.send("All Contact Deleted...");
                    } else {
                        res.send('All Contact Not Deleted!');
                    }
                })
            } else {
                res.send('Not valid email!');
            }
        })
    }
    catch (err) {
        logger.error("err", err);
        res.send(err);
    }
}

exports.multiDeleteContactUs = async (req, res) => {
    try {
        let { error } = multipleDeleteValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const ids = req.body.ids;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    db.query("DELETE FROM contactus WHERE id IN ('" + ids.join("','") + "') ", (err, response1) => {
                        if (response1) {
                            res.send("Selected Contact Deleted...");
                        } else {
                            res.send('Selected Contact Not Deleted!');
                        }
                    })
                } else {
                    res.send('Not valid email!');
                }
            })
        }
    }
    catch (err) {
        logger.error("err", err);
        res.send(err);
    }
}
