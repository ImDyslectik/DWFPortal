const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const xlsx = require("xlsx");
const ContactModel = require("../DataSchematics/CompanySchematic");
const FirstReviewModel = require("../DataSchematics/FirstReviewSchematic");
const SecondReviewModel = require("../DataSchematics/SecondReviewSchematic");

class DataImporter {
    async import(fileData) {
        const workbook = xlsx.read(fileData, { type: "buffer" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        for (const row of jsonData) {
            try {
                const cleanedColumns = Object.keys(row).map(column => column.trim());
                this.createModel(row);
                await this.saveToDatabase();
            } catch (error) {
                console.error("Er is een fout opgetreden tijdens het opslaan van de rij:", error);
            }
        }
    }

    createModel(row) {
        throw new Error("Methode niet geimplementeerd in createModel!");
    }

    saveToDatabase() {
        throw new Error("Methode niet geimplementeerd in saveToDatabase!");
    }
}

//TODO fix contactimporter not always working
class ContactDataImporter extends DataImporter {
    createModel(row) {
        this.model = new ContactModel({
            voornaam: row["voornaam"],
            achternaam: row["achternaam"],
            organisatie: row["organisatie"],
            email: row["email"],
            telefoonnummer: row["telefoonnummer"],
        });
    }
    async saveToDatabase() {
        const existingContact = await ContactModel.findOne({
            email: this.model.email,
        });
        if (!existingContact) {
            await this.model.save();
        }
    }
}

class FirstReviewDataImporter extends DataImporter {
    createModel(row) {
        this.model = new FirstReviewModel({
            id: row["ID"],
            begintijd: row["Begintijd"],
            voltooitijd: row["Tijd van voltooien"],
            email: row["E-mail"],
            naam: row["Naam"],
            bedrijfsnaam: row["Bedrijfsnaam"],
            kvkNummer: row["KvK nummer"],
            woonplaats: row["In welke woonplaats is je bedrijf gevestigd?"],
            sector: row["In welke sector ben je werkzaam?"],
            aantalMedewerkers: row["Hoeveel medewerkers zijn werkzaam bij je bedrijf? (inclusief de eigenaar)" ],
            contactpersoon: row["Naam contactpersoon"],
            emailContactpersoon: row["Mailadres contactpersoon"],
            typeActiviteit: row['Welk type activiteit ga jij ondernemen met de Digitale Werkplaats?'],
            inAanraking: row['Hoe bent u in aanraking gekomen met Digitale Werkplaats Fryslân?'],
            aanleiding: row['Wat was de aanleiding om de werkplaats te betrekken in jouw vraagstuk?'],
            hoeDicht: row['Stel je de ideale organisatie voor die digitale technologieën en mogelijkheden gebruikt om de organisatie te verbeteren: hoe dicht staat jouw organisatie bij dat ideaal (op een schaal van 1 tot 10)?'],
            obstakels: row['Indien je obstakels ervaart met (de implementatie van) digitalisering, welke zijn dit? (meerdere antwoorden mogelijk)'],
            hooptU: row['Wat hoopt u dat de samenwerking met de Digitale Werkplaats u oplevert?'],
            vraagstuk: row['Met welk vraagstuk ga je aan de slag?']
        });

        console.log(this.model);
    }
    async saveToDatabase() {
        const existingReview = await FirstReviewModel.findOne({
            id: this.model.id
        });
        if (!existingReview) {
            await this.model.save();
        }
    }
}

class SecondReviewDataImporter extends DataImporter {
    createModel(row) {
        this.model = new SecondReviewModel({
            begintijd: row["Begintijd"],
            voltooitijd: row["Tijd van voltooien"],
            email: row["E-mail"],
            naam: row["Naam"],
            bedrijfsnaam: row["Bedrijfsnaam"],
            kvkNummer: row["KvK nummer"],
            woonplaats: row["In welke woonplaats is je bedrijf gevestigd?"],
            sector: row["In welke sector ben je werkzaam?"],
            aantalMedewerkers: row["Hoeveel medewerkers zijn werkzaam bij je bedrijf? (inclusief de eigenaar)"],
            contactpersoon: row["Naam contactpersoon"],
            emailContactpersoon: row["Mailadres contactpersoon"],
            typeActiviteit: row["Welk type activiteit ga jij ondernemen met de Digitale Werkplaats?"],
            inzichtKansen: row["Ik heb meer inzicht gekregen in de kansen van digitalisering voor mijn bedrijf"],
            kostenHaalbaarheid: row["Ik ben meer te weten gekomen over de kosten of haalbaarheid voor digitaliseringsmogelijkheden voor mijn bedrijf"],
            toegangTotData: row["Ik heb toegang gekregen tot data en/of software die nodig zijn om (verder) te digitaliseren"],
            toegangTotKennis: row["Ik heb toegang gekregen tot kennis en vaardigheden om (verder) te digitaliseren"],
            kennisVaardigheden: row["Ik heb zelf kennis en vaardigheden ontwikkeld om (verder) te digitaliseren"],
            tevredenSamenwerking: row["Ik ben tevreden over de samenwerking met de student/ studenten"],
            adviesOpgeleverd: row["Er is een concreet advies/stappenplan of product opgeleverd"],
            tevredenResultaat: row["In hoeverre ben je tevreden over het opgeleverde resultaat: het concrete advies/stappenplan of product ? (op een schaal van 1 tot 10)"],
            onverwachteResultaten: row["Is er naast bovenstaande antwoorden nog meer uitgekomen wat je op voorhand niet had gedacht/verwacht?"],
            aanbevelingWerkplaats: row["Zou je het andere ondernemers aanraden om een traject met een werkplaats te starten? (op een schaal van 1 tot 10)"],
            vervolgstappen: row["Welke vervolgstappen zijn gezet of ga je zetten naar aanleiding van het traject met de werkplaats? (meerdere antwoorden mogelijk)"],
            belemmeringen: row["Ervaar of voorzie je belemmeringen bij het zetten van deze vervolgstappen, zo ja welke? (meerdere antwoorden mogelijk)"],
            verbeteringSuggesties: row["Heb je suggesties ter verbetering van de werkplaats?"],
            opmerkingen: row["Opmerkingen:"],
        });
        console.log(this.model);

    }
    async saveToDatabase() {
        const existingReview = await SecondReviewModel.findOne({ id: this.model.id });
        if (!existingReview) {
            await this.model.save();
        }
    }
}


//Used to differentiate CSV files based on columns
router.post("/", upload.single("file"), async (req, res) => {
    const fileData = req.file.buffer;
    const workbook = xlsx.read(fileData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    let importer;

    if (jsonData.length === 0) {
        console.error('No data in uploaded file');
        return res.status(500).send({ message: 'No data in uploaded file' });
    }

    const rawColumns = Object.keys(jsonData[0]);
    const cleanedColumns = rawColumns.map(column => column.trim());
    const filteredColumns = cleanedColumns.filter((col) => !['__rowNum__'].includes(col));

    if (
        filteredColumns.includes("Ik ben tevreden over de samenwerking met de student/ studenten") &&
        filteredColumns.includes("In hoeverre ben je tevreden over het opgeleverde resultaat: het concrete advies/stappenplan of product ? (op een schaal van 1 tot 10)")
    ){
        importer = new SecondReviewDataImporter();
    } else if (
        filteredColumns.includes("Wat hoopt u dat de samenwerking met de Digitale Werkplaats u oplevert?")
    ) {
        importer = new FirstReviewDataImporter();
    } else if(
        filteredColumns.includes("voornaam") &&
        filteredColumns.includes("achternaam") &&
        filteredColumns.includes("organisatie") &&
        filteredColumns.includes("E-mail") &&
        filteredColumns.includes("telefoonnummer")
    ) {
        importer = new ContactDataImporter();
    } else {
        console.error('Unrecognized table format');
        return res.status(500).send({ message: 'Unrecognized table format' });
    }
    try {
        await importer.import(fileData);
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.redirect(`https://http.cat/${500}`);
    }
});

module.exports = router;
