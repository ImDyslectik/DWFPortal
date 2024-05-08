const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI);

const connectDB = mongoose.connection;

module.exports = connectDB;