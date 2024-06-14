require('dotenv').config();
const DataModel = require('../../DataSchematics/UserSchematic');
const express = require('express');
const { decryptText } = require("../Validation/RSAEncryption");
const path = require('path');
const router = express.Router();
const { generateKeyPair, encryptText } = require('../Validation/RSAEncryption');


async function setupInitialAdmin() {
    let adminEmail = process.env.ADMIN_EMAIL;
    let adminPassword = process.env.ADMIN_PASSWORD;
    let keys = generateKeyPair();
    let encryptedPassword = encryptText(adminPassword, keys.publicKey);

    let adminUser = await DataModel.findOne({ email: adminEmail });
    if (!adminUser) {
        await new DataModel({
            email: adminEmail,
            password: encryptedPassword,
            role: 'admin',
            publicKey: keys.publicKey,
            privateKey: keys.privateKey }).save();
    }
}

setupInitialAdmin();

router.get('/', (req, res) => {
    res.render(path.join(__dirname, '../../Frontend/EJS/login.ejs'));
});

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