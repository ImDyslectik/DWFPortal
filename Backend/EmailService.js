const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const path = require('path')
const DataModel = require('../../DataSchematics/UserSchematic');
const {decryptText} = require("./Validation/RSAEncryption");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAILSERVICE_USERNAME,
        pass: process.env.EMAILSERVICE_PASSWORD,
    }
});

// DataModel.findOne({ email })
//     .then((user) => {
//         if (!user) {
//             res.sendStatus(401);
//         }
//         decrypted = decryptText(user.password, user.privateKey)
//         if (decrypted === password) {
//             req.session.username = email;
//             res.redirect('/');
//         } else {
//             res.redirect('/login');
//         }
//
//     })
//     .catch((err) => {
//         console.error(err);
//         res.sendStatus(500);
//     });

const emailContent = `
  Hey!,

  Er staan nog wat dingetjes open die ingevult moeten worden.
  Project A: nog geen enquete verstuurd
  Project B: project al een maand geen vooruitgang

  Met vriendelijke groet,
  Deze webapp
`;


const userEmail = process.env.EMAILSERVICE_TESTER;

const mailOptions = {
    from: 'Lobster <noreply.lobster@gmail.com>',
    replyTo: 'noreply.lobster@gmail.com',
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

//TODO only use full for implementation and testing if the mails actually get send no need to add it during development

// const job = schedule.scheduleJob('*/1 * * * *', function() {
// const job = schedule.scheduleJob('0 9 * * 5', function () {
//     const userEmail = 'robin10alkema@gmail.com';
//
//     const mailOptions = {
//         from: process.env.EMAILSERVICE_USERNAME,
//         to: userEmail,
//         subject: 'Wekelijks meldingen',
//         text: emailContent
//     };
//
//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.error('Fout bij het verzenden van e-mail:', error);
//         } else {
//             console.log('E-mail succesvol verzonden:', info.response);
//         }
//     });
// });