const sessionMiddleware = require('./Validation/Session');
const session = require('express-session');
const checkAuth = require('./Validation/CheckAuth');
const agendaRouter = require('./Pages/Agenda');
const homepageRouter = require('./Pages/Home');
const adminRouter = require('./Pages/Admin');
const loginRouter = require('./Pages/Login');
const uploadRouter = require('./EndPoints/ImportCSV');
const User = require('../DataSchematics/UserSchematic');
const test = require('../DataSchematics/ExportSchematic')

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URI);
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

if (process.env.USEE_MAIL_SERVICE === 'true') {
    refresh = require('./Schedules/Scheduler');
}

const exportCSV = require('./EndPoints/ExportCSV');  // Pas dit pad aan naar het pad van de exportCSV-module

app.get('/save', exportCSV);  // Voeg de route toe



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


//TODO put this inside a seperate function / file
app.get('/search-users', async (req, res) => {
    const searchTerm = req.query.term;
    const users = await User.find({ email: new RegExp(searchTerm, 'i') }); // MongoDB query die email veld vergelijkt met zoekterm
    res.json(users.map(user => user.email));
});


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


app.set('views', path.join(__dirname, '../../Frontend/EJS'));
app.set('view engine', 'ejs');
app.listen(PORT, function (error) {
    if (error) throw error
    console.log("Server created Successfully on PORT", PORT)
})