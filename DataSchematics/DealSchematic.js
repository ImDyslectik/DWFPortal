const mongoose = require('mongoose');
const { Schema } = mongoose;

const dealSchema = new Schema({
    dealId: String,
    amount: Number,
    closedate: Date,
    createdate: Date,
    dealname: String,
    dealstage: String,
    hs_lastmodifieddate: Date,
    pipeline: String,
    ownerName: String,
    companyName: String,
    archived: Boolean
});

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;