const express = require('express');
const session = require('express-session');
const loginRouter = require('./Login');
const db = require('./ConnectDB');
const DataModel = require('../DataSchematics/UserSchematic');
const { generateKeyPair, encryptText, decryptText } = require('./RSAEncryption');

const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;

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

app.use(express.static(path.join(__dirname, 'Frontend/public')));
app.use(express.urlencoded({ extended: true }));

app.use('/login', loginRouter);

app.get('/', checkAuth, (req, res) => {
    DataModel.find()
        .then((data) => {
            res.render('index', { data });
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.get('/home.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/home.css'));
});

app.get('/login.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/CSS/login.css'));
});

app.post('/data', (req, res) => {
    const { email, password } = req.body;

    const keyPair = generateKeyPair();
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    const encryptedPassword = encryptText(password, publicKey);
    const decryptedPassword = decryptText(encryptedPassword, privateKey);
    console.log(decryptedPassword);
    const newData = new DataModel({
        email,
        password: encryptedPassword,
        role: 'user',
        publicKey,
        privateKey,
    });

    newData.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

app.listen(PORT, () => {
    console.log(`Server gestart op poort ${PORT}`);
});