const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Int,
        required: true,
        unique: true,
    },
    kvkNumber: {
        type: Int,
        required: true,
        unique: true,
    },
    adress: {
        type: Int,
        required: true,
        unique: true,
    },
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;