const sessionMiddleware = require('./session');
const session = require('express-session');
const checkAuth = require('./Validation/CheckAuth');
const agendaRouter = require('./Routes/Agenda');
const homepageRouter = require('./Routes/Home');
const adminRouter = require('./Routes/Admin');
const loginRouter = require('./Routes/Login');


const express = require('express');
const db = require('./ConnectDB');
require('dotenv').config();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, '../Frontend/public')));
app.use(express.urlencoded({ extended: true }));
app.use('/agenda', agendaRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/', homepageRouter);


app.set('views', path.join(__dirname, '../../Frontend/EJS'));
app.set('view engine', 'ejs');
app.listen(PORT, function (error) {
    if (error) throw error
    console.log("Server created Successfully on PORT", PORT)
})