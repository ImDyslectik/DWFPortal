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
    stage: String,

    deal: {
        type: Schema.Types.ObjectId,
        ref: 'Deal'
    },

    firstReview: {
        type: Schema.Types.ObjectId,
        ref: 'FirstReview'
    },

    secondReview: [{
        type: Schema.Types.ObjectId,
        ref: 'SecondReview'
    }],
});

module.exports = mongoose.model('Project', projectSchema);