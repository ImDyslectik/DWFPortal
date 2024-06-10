const express = require('express');
const router = express.Router();
const Project = require('../../DataSchematics/ProjectSchematic');

router.post('/update-project', async (req, res) => {
    try {
        const { id, stage } = req.body;

        const project = await Project.findById(id);
        if (!project) {
            res.status(404).send({ message: 'No project with given ID found' });
            return;
        }
        project.stage = stage;
        const savedProject = await project.save();
        res.status(200).send(savedProject);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: `Error updating project: ${err.message}` });
    }
});

module.exports = router;