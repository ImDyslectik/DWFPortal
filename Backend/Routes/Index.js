const express = require('express');
const UserModel = require('../../DataSchematics/UserSchematic');
const checkAuth = require('../CheckAuth');
const indexRouter = express.Router();
const { generateKeyPair, encryptText, decryptText } = require('../RSAEncryption');


indexRouter.get('/', checkAuth, (req, res) => {
    UserModel.find()
        .then((data) => {
            res.render('index', { data });
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
});

indexRouter.post('/data', (req, res) => {
    const { email, password } = req.body;

    const keyPair = generateKeyPair();
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    const encryptedPassword = encryptText(password, publicKey);
    const decryptedPassword = decryptText(encryptedPassword, privateKey);

    const newData = new UserModel({
        email,
        password: encryptedPassword,
        role: 'user',
        publicKey,
        privateKey,
    });

    newData.save()
        .then(() => {
            res.redirect(`https://http.cat/${200}`);
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
});

module.exports = indexRouter;