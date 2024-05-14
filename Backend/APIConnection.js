const axios = require('axios');
const YOUR_TOKEN = 'pat-eu1-6c1472d7-5f6a-46de-a1fe-3b7e059d7d28';
const Deal = require('../DataSchematics/DealSchematic');
const mongoose = require('mongoose');

//TODO fix this to the actual name using the .env file
mongoose.connect('mongodb://localhost:27017/databasename', {useNewUrlParser: true});


axios.get('https://api.hubapi.com/crm/v3/objects/deals?limit=100', {
    headers: {
        'Authorization': `Bearer ${YOUR_TOKEN}`,
        'Content-Type': 'application/json'
    }
})
    .then(response => {
        const deals = response.data.results;

        deals.forEach(deal => {
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
            };

            const dbDeal = new Deal(dealData);
            dbDeal.save()
                .then(() => console.log(`Deal ${deal.id} saved!`))
                .catch(error => console.error(`Failed to save deal ${deal.id}:`, error));

            console.log(`Deal ID: ${deal.id}`);
            console.log(`Properties:`, deal.properties);
            console.log(`Created At: ${deal.createdAt}`);
            console.log(`owner: ${deal.ownerId}`);
            console.log(`Updated At: ${deal.updatedAt}`);
            console.log(`Archived: ${deal.archived}`);
            console.log('-----------------------------');
        });
    })
    .catch(error => {
        console.error(error);
    });