const { hashPassword } = require('./HashEncryption');
const DataModel = require('../../DataSchematics/UserSchematic');


function HandleData(req, res) {
    const { email, password, role } = req.body;

    const hashedPassword = hashPassword(password);

    const newData = new DataModel({
        email,
        password: hashedPassword,
        role
    });

    newData.save()
        .then(() => {
            res.redirect('/admin')
        })
        .catch((err) => {
            console.error(err);
            res.redirect(`https://http.cat/${500}`);
        });
}

module.exports = HandleData;