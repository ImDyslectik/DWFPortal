const mongoose = require('mongoose');
const Project = require('../DataSchematics/ProjectSchematic');
const Deal = require('../DataSchematics/DealSchematic');
const FirstReview = require('../DataSchematics/FirstReviewSchematic');
const SecondReview = require('../DataSchematics/SecondReviewSchematic');
require('dotenv').config();

//TODO fix this to the actual name using the .env file
mongoose.connect('mongodb://localhost:27017/databasename');



Deal.findOne({ dealId: '5432506596' })
    .then(deal => {
        return FirstReview.findOne({/* uw zoekcriteria */})
            .then(firstReview => {
                return SecondReview.findOne({/* uw zoekcriteria */}) // voeg uw zoekcriteria hier toe
                    .then(secondReview => {
                        const project = new Project({
                            name: deal.dealname,
                            description: firstReview.typeActiviteit,
                            problem: firstReview.vraagstuk,
                            company: firstReview.bedrijfsnaam,
                            stage: deal.dealstage,

                            // nameContactPerson: "Niet ingevuld",
                            // emailContact: firstReview.emailContactpersoon,

                            // deal: deal._id,
                            // firstReview: firstReview._id,
                            // secondReview: [secondReview._id]
                        });

                        return project.save();
                    });
            });
    })
    .then(savedProject => {
        console.log('Successfully created a project:', savedProject);
    })
    .catch(error => {
        console.error('Error while creating a project:', error);
    });