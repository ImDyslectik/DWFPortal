const checkAuth = require('../Validation/CheckAuth');
const HandleData = require('../Validation/HandelLogin');
//const { getHubspotConnection } = require('../APIConnection');
const uploadRouter = require('../FileAbstract');
const express = require('express');
const path = require('path');
const router = express.Router();

const Project = require('../../DataSchematics/ProjectSchematic');
const projectRouter = require("../AddProject");
const cards = require("./UpdateCards");

router.use('/', projectRouter);
router.use('/', uploadRouter);
router.use('/', cards);

router.use('/upload', uploadRouter);
router.post('/data', HandleData);


router.get('/', checkAuth, async (req, res) => {
    let userEmail = req.session.username;
    const projects = await Project.find({ dealOwnerEmail: userEmail });
    res.render(path.join(__dirname, '../../Frontend/EJS/homepage.ejs'),
        { email: userEmail, isAdmin: false, projects });
});


router.get('/code', (req, res) => {
    getHubspotConnection(req);
    res.redirect('/');
});


module.exports = router;