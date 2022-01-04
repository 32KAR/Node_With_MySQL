const express = require('express');
const app = express();

require('dotenv').config();

const cookieParser = require('cookie-parser');

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));

app.use(cookieParser());

app.use('/', require('./app/routes/route'));

app.use(express.static('app/uploads'));

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
