const axios = require("axios");
const Contact = require("../DataSchematics/ContactSchematic2");
require('dotenv').config();
const apiHost = process.env.API_HOST;
const InputValidatorPattern = require("./Validation/InputValidationPattern");

async function getHubspotConnection(req) {
    try {
        const tokenResponse = await axios.post(`https://${apiHost}/oauth/v1/token`, {
            grant_type: 'authorization_code',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            code: req.query.code
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        const response = await axios.get(`https://${apiHost}/contacts/v1/lists/all/contacts/all`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log('Verbinding met HubSpot API is gelukt! :))) ');

        for (const contactData of response.data.contacts) {
            const { firstname, lastname, company } = contactData.properties;

            if (!InputValidatorPattern.validateNames(firstname.value)) {
                throw new Error('Ongeldige voornaam');
            }

            if (!InputValidatorPattern.validateNames(lastname.value)) {
                throw new Error('Ongeldige achternaam');
            }

            if (!InputValidatorPattern.validateNames(company.value)) {
                throw new Error('Ongeldige bedrijfsnaam');
            }

            const contact = new Contact({
                firstName: firstname.value,
                lastName: lastname.value,
                company: company.value
            });

            await contact.save();
        }

        console.log('Gegevens zijn succesvol opgeslagen!');

    } catch (error) {
        console.error(error);
    }
}

module.exports = { getHubspotConnection: getHubspotConnection };