// login.js
const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.render(path.join(__dirname, '../Frontend/EJS/login.ejs'));
});

router.post('/', (req, res) => {
    const username = req.body.username;

    // TODO: Voeg authenticatie voor gebruikersnaam en wachtwoord toe
    if (username !== 'test') {
        req.session.username = username;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;