const express = require('express');
const DataModel = require('../../DataSchematics/UserSchematic');
const checkAuth = require('../Validation/CheckAuth');
const router = express.Router();
const { generateKeyPair, encryptText, decryptText } = require('../Validation/RSAEncryption');


router.post('/delete', (req, res) => {
    const { email } = req.body;

    DataModel.findOneAndDelete({ email })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
});


router.get('/', checkAuth, (req, res) => {
    DataModel.find()
        .then((data) => {
            res.render('admin', { isAdmin:true, data });
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
});

module.exports = router;