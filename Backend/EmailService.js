const nodemailer = require('nodemailer');
const path = require('path')
const DataModel = require('../DataSchematics/UserSchematic');
const {decryptText} = require("./Validation/RSAEncryption");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAILSERVICE_USERNAME,
        pass: process.env.EMAILSERVICE_PASSWORD,
    }
});

const emailContent = `
  Hey!,

  Er staan nog wat dingetjes open die ingevuld moeten worden.
  Project A: nog geen enquete verstuurd
  Project B: project al een maand geen vooruitgang

  Met vriendelijke groet,
  Deze webapp
`;

module.exports = function email() {
    const userEmail = process.env.EMAILSERVICE_TESTER;

    const mailOptions = {
        from: process.env.EMAILSERVICE_USERNAME,
        to: userEmail,
        subject: 'Wekelijks meldingen',
        text: emailContent
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Fout bij het verzenden van e-mail:', error);
        } else {
            console.log('E-mail succesvol verzonden:', info.response);
        }
    });
}