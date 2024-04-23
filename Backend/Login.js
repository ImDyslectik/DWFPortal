const DataModel = require('../DataSchematics/UserSchematic');
const express = require('express');
const { decryptText } = require("./RSAEncryption");
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.render(path.join(__dirname, '../Frontend/EJS/login.ejs'));
});

router.post('/', (req, res) => {
    const { email, password } = req.body;

    DataModel.findOne({ email })
        .then((user) => {
            if (!user) {
                res.sendStatus(401);
            } else {
                decrypted = decryptText(user.password, user.privateKey)
                console.log(decrypted, password);
                if (decrypted === password) {
                    console.log("correct")
                    req.session.username = email;
                    res.redirect('/');
                } else {
                    console.log("fout")
                }
            }
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});

module.exports = router;