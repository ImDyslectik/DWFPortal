const schedule = require('node-schedule');
// const updateDatabase = require('./Old/APIConnection');
const sendEmailsToUsers = require('./EmailService');
const getInactiveProjects = require('./FetchInactiveProjects');

// Voor syntax, zie cronjob documentatie op: https://crontab.guru/
// Refresh functie aanroepen elke minuut
// const refreshJob = schedule.scheduleJob('*/5 * * * * *', function() {
//     updateDatabase();
// });

// Email sturen elke vrijdagochtend
const emailJob = schedule.scheduleJob('*/5 * * * * *', function() {
    sendEmailsToUsers();
});

// TODO access token verversen als het nodig is
// API functie aanroepen om access token te verversen elke nacht
// const tokenJob = schedule.scheduleJob('0 0 * * *', function() {
//     refreshAccesToken();
// });