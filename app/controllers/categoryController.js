const logger = require('../service/logging');
const db = require('../dbConnection/mySqlConnection');
const { categoryValidate, multipleDeleteValidation } = require('../validation/categoryValidation');

exports.addCategory = async (req, res) => {
    try {
        let { error } = categoryValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const categoryName = req.body.categoryName;

            const sql = `INSERT INTO categories(categoryName) VALUES('${categoryName}')`;
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

exports.viewCategory = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`SELECT * FROM categories`, async (err, response1) => {
                    if (response1) {
                        res.send(response1);
                    } else {
                        res.send('Categories Not found!');
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

exports.editCategory = async (req, res) => {
    try {
        let { error } = categoryValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const id = req.params.id;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    const categoryName = req.body.categoryName;
                    db.query(`UPDATE categories set categoryName = '${categoryName}' WHERE id = ?`, [id], (err, response1) => {
                        if (response1) {
                            res.send("Category Updated...");
                        } else {
                            res.send('Category Not Updated!');
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

exports.deleteCategory = async (req, res) => {
    try {
        const email = req.user.email;
        const id = req.params.id;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`DELETE FROM categories WHERE id = ? `, [id], (err, response1) => {
                    if (response1) {
                        res.send("Category Deleted...");
                    } else {
                        res.send('Category Not Deleted!');
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

exports.deleteAllCategory = async (req, res) => {
    try {
        const email = req.user.email;
        db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
            if (response) {
                db.query(`DELETE FROM categories`, (err, response1) => {
                    if (response1) {
                        res.send("All Category Deleted...");
                    } else {
                        res.send('All Category Not Deleted!');
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

exports.multiDeleteCategory = async (req, res) => {
    try {
        let { error } = multipleDeleteValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            const email = req.user.email;
            const ids = req.body.ids;
            db.query(`SELECT * FROM registration WHERE email = ?`, [email], async (err, response) => {
                if (response) {
                    db.query("DELETE FROM categories WHERE id IN ('" + ids.join("','") + "') ", (err, response1) => {
                        if (response1) {
                            res.send("Selected Category Deleted...");
                        } else {
                            res.send('Selected Category Not Deleted!');
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
