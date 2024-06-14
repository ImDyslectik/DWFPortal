const checkAuth = require('../Validation/CheckAuth');
const HandleData = require('../Validation/HandelLogin');
//const { getHubspotConnection } = require('../APIConnection');
const uploadRouter = require('../EndPoints/ImportCSV');
const express = require('express');
const path = require('path');
const router = express.Router();

const Project = require('../../DataSchematics/ProjectSchematic');
const User = require('../../DataSchematics/UserSchematic')
const projectRouter = require("../EndPoints/AddProject");
const cards = require("../EndPoints/UpdateCards");
const updateOwnerRoute = require("../EndPoints/UpdateOwner");

router.use('/', projectRouter);
router.use('/', uploadRouter);
router.use('/', cards);
router.use('/', updateOwnerRoute)

router.use('/upload', uploadRouter);
router.post('/data', HandleData);

router.get('/', checkAuth, async (req, res) => {
    let userEmail = req.session.username;
    let currentRole = req.session.role;
    const projects = await Project.find();
    const personalProjects = await Project.find({ dealOwnerEmail: userEmail });

    const users = await User.find();

    var currentTime = new Date();

    res.render(path.join(__dirname, '../../Frontend/EJS/homepage.ejs'),
        { email: userEmail, role: currentRole,
            time: currentTime, projects, personalProjects, users
        });
});

module.exports = router;