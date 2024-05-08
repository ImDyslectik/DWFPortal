const HandleData = require('../Validation/HandelLogin');
const checkAuth = require('../Validation/CheckAuth');
const DataModel = require('../../DataSchematics/UserSchematic');
const { getHubspotConnection } = require('../APIConnection');
const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/', checkAuth, (req, res) => {
    res.render(path.join(__dirname, '../../Frontend/EJS/homepage.ejs'), {isAdmin:false});
});


router.get('/code', (req, res) => {
    getHubspotConnection(req);
    res.redirect('/');
});


router.post('/data', HandleData); // Roep de functie aan als route-handler


router.post('/data/delete', (req, res) => {
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

module.exports = router;