const express = require('express');
const UserModel = require('../../DataSchematics/UserSchematic');
const checkAuth = require('../Validation/CheckAuth');
const router = express.Router();
const { generateKeyPair, encryptText, decryptText } = require('../Validation/RSAEncryption');


router.get('/', checkAuth, (req, res) => {
    UserModel.find()
        .then((data) => {
            res.render('admin', { isAdmin:true, data });
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
});

module.exports = router;