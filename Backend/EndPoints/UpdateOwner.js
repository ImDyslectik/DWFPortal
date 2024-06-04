const express = require('express');
const router = express.Router();
const Project = require('../../DataSchematics/ProjectSchematic');

router.put('/updateOwner', async (req, res) => {
    const { newOwner, ownerId } = req.body;

    if (!newOwner || !ownerId) {
        return res.status(400).json({ error: 'New owner email or id not provided' });
    }

    try {
        const updatedProject = await Project.findOneAndUpdate({ _id: ownerId }, { dealOwnerEmail: newOwner }, { new: true });

        if (!updatedProject) {
            return res.status(500).json({ error: 'Update failed, please try again' });
        }

        res.json({ message: 'Update successful' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating owner' });
    }
});

module.exports = router;