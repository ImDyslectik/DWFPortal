const mongoose = require('mongoose');
const axios = require('axios');
const Deal = require('./DealSchematic');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const accessToken = process.env.ACCES_TOKEN;

module.exports = async function refresh() { // voeg async toe

    const response = await axios.get(process.env.SCOPE, { // voeg await toe
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    const deals = response.data.results;

    for (const deal of deals) { // wijzig forEach naar for-of om await te gebruiken
        const dealData = {
            dealId: deal.id,
            amount: deal.properties.amount,
            closedate: deal.properties.closedate,
            createdate: deal.properties.createdate,
            dealname: deal.properties.dealname,
            ownerId: deal.properties.hs_owner_id,
            dealstage: deal.properties.dealstage,
            hs_lastmodifieddate: deal.properties.hs_lastmodifieddate,
            pipeline: deal.properties.pipeline,
            archived: deal.archived,
            ownerName: '', // Nieuw veld
            companyName: '', // Nieuw veld
        };

        const dealUrl = `https://api.hubapi.com/deals/v1/deal/${dealData.dealId}`;

        try {
            const dealResponse = await axios.get(dealUrl, { // voeg await toe
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const associatedContactIds = dealResponse.data.associations.associatedVids;
            console.log('hs_owner_id:', dealResponse.data.properties.hs_owner_id);
            if (dealResponse.data.properties.hs_owner_id) {
                const ownerId = dealResponse.data.properties.hs_owner_id.value;
                console.log('ownerId:', ownerId);

                const ownerUrl = `https://api.hubapi.com/owners/v2/owners/${ownerId}`;
                console.log('ownerUrl:', ownerUrl);

                const ownerResponse = await axios.get(ownerUrl, { // voeg await toe
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('ownerResponse:', ownerResponse);
                console.log('ownerResponse.data:', ownerResponse.data);

                // Update owner name
                dealData.ownerName = ownerResponse.data.firstName + ' ' + ownerResponse.data.lastName;
            }

            // Loop through each associated contact and retrieve details and the name of the company
            for (const contactId of associatedContactIds) { // wijzig forEach naar for-of om await te gebruiken
                const contactUrl = `https://api.hubapi.com/contacts/v1/contact/vid/${contactId}/profile`;
                const contactResponse = await axios.get(contactUrl, { // voeg await toe
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const companyId = contactResponse.data.properties.associatedcompanyid.value;
                const companyUrl = `https://api.hubapi.com/companies/v2/companies/${companyId}`;
                const companyResponse = await axios.get(companyUrl, { // voeg await toe
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Update Company name
                dealData.companyName = companyResponse.data.properties.name.value;
            }

            await Deal.findOneAndUpdate({ dealId: dealData.dealId }, dealData, { // voeg await toe
                upsert: true,
                new: true,
                runValidators: true
            });
            console.log(`Deal ${deal.id} has been updated or inserted!`);
        } catch (error) {
            console.error(`Failed to save deal ${deal.id}:`, error);
        }
    }
};