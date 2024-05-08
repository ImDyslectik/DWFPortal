const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    voornaam: {
        type: String,
        required: true,
    },
    achternaam: {
        type: String,
        required: true,
    },
    organisatie: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    telefoonnummer: {
        type: String,
        unique: true,
    }
});

const ContactModel = mongoose.model('Contact', contactSchema);

module.exports = ContactModel;