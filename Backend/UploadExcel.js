const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const xlsx = require('xlsx');
const ContactModel = require('../DataSchematics/ContactSchematic');

async function processExcelFile(fileData) {
    const workbook = xlsx.read(fileData, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    for (const row of jsonData) {
        const voornaam = row['voornaam'];
        const achternaam = row['achternaam'];
        const organisatie = row['organisatie'];
        const email = row['email'];
        const telefoonnummer = row['telefoonnummer'];

        const existingContact = await ContactModel.findOne({ email });
        if (existingContact) {
            console.log(`Duplicate gevonden: ${email}`);
            continue;
        }

        const newContact = new ContactModel({
            voornaam,
            achternaam,
            organisatie,
            email,
            telefoonnummer
        });

        try {
            await newContact.save();
            console.log('Contact succesvol aangemaakt en opgeslagen in de database');
        } catch (err) {
            console.error(err);
            console.log('Er is een fout opgetreden bij het aanmaken van het contact');
        }
    }
}

router.post('/', upload.single('file'), (req, res) => {
    const fileData = req.file.buffer;

    (async () => {
        await processExcelFile(fileData);
    })();

    res.send('Excel-bestand succesvol verwerkt');
});

module.exports = router;