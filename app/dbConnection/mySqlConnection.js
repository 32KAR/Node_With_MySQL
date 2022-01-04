const mysql = require('mysql');
//Create connection with MySql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node-with-mysql'
});

db.connect((err) => {
    if (err)
        throw err;
    else
        console.log('mySql Connected...');
})

module.exports = db;