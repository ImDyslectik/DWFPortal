const express = require('express');
const session = require('express-session');
const loginRouter = require('./Login');

const app = express();
const path = require('path');
const PORT = 3000;

const checkAuth = (req, res, next) => {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/login');
    }
};

const generateSecret = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let secret = '';
    for (let i = 0; i < 32; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        secret += characters[randomIndex];
    }
    return secret;
};

app.use(session({
    secret: generateSecret(),
    resave: false,
    saveUninitialized: true
}));

app.set('views', path.join(__dirname, '../Frontend/EJS'));
app.set('view engine', 'ejs');

// Stel de 'public' directory in voor statische bestanden, inclusief CSS
app.use(express.static(path.join(__dirname, 'Frontend/public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', checkAuth, (req, res) => {
    res.render('index', { username: req.session.username });
});

app.get('/home.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/home.css'));
});

app.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/login.css'));
});

app.use('/login', loginRouter);

app.listen(PORT, () => {
    console.log(`Server gestart op poort ${PORT}`);
});