const checkAuth = require('../Validation/CheckAuth');
const HandleData = require('../Validation/HandelLogin');
//const { getHubspotConnection } = require('../APIConnection');
const uploadRouter = require('../FileAbstract');
const express = require('express');
const path = require('path');
const router = express.Router();

router.use('/upload', uploadRouter);
router.post('/data', HandleData);


router.get('/', checkAuth, (req, res) => {
    res.render(path.join(__dirname, '../../Frontend/EJS/homepage.ejs'), { isAdmin: false });
});


router.get('/code', (req, res) => {
    getHubspotConnection(req);
    res.redirect('/');
});


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