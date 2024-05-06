const sessionMiddleware = require('./session');
const session = require('express-session');
const checkAuth = require('./checkAuth');
const DataModel = require('../DataSchematics/UserSchematic');

const agendaRouter = require('./Routes/Agenda');
const homepageRouter = require('./Routes/Home');
const adminRouter = require('./Routes/Admin');
const loginRouter = require('./Routes/Login');

const express = require('express');
const db = require('./ConnectDB');
require('dotenv').config();

const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'Frontend/public')));
app.use(express.urlencoded({ extended: true }));
app.use('/agenda', agendaRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/', homepageRouter);


app.set('views', path.join(__dirname, '../Frontend/EJS'));
app.set('view engine', 'ejs');


app.get('/admin.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/admin.css'));
});

app.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/login.css'));
});

app.get('/homepage.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/homepage.css'));
});

app.get('/agenda.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/agenda.css'));
});

app.listen(PORT, () => {
    console.log(`Server gestart op poort ${PORT}`);
});
