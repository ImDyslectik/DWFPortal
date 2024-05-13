const mongoose = require('mongoose');

const secondReviewSchema = new mongoose.Schema({
    digitalisering: {
        type: Number,
        required: true,
    },
    ervaring: {
        type: Number,
        required: true,
    },
    sector: {
        type: String,
        required: true,
    },
    eindcijfer: {
        type: Number,
        required: true,
    }
})

const SecondReviewSchema = mongoose.model('SecondReview', secondReviewSchema);

module.exports = SecondReviewSchema;