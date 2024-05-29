const mongoose = require('mongoose');
//
const secondReviewSchema = new mongoose.Schema({
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
        required: true,
    },
    kvkNummer: {
        type: String,
        required: true,
    },
    woonplaats: {
        type: String,
    },
    sector: {
        type: String,
    },
    aantalMedewerkers: {
        type: Number,
    },
    contactpersoon: {
        type: String,
    },
    emailContactpersoon: {
        type: String,
    },
    typeActiviteit: {
        type: String,
        required: true,
    },
    inzichtKansen: {
        type: String,
        required: true,
    },
    kostenHaalbaarheid: {
        type: String,
    },
    toegangTotData: {
        type: String,
    },
    toegangTotKennis: {
        type: String,
    },
    kennisVaardigheden: {
        type: String,
    },
    tevredenSamenwerking: {
        type: String,
    },
    adviesOpgeleverd: {
        type: String,
    },
    tevredenResultaat: {
        type: Number,
    },
    onverwachteResultaten: {
        type: String,
    },
    aanbevelingWerkplaats: {
        type: Number,
    },
    vervolgstappen: {
        type: String,
    },
    belemmeringen: {
        type: String,
    },
    verbeteringSuggesties: {
        type: String,
    },
    opmerkingen: {
        type: String,
    }
})

const SecondReviewSchema = mongoose.model('SecondReview', secondReviewSchema);

module.exports = SecondReviewSchema;