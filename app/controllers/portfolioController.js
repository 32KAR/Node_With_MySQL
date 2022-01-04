const logger = require('../service/logging');
const db = require('../dbConnection/mySqlConnection');
const { portfolioValidation, multipleDeleteValidation } = require('../validation/portfolioValidation');

exports.addPortfolio = async (req, res) => {
    try {
        let { error } = portfolioValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const category = req.body.proj_category;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    db.query(`SELECT * FROM categories WHERE categoryName = ?`, [category], (err, result) => {
                        if (result) {
                            const mulImg = req.files.map((mulImg) => mulImg.filename);
                            const proj_category = result[0].id;
                            const proj_name = req.body.proj_name;
                            const proj_title = req.body.proj_title;
                            const proj_image = mulImg;
                            const proj_date = req.body.proj_date;
                            const proj_desc = req.body.proj_desc;

                            const sql = `INSERT INTO portfolio (proj_category, proj_name, proj_title, proj_image,proj_date,proj_desc) VALUES('${proj_category}', '${proj_name}', '${proj_title}', '${proj_image}', '${proj_date}', '${proj_desc}')`;
                            db.query(sql, (err, response1) => {
                                if (response1) {
                                    res.send("Data inserted...");
                                } else {
                                    res.send("Data not inserted!");
                                }
                            })
                        } else {
                            res.send("Category Data not found!");
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
};

exports.viewPortfolio = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`SELECT portfolio.id,categories.categoryName,portfolio.proj_name,portfolio.proj_title,portfolio.proj_image,portfolio.proj_date,portfolio.proj_desc FROM portfolio INNER JOIN categories ON categories.id = portfolio.proj_category`, async (err, response1) => {
                    if (response1) {
                        res.send(response1);
                    } else {
                        res.send('Portfolio Not found!');
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

exports.editPortfolio = async (req, res) => {
    try {
        let { error } = portfolioValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const id = req.params.id;
            const category = req.body.proj_category;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    db.query(`SELECT * FROM categories WHERE categoryName = ?`, [category], (err, result) => {
                        if (result) {
                            const mulImg = req.files.map((mulImg) => mulImg.filename);
                            const proj_category = result[0].id;
                            const proj_name = req.body.proj_name;
                            const proj_title = req.body.proj_title;
                            const proj_image = mulImg;
                            const proj_date = req.body.proj_date;
                            const proj_desc = req.body.proj_desc;

                            db.query(`UPDATE portfolio set proj_category = '${proj_category}', proj_name = '${proj_name}', proj_title = '${proj_title}', proj_image = '${proj_image}', proj_date = '${proj_date}', proj_desc= '${proj_desc}' WHERE id = ?`, [id], (err, response1) => {
                                if (result) {
                                    res.send("Portfolio updated...");
                                } else {
                                    res.send("Portfolio not updated!");
                                }
                            })
                        } else {
                            res.send("Category Data not found!");
                        }
                    })
                } else {
                    res.send("Email not found!");
                }
            })
        }
    }
    catch (err) {
        logger.error("err", err);
        res.send(err);
    }
};

exports.deletePortfolio = async (req, res) => {
    try {
        const email = req.user.email;
        const id = req.params.id;
        db.query(`SELECT * FROM registration WHERE email = ? `, [email], async (err, response) => {
            if (response) {
                db.query(`DELETE FROM portfolio WHERE id = ? `, [id], (err, response1) => {
                    if (response1) {
                        res.send("Portfolio Deleted...");
                    } else {
                        res.send('Portfolio Not Deleted!');
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

exports.deleteAllPortfolio = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`DELETE FROM portfolio`, (err, response1) => {
                    if (response1) {
                        res.send("All Portfolio Deleted...");
                    } else {
                        res.send('All Portfolio Not Deleted!');
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

exports.multiDeletePortfolio = async (req, res) => {
    try {
        let { error } = multipleDeleteValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const ids = req.body.ids;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    db.query("DELETE FROM portfolio WHERE id IN ('" + ids.join("','") + "') ", (err, response1) => {
                        if (response1) {
                            res.send("Selected Portfolio Deleted...");
                        } else {
                            res.send('Selected Portfolio Not Deleted!');
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
