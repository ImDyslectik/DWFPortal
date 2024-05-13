const mongoose = require('mongoose');

const firstReviewSchema = new mongoose.Schema({
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
    begincijfer: {
        type: Number,
        required: true,
    },
})

const FirstReviewSchema = mongoose.model('FirstReview', firstReviewSchema);

module.exports = FirstReviewSchema;