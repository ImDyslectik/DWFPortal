const mongoose = require('mongoose');
const Project = require('../../DataSchematics/ProjectSchematic');
const path = require("path");

async function getInactiveProjects() {
    const inactiveDays = parseInt(process.env.INACTIVE_DAYS);
    const time = new Date(Date.now() - inactiveDays*24*60*60*1000);

    const inactiveProjects = await Project.find({
        updatedAt: { $lt: time },
        stage: { $ne: '112184788' }
    });

    return inactiveProjects;
}

module.exports = getInactiveProjects;