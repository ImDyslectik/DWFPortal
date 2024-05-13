const mongoose = require('mongoose');

const firstReviewSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    begintijd: {
        type: String,
        required: true,
    },
    voltooitijd: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    naam: {
        type: String,
    },
    bedrijfsnaam: {
        type: String,
    },
    kvkNummer: {
        type: String,
    },
    woonplaats: {
        type: String,
    },
    sector: {
        type: String,
    },
    aantalMedewerkers: {
        type: String,
    },
    contactpersoon: {
        type: String,
    },
    emailContactpersoon: {
        type: String,
    },
    typeActiviteit: {
        type: String,
    },
    inAanraking: {
        type: String,
    },
    aanleiding: {
        type: String,
    },
    hoeDicht: {
        type: Number,
    },
    obstakels: {
        type: String,
    },
    hooptU: {
        type: String,
    },
    vraagstuk: {
        type: String,
    }
});

const FirstReviewSchema = mongoose.model('FirstReview', firstReviewSchema);

module.exports = FirstReviewSchema;