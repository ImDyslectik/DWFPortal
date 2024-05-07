const express = require('express');
const path = require('path');
const router = express.Router();
const checkAuth = require('../CheckAuth');

router.get('/', checkAuth, (req, res) => {
    res.render(path.join(__dirname, '../../Frontend/EJS/code.ejs'));
});

router.get('/code', (req, res) => {
    var code = req.query.code;
    console.log("code:", code);
    console.log("hallo");
    res.redirect('/');
});

module.exports = router;