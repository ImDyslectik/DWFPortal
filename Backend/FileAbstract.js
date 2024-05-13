const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const xlsx = require("xlsx");
const ContactModel = require("../DataSchematics/ContactSchematic");
const FirstReviewModel = require("../DataSchematics/FirstReviewSchematic");
const SecondReviewModel = require("../DataSchematics/SecondReviewSchematic");

class DataImporter {
    async import(fileData) {
        const workbook = xlsx.read(fileData, { type: "buffer" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);
        for (const row of jsonData) {
            this.createModel(row);
            await this.saveToDatabase();
        }
    }

    createModel(row) {
        throw new Error("You have to implement the method createModel!");
    }

    saveToDatabase() {
        throw new Error("You have to implement the method saveToDatabase!");
    }
}

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
            digitalisering: row["digitalisering"],
            ervaring: row["ervaring"],
            sector: row["sector"],
            begincijfer: row["begincijfer"],
        });
    }
    async saveToDatabase() {
        const existingReview = await FirstReviewModel.findOne({
            digitalisering: this.model.digitalisering,
            ervaring: this.model.ervaring,
            sector: this.model.sector,
        });
        if (!existingReview) {
            await this.model.save();
        }
    }
}

class SecondReviewDataImporter extends DataImporter {
    createModel(row) {
        this.model = new SecondReviewModel({
            digitalisering: row["digitalisering"],
            ervaring: row["ervaring"],
            sector: row["sector"],
            eindcijfer: row["eindcijfer"],
        });
    }
    async saveToDatabase() {
        const existingReview = await SecondReviewModel.findOne({
            digitalisering: this.model.digitalisering,
            ervaring: this.model.ervaring,
            sector: this.model.sector,
        });
        if (!existingReview) {
            await this.model.save();
        }
    }
}

router.post("/", upload.single("file"), async (req, res) => {
    const fileData = req.file.buffer;
    const workbook = xlsx.read(fileData, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    let importer;
    const columns = Object.keys(jsonData[0]);
    if (
        columns.includes("voornaam") &&
        columns.includes("achternaam") &&
        columns.includes("organisatie") &&
        columns.includes("email") &&
        columns.includes("telefoonnummer")
    ) {
        importer = new ContactDataImporter();
    } else if (
        columns.includes("digitalisering") &&
        columns.includes("ervaring") &&
        columns.includes("sector") &&
        columns.includes("begincijfer")
    ) {
        importer = new FirstReviewDataImporter();
    } else if (
        columns.includes("digitalisering") &&
        columns.includes("ervaring") &&
        columns.includes("sector") &&
        columns.includes("eindcijfer")
    ) {
        importer = new SecondReviewDataImporter();
    } else {
        // Handle unrecognized table format
        res.redirect(`https://http.cat/${500}`);
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
