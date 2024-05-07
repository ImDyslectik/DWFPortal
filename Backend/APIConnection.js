const axios = require('axios');

//Using .env file to make sure the client id and secret don't end up publicly on GitHub
require('dotenv').config();

//TODO collect this token form url instead of manually, it also doesnt update after a request :(
const oauthToken = "eu1-ca4e-9923-485d-bca7-242fb99a0781";
const apiHost = 'api.hubspot.com';

async function testHubSpotConnection() {
    try {
        const tokenResponse = await axios.post(`https://${apiHost}/oauth/v1/token`, {
            grant_type: 'authorization_code',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI,
            code: oauthToken
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        console.log('Access token:', accessToken);

        const response = await axios.get(`https://${apiHost}/contacts/v1/lists/all/contacts/all`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log('Verbinding met HubSpot API is gelukt! :))) ');

        //TODO deze gegevens voor deals toepassen en dan al die gegevens overplaatsen naar een database
        console.log('Eerste contact:', response.data.contacts[1].properties);

        //console.log('Status code:', response.status);
        //console.log('Response data:', response.data);
    } catch (error) {
        console.error(error);
    }
}

testHubSpotConnection();