const express = require('express');
const DataModel = require('../../DataSchematics/UserSchematic');
const checkAuth = require('../Validation/CheckAuth');
const path = require("path");
const router = express.Router();


router.post('/delete', (req, res) => {
    const { email } = req.body;

    DataModel.findOneAndDelete({ email })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
});


router.get('/', checkAuth, (req, res) => {
    DataModel.find()
        .then((data) => {
            res.render(path.join(__dirname, '../../Frontend/EJS/admin.ejs'), { isAdmin: false, data });
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
});

module.exports = router;