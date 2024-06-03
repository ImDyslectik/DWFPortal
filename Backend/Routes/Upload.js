const express = require('express');
const router = express.Router();
const upload = require('../FileUpload');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const Project = require('../../DataSchematics/ProjectSchematic');

const {
    obstakelsMapper,
    vervolgstappenMapper,
    belemmeringenMapper
} = require("../ExportTests");


router.post('/uploadexcel', upload.single('firstReviewFile'), function(req, res) {
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const excelData = data[0];

    const mapData = (rawData, mapper) => {
        return rawData.split(';').map(value => mapper[value.trim()] || 'z');
    };

    //Need to do this to make sure not to overwrite the colomns not present in the active file
    let obstakelsMapped, vervolgstappenMapped, belemmeringenMapped;

    //Annoying NBSP in the microsoft form
    if (excelData[" Indien je obstakels ervaart met (de implementatie van) digitalisering, welke zijn dit? (meerdere antwoorden mogelijk)"]){
        obstakelsMapped = mapData(excelData[" Indien je obstakels ervaart met (de implementatie van) digitalisering, welke zijn dit? (meerdere antwoorden mogelijk)"], obstakelsMapper);
    }
    if (excelData["Welke vervolgstappen zijn gezet of ga je zetten naar aanleiding van het traject met de werkplaats? (meerdere antwoorden mogelijk)"]){
        vervolgstappenMapped = mapData(excelData["Welke vervolgstappen zijn gezet of ga je zetten naar aanleiding van het traject met de werkplaats? (meerdere antwoorden mogelijk)"], vervolgstappenMapper);
    }
    if (excelData["Ervaar of voorzie je belemmeringen bij het zetten van deze vervolgstappen, zo ja welke? (meerdere antwoorden mogelijk)"]){
        belemmeringenMapped = mapData(excelData["Ervaar of voorzie je belemmeringen bij het zetten van deze vervolgstappen, zo ja welke? (meerdere antwoorden mogelijk)"], belemmeringenMapper);
    }

    const mappedData = {
        name: excelData['Naam'],
        companyEmail: excelData["E-mail"],
        company: excelData['Bedrijfsnaam'],
        problem: excelData['Wat was de aanleiding om de werkplaats te betrekken in jouw vraagstuk?\r\n'],
        description: excelData['Met welk vraagstuk ga je aan de slag?'],
        nameContactPerson: excelData['Naam contactpersoon\r\n'],
        digitlisering: excelData['Stel je de ideale organisatie voor die digitale technologieën en mogelijkheden gebruikt om de organisatie te verbeteren: hoe dicht staat jouw organisatie bij dat ideaal (op een schaal van 1 tot 10)?'],
        kvkNummer: excelData["KvK nummer"],
        typeActiviteit: excelData['Welk type activiteit ga jij ondernemen met de Digitale Werkplaats?'],
        inAanraking: excelData['Hoe bent u in aanraking gekomen met Digitale Werkplaats Fryslân?'],
        aanleiding: excelData['Wat was de aanleiding om de werkplaats te betrekken in jouw vraagstuk?'],
        vraagstuk: excelData['Met welk vraagstuk ga je aan de slag?'],
        resultaat: excelData['Er is een concreet advies/stappenplan of product opgeleverd'],
        tevredenheid: excelData['Ik ben tevreden over de samenwerking met de student/ studenten'],
        extraUitkomst: excelData['Is er naast bovenstaande antwoorden nog meer uitgekomen wat je op voorhand niet had gedacht/verwacht?'],
        aanraden: excelData['Zou je het andere ondernemers aanraden om een traject met een werkplaats te starten? (op een schaal van 1 tot 10)'],
        suggesties: excelData['Heb je suggesties ter verbetering van de werkplaats?'],
        obstakels: obstakelsMapped,
        vervolgstappen: vervolgstappenMapped,
        belemmeringen: belemmeringenMapped,
    };


    if (mongoose.Types.ObjectId.isValid(req.body.projectId)) {
        Project.findByIdAndUpdate(req.body.projectId, { $set: mappedData }, { new: true })
            .then(project => {
                res.redirect('/');
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('An error occurred while updating the project.');
            });
    } else {
        res.status(400).send('Invalid Project ID');
    }
});

module.exports = router;