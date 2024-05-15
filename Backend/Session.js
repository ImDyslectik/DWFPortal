const session = require('express-session');

const generateSecret = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let secret = '';
    for (let i = 0; i < 32; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        secret += characters[randomIndex];
    }
    return secret;
};

const sessionMiddleware = session({
    secret: generateSecret(),
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Set session lifetime to 1 hour, seems reasonable
        maxAge: 60 * 60 * 1000
    }
});

module.exports = sessionMiddleware;