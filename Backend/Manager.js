const schedule = require('node-schedule');
const updateDatabase = require('./APIConnection');
const sendEmail = require('./EmailService');
const refreshAccesToken = require('./EmailService');

// Stel de refresh functie in om elke minuut te worden uitgevoerd
const refreshJob = schedule.scheduleJob('*/1 * * * *', function() {
    updateDatabase();
});

// Stel de email functie in om elke week om 9:00 op vrijdag te worden uitgevoerd
const emailJob = schedule.scheduleJob('*/1 * * * *', function() {
    sendEmail();
});

//TODO access token refreshen als het nodig is

// Stel de API Token functie in om elke avond te worden uitgevoerd
const tokenJob = schedule.scheduleJob('0 0 * * *', function() {
    refreshAccesToken();
});