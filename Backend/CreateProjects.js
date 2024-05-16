const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Deal = require('../DataSchematics/DealSchematic');
const FirstReview = require('../DataSchematics/FirstReviewSchematic');
const SecondReview = require('../DataSchematics/SecondReviewSchematic');
const Project = require('../DataSchematics/ProjectSchematic');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

mongoose.connect('mongodb://localhost:27017/databasename');

// ...
const createOrUpdateProject = async () => {
    try {
        const deals = await Deal.find();

        const groupedByCompany = {};

        for (let deal of deals) {
            const companyName = deal.bedrijfsnaam;
            let firstReview = await FirstReview.findOne({ bedrijfsnaam: companyName });

            // Controleer of firstReview bestaat voor deze deal
            if (!firstReview) {
                console.log(`Bij bedrijfsnaam ${companyName} is geen bijpassende FirstReview gevonden.`);
                continue;  // Ga verder naar de volgende 'deal'
            }

            let projectData = {
                name: deal.dealname,
                description: firstReview.typeActiviteit,
                problem: firstReview.vraagstuk,
                company: companyName,
                stage: deal.dealstage,
            };

            let secondReview = await SecondReview.findOne({ bedrijfsnaam: companyName });
            if (secondReview) {
                // Voeg hier eventueel gegevens uit secondReview toe aan projectData
            }

            const savedProject = await Project.findOneAndUpdate({ name: projectData.name }, projectData,
                {
                    upsert: true,
                    new: true,
                    runValidators: true
                }
            );

            console.log('Successfully created or updated a project:', savedProject);
        }
    } catch (error) {
        console.error('Error while creating or updating a project:', error);
    }
};

createOrUpdateProject();