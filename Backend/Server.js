const sessionMiddleware = require('./session');
const session = require('express-session');
const checkAuth = require('./checkAuth');
const DataModel = require('../DataSchematics/UserSchematic');
const indexRouter = require('./Routes/Index');
const express = require('express');
const loginRouter = require('./Routes/Login');
const db = require('./ConnectDB');
require('dotenv').config();

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'Frontend/public')));
app.use(express.urlencoded({ extended: true }));
app.use('/login', loginRouter);
app.use('/', indexRouter);


app.set('views', path.join(__dirname, '../Frontend/EJS'));
app.set('view engine', 'ejs');


app.get('/home.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/home.css'));
});

app.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/login.css'));
});

app.listen(PORT, () => {
    console.log(`Server gestart op poort ${PORT}`);
});