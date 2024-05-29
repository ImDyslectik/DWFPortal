const nodemailer = require('nodemailer');
const path = require('path')
const DataModel = require('../DataSchematics/UserSchematic');
const {decryptText} = require("./Validation/RSAEncryption");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const getInactiveProjects = require('./FetchInactive');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAILSERVICE_USERNAME,
        pass: process.env.EMAILSERVICE_PASSWORD,
    }
});

async function sendEmailsToUsers() {

    const users = await DataModel.find();
    const inactiveProjects = await getInactiveProjects();

    for (const user of users) {
        const userProjects = inactiveProjects.filter(project => project.dealOwnerEmail === user.email);
        // if (userProjects && userProjects.length > 0){
        //     console.log('gebruiker heeft projecten');
        //     break;
        // }
        // console.log('gebruiker heeft geen projecten');

        const emailContent = `
            Hey ${user.email}!,

            Er zijn nog wat dingetjes die al een paar dagen niet geupdate zijn.
            ${userProjects.map(project => `Projectnaam: ${project.name}`).join('\n')}
            
            Met vriendelijke groet,
            Deze webapp
        `;

        const mailOptions = {
            from: process.env.EMAILSERVICE_USERNAME,
            to: user.email,
            subject: 'Wekelijks reminder',
            text: emailContent
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Fout bij het verzenden van e-mail:', error);
            } else {
                console.log('Succesvol verzonden:', info.response);
            }
        });
    }
}

module.exports = sendEmailsToUsers;