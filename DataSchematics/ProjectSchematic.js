const mongoose = require('mongoose');
const { Schema } = mongoose;
const FirstReview = require('../DataSchematics/FirstReviewSchematic');
const SecondReview = require('../DataSchematics/SecondReviewSchematic');
const Deal = require('../DataSchematics/DealSchematic');

const projectSchema = new Schema({
    name: String,
    description: String,
    problem: String,
    company: String,
    nameContactPerson: String,
    emailContact: String,
    stage: {
        type: String
    },
    dealname: {
        type: String
    },
    tevredenResultaat: {
        type: Number
    },
    onverwachteResultaten: {
        type: String
    },
    aanbevelingWerkplaats: {
        type: Number
    },
    vervolgstappen: {
        type: String
    },
    belemmeringen: {
        type: String
    },
    opmerkingen: {
        type: String
    }
});

module.exports = mongoose.model('Project', projectSchema);