const checkAuth = require('../Validation/CheckAuth');
const HandleData = require('../Validation/HandelLogin');
//const { getHubspotConnection } = require('../APIConnection');
const uploadRouter = require('../Old/FileAbstract');
const express = require('express');
const path = require('path');
const router = express.Router();

const Project = require('../../DataSchematics/ProjectSchematic');
const projectRouter = require("../EndPoints/AddProject");
const cards = require("../EndPoints/UpdateCards");

router.use('/', projectRouter);
router.use('/', uploadRouter);
router.use('/', cards);

router.use('/upload', uploadRouter);
router.post('/data', HandleData);


router.get('/', checkAuth, async (req, res) => {
    let userEmail = req.session.username;
    let currentRole = req.session.role;
    const projects = await Project.find();
    const personalProjects = await Project.find({ dealOwnerEmail: userEmail });
    var currentTime = new Date();
    res.render(path.join(__dirname, '../../Frontend/EJS/homepage.ejs'),
        { email: userEmail, role: currentRole, time: currentTime, projects, personalProjects });
});


router.get('/code', (req, res) => {
    getHubspotConnection(req);
    res.redirect('/');
});


module.exports = router;