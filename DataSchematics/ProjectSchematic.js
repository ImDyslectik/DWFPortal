const mongoose = require('mongoose');
const { Schema } = mongoose;


const projectSchema = new Schema({
    //Required manually filled in data
    name: { type: String, required: true },
    companyEmail: { type: String, required: true },
    dealOwnerEmail: { type: String, required: true },
    stage: { type: String, required: true },
    //first review will add the following
    company: { type: String },
    problem: { type: String },
    description: { type: String },
    nameContactPerson: { type: String },
    digitlisering: { type: Number },
    //second review will add the following
    tevredenResultaat: { type: Number },
    onverwachteResultaten: { type: String },
    aanbevelingWerkplaats: { type: Number },
    vervolgstappen: { type: String },
    belemmeringen: { type: String },
    opmerkingen: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);