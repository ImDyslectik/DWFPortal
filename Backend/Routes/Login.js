const DataModel = require('../../DataSchematics/UserSchematic');
const express = require('express');
const { decryptText } = require("../Validation/RSAEncryption");
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.render(path.join(__dirname, '../../Frontend/EJS/login.ejs'));
});

router.post('/', (req, res) => {
    const { email, password } = req.body;

    DataModel.findOne({ email })
        .then((user) => {
            if (!user) {
                res.sendStatus(401);
            }
            decrypted = decryptText(user.password, user.privateKey)
            if (decrypted === password) {
                req.session.username = email;
                res.redirect('/');
            } else {
                res.redirect('/login');
            }

        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

module.exports = router;