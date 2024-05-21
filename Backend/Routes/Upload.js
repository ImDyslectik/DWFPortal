const express = require('express');
const router = express.Router();
const upload = require('../FileUpload');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Project = require('../../DataSchematics/ProjectSchematic');

router.post('/uploadexcel', upload.single('firstReviewFile'), function(req, res) {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const firstRowData = data[0];

    const mappedData = {
        company: firstRowData['Bedrijfsnaam'],
        problem: firstRowData['Wat was de aanleiding om de werkplaats te betrekken in jouw vraagstuk?\r\n'],
        description: firstRowData['Met welk vraagstuk ga je aan de slag?'],
        nameContactPerson: firstRowData['Naam contactpersoon\r\n'],
    };

    if (mongoose.Types.ObjectId.isValid(req.body.projectId)) {
        Project.findByIdAndUpdate(req.body.projectId, mappedData, { new: true })
            .then(project => {
                res.redirect('/');
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('An error occurred while updating the project.');
            });
    } else {
        res.status(400).send('Invalid Project ID');
    }
});

module.exports = router;