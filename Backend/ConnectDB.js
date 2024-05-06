// const mongoose = require('mongoose');

//
// const connectDB = async () => {
//     try {
//         await mongoose.connect((process.env.DATABASE_URI), {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log('MongoDB verbonden!');
//     } catch (error) {
//         console.error('Fout bij het verbinden met MongoDB:', error.message);
//         process.exit(1);
//     }
// };
//
// module.exports = connectDB;

const mongoose = require('mongoose');
require('dotenv').config();

// Verbind met de MongoDB-database
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectDB = mongoose.connection;


module.exports = connectDB;