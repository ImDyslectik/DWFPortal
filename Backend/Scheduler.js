const schedule = require('node-schedule');
const updateDatabase = require('./APIConnection');
const sendEmail = require('./EmailService');
const refreshAccesToken = require('./EmailService');

//For syntax see cronjob documentation at: https://crontab.guru/
// Call refresh function every minute
const refreshJob = schedule.scheduleJob('*/5 * * * * *', function() {
    updateDatabase();
});

// Call email to send a mail every friday morning
const emailJob = schedule.scheduleJob('*/1 * * * *', function() {
    sendEmail();
});

//TODO access token refreshen als het nodig is

// Call API function to refresh acces token every night
const tokenJob = schedule.scheduleJob('0 0 * * *', function() {
    refreshAccesToken();
});