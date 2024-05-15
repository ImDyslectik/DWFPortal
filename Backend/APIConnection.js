const mongoose = require('mongoose');
const axios = require('axios');
const Deal = require('../DataSchematics/DealSchematic');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })


const accessToken = process.env.ACCES_TOKEN;
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true });

module.exports = function refresh() {
    mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true });

    axios.get(process.env.SCOPE, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
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

                Deal.findOneAndUpdate({ dealId: dealData.dealId }, dealData, {
                    upsert: true,
                    new: true,
                    runValidators: true
                })
                    .then(() => console.log(`Deal ${deal.id} has been updated or inserted!`))
                    .catch(error => console.error(`Failed to save deal ${deal.id}:`, error));

                console.log(`Deal ID: ${deal.id}`);
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
}