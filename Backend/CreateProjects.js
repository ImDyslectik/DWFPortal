const mongoose = require('mongoose');
const Project = require('../DataSchematics/ProjectSchematic');
const Deal = require('../DataSchematics/DealSchematic');
const FirstReview = require('../DataSchematics/FirstReviewSchematic');
const SecondReview = require('../DataSchematics/SecondReviewSchematic');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

//TODO have .env recognized
mongoose.connect('mongodb://localhost:27017/databasename');

Deal.findOne({ dealId: '5428045787' })
    .then(deal => {
        return FirstReview.findOne({/* uw zoekcriteria */})
            .then(firstReview => {
                return SecondReview.findOne({/* uw zoekcriteria */}) // voeg uw zoekcriteria hier toe
                    .then(secondReview => {
                        const projectData = {
                            name: deal.dealname,
                            description: firstReview.typeActiviteit,
                            problem: firstReview.vraagstuk,
                            company: firstReview.bedrijfsnaam,
                            stage: deal.dealstage,
                        };

                        return Project.findOneAndUpdate({ name: projectData.name }, projectData, {
                            upsert: true,
                            new: true,
                            runValidators: true
                        });
                    });
            });
    })
    .then(savedProject => {
        console.log('Successfully created or updated a project:', savedProject);
    })
    .catch(error => {
        console.error('Error while creating or updating a project:', error);
    });