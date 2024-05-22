const sessionMiddleware = require('./session');
const session = require('express-session');
const checkAuth = require('./Validation/CheckAuth');
const agendaRouter = require('./Routes/Agenda');
const homepageRouter = require('./Routes/Home');
const adminRouter = require('./Routes/Admin');
const loginRouter = require('./Routes/Login');
const uploadRouter = require('./Routes/Upload');
const User = require('../DataSchematics/UserSchematic');

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
app.use('/', uploadRouter);


//wild card voor error catching als gebruikers een pagina laden die niet beschikbaar is
app.use((req, res, next) => {
    res.status(500);
    res.send(`
        <html>
            <head>
                <meta http-equiv="refresh" content="3;url=/" />
            </head>
            <body>
                <img src="https://http.cat/404"/>
            </body>
        </html>
    `);
});

//TODO put this inside a seperate function / file
app.get('/search-users', async (req, res) => {
    const searchTerm = req.query.term;
    const users = await User.find({ email: new RegExp(searchTerm, 'i') }); // MongoDB query die email veld vergelijkt met zoekterm
    res.json(users.map(user => user.email));
});


app.set('views', path.join(__dirname, '../../Frontend/EJS'));
app.set('view engine', 'ejs');
app.listen(PORT, function (error) {
    if (error) throw error
    console.log("Server created Successfully on PORT", PORT)
})