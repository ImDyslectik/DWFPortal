const DataModel = require('../../DataSchematics/UserSchematic');
const express = require('express');
const { decryptText } = require("../Validation/RSAEncryption");
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.render(path.join(__dirname, '../../Frontend/EJS/login.ejs'));
});

//TODO wanneer gebruiker verkeerde gegevens invoert terugsturen naar /login

router.post('/', (req, res) => {
    const { email, password } = req.body;

    DataModel.findOne({ email })
        .then((user) => {
            if (!user || decryptText(user.password, user.privateKey) !== password) {
                res.redirect('/login');
            } else {
                req.session.username = email;
                req.session.role = user.role;
                req.session.save((err) => {
                    res.redirect('/');
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
});

module.exports = router;