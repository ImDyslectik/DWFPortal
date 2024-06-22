const nodemailer = require('nodemailer');
const path = require('path')
const DataModel = require('../../DataSchematics/UserSchematic');
const {decryptText} = require("../Validation/HashEncryption");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const getInactiveProjects = require('./FetchInactiveProjects');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAILSERVICE_USERNAME,
        pass: process.env.EMAILSERVICE_PASSWORD,
    }
});

function generateProjectNotification(project) {
    if (project.stage === 'appointmentscheduled' || (project.stage === 'qualifiedtobuy' && project.obstakels.length === 0)) {
        return `${project.name} 0-lijst ontbreekt`
    } else if (project.obstakels.length !== 0 && project.vervolgstappen.length === 0) {
        return `${project.name} : 1-lijst ontbreekt`
    } else if (project.stage !== '112184788' && project.obstakels.length !== 0 && project.vervolgstappen.length !== 0) {
        return `${project.name} : Klaar om ingeleverd te worden`
    }
    return '';
}

async function sendEmailsToUsers() {

    const users = await DataModel.find();
    const inactiveProjects = await getInactiveProjects();

    for (const user of users) {
        const userProjects = inactiveProjects.filter(project => project.dealOwnerEmail === user.email);

        const projectNotifications = userProjects.map(generateProjectNotification);
        if (projectNotifications.length === 0) {
            continue;
        }

        const emailContent = `
        
Hey ${user.email}!,

Er zijn nog wat projecten die al een paar dagen niet geupdate zijn of klaar staan om voltooid te worden:

${projectNotifications.filter(note => note !== '').map((note, i) => `${i+1}. ${note}`).join('\n\n')}

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