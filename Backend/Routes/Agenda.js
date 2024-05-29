const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const FirstReview = require('../../DataSchematics/FirstReviewSchematic');
const SecondReview = require('../../DataSchematics/SecondReviewSchematic');
const Project = require('../../DataSchematics/ProjectSchematic');
const Deal = require('../Old/DealSchematic');

const router = express.Router();
const checkAuth = require('../Validation/CheckAuth');

router.get('/', checkAuth, async (req, res) => {
    let bedrijfsnamen = await FirstReview.distinct('bedrijfsnaam');
    res.render(path.join(__dirname, '../../Frontend/EJS/agenda.ejs'), {
        companies: bedrijfsnamen
    });
});

router.post('/api/newProject', checkAuth, async (req, res) => {
    try {
        const firstReview = await FirstReview.findOne({ bedrijfsnaam: req.body.companyName });
        const dealReview = await Deal.findOne({ companyName: req.body.companyName });

        if (!firstReview) {
            return res.status(404).send('FirstReview not found.');
        }

        if (!dealReview) {
            return res.status(404).send('Deal not found.');
        }

        let projectData = {
            name: req.body.projectName,
            description: firstReview.typeActiviteit,
            problem: firstReview.vraagstuk,
            company: req.body.companyName,
            stage: dealReview.dealstage,
            dealname: dealReview.dealname,
        };

        console.log(firstReview)
        console.log(dealReview);

        let secondReview = await SecondReview.findOne({ bedrijfsnaam: req.body.companyName });

        console.log(secondReview);

        if (secondReview) {
            // Voeg gegevens uit secondReview toe aan projectData
            projectData.tevredenResultaat = secondReview.tevredenResultaat;
            projectData.onverwachteResultaten = secondReview.onverwachteResultaten;
            projectData.aanbeveling = secondReview.aanbevelingWerkplaats;
            projectData.vervolgstappen = secondReview.vervolgstappen;
            projectData.belemmeringen = secondReview.belemmeringen;
            projectData.opmerkingen = secondReview.opmerkingen;
        }

        const savedProject = await Project.findOneAndUpdate({ name: projectData.name }, projectData,
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );

        res.redirect('/agenda')
    } catch (error) {
        res.status(500).send('Error while creating or updating a project:' + error);
    }
});

module.exports = router;