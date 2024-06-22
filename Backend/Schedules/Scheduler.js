const schedule = require('node-schedule');
// const updateDatabase = require('./Old/APIConnection');
const sendEmailsToUsers = require('./EmailService');
const getInactiveProjects = require('./FetchInactiveProjects');

// Voor syntax, zie cronjob documentatie op: https://crontab.guru/
// Email sturen elke vrijdagochtend
const emailJob = schedule.scheduleJob('0 0 * * 5', function() {
    sendEmailsToUsers();
});