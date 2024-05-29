const mongoose = require('mongoose');
const Project = require('../DataSchematics/ProjectSchematic');
const path = require("path");

async function getInactiveProjects() {
    const time = new Date(Date.now() - 5*24*60*60*1000);

    const inactiveProjects = await Project.find({ updatedAt: { $lt: time }});

    return inactiveProjects;
}

module.exports = getInactiveProjects;