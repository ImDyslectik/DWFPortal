const { generateKeyPair, encryptText } = require('./RSAEncryption');
const DataModel = require('../../DataSchematics/UserSchematic');

function HandleData(req, res) {
    const { email, password, role } = req.body;

    const keyPair = generateKeyPair();
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    const encryptedPassword = encryptText(password, publicKey);

    const newData = new DataModel({
        email,
        password: encryptedPassword,
        role,
        publicKey,
        privateKey,
    });

    newData.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
}

module.exports = HandleData;