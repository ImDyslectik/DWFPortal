const express = require('express');
const router = express.Router();
const Project = require('../../DataSchematics/ProjectSchematic');

router.post('/addProject', (req, res) => {
    let projectData = new Project({
        name: req.body.name,
        companyEmail: req.body.companyEmail,
        dealOwnerEmail: req.body.dealOwnerEmail,
        stage: req.body.stage,
        time: req.body.time,
    });
    projectData.save()
        .then(item => {
            res.status(200).send({'Successfully added': true});
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

module.exports = router;