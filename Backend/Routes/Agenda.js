const express = require('express');
const path = require('path');
const router = express.Router();
const checkAuth = require('../CheckAuth');

router.get('/', checkAuth, (req, res) => {
    res.render(path.join(__dirname, '../../Frontend/EJS/agenda.ejs'));
});

module.exports = router;