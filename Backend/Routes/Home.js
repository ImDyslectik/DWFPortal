const express = require('express');
const DataModel = require('../../DataSchematics/UserSchematic');
const checkAuth = require('../CheckAuth');
const path = require('path');
const router = express.Router();
const { generateKeyPair, encryptText, decryptText } = require('../RSAEncryption');

router.get('/', checkAuth, (req, res) => {
    res.render(path.join(__dirname, '../../Frontend/EJS/homepage.ejs'));
});


router.post('/data', (req, res) => {
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

module.exports = router;