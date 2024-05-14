const checkAuth = require('../Validation/CheckAuth');
const HandleData = require('../Validation/HandelLogin');
//const { getHubspotConnection } = require('../APIConnection');
const uploadRouter = require('../FileAbstract');
const express = require('express');
const path = require('path');
const router = express.Router();

const Project = require('../../DataSchematics/ProjectSchematic');


router.use('/upload', uploadRouter);
router.post('/data', HandleData);


router.get('/', async (req, res) => {
    if (req.session && req.session.username) {
        let userEmail = req.session.username;
        const projects = await Project.find();
        res.render(path.join(__dirname, '../../Frontend/EJS/homepage.ejs'), { email: userEmail, isAdmin: false, projects });
    } else {
        res.redirect('/login');
    }
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