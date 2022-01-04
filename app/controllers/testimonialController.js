const logger = require('../service/logging');
const db = require('../dbConnection/mySqlConnection');
const { testimonialValidation, multipleDeleteValidation } = require('../validation/testimonialValidation');

exports.addTestimonial = async (req, res) => {
    try {
        let { error } = testimonialValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const testi_name = req.body.testi_name;
            const designation = req.body.designation;
            const testi_desc = req.body.testi_desc;
            const img = req.file.filename;

            const sql = `INSERT INTO testimonial (testi_name, designation, testi_desc, img) VALUES('${testi_name}', '${designation}', '${testi_desc}', '${img}')`;
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

exports.viewTestimonial = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`SELECT * FROM testimonial`, async (err, response1) => {
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

exports.editTestimonial = async (req, res) => {
    try {
        let { error } = testimonialValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const id = req.params.id;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    const testi_name = req.body.testi_name;
                    const designation = req.body.designation;
                    const testi_desc = req.body.testi_desc;
                    const img = req.file.filename;

                    db.query(`UPDATE testimonial set testi_name = '${testi_name}', designation = '${designation}', testi_desc = '${testi_desc}', img = '${img}' WHERE id = ?`, [id], (err, response1) => {
                        if (response1) {
                            res.send("Testimonial Updated...");
                        } else {
                            res.send('Testimonial Not Updated!');
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

exports.deleteTestimonial = async (req, res) => {
    try {
        const email = req.user.email;
        const id = req.params.id;
        db.query(`SELECT * FROM registration WHERE email = ? `, [email], async (err, response) => {
            if (response) {
                db.query(`DELETE FROM testimonial WHERE id = ? `, [id], (err, response1) => {
                    if (response1) {
                        res.send("Testimonial Deleted...");
                    } else {
                        res.send('Testimonial Not Deleted!');
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

exports.deleteAllTestimonial = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`DELETE FROM testimonial`, (err, response1) => {
                    if (response1) {
                        res.send("All Testimonial Deleted...");
                    } else {
                        res.send('All Testimonial Not Deleted!');
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

exports.multiDeleteTestimonial = async (req, res) => {
    try {
        let { error } = multipleDeleteValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const ids = req.body.ids;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    db.query("DELETE FROM testimonial WHERE id IN ('" + ids.join("','") + "') ", (err, response1) => {
                        if (response1) {
                            res.send("Selected Testimonial Deleted...");
                        } else {
                            res.send('Selected Testimonial Not Deleted!');
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
