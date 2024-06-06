const mongoose = require("mongoose");
const fs = require("fs");
const xlsx = require("xlsx");
const Project = require("../../DataSchematics/ProjectSchematic");
const labels = require("../../Constants/Labels");
const moment = require("moment");

function transpose(array) {
    return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}

function checkIfExists(value, array) {
    if (array)
        return array.includes(value) ? value : "";
    else
        return "";
}

const exportCSV = async (req, res) => {
    try {
        let exportDate = req.session.exportDate;

        let [day, month, year] = exportDate.split('-');
        let isoDate = `${day}-${month}-${year}`;

        let date = moment(isoDate).add(1, 'days').toDate(); // Gebruik moment.js om de dag te verhogen

        const projects = await Project.find({
            stage: '112184788',
            updatedAt: { $gte: date },
        }).lean();

        const data = projects.map((project) => {

            const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

            const obstakelsResults = letters.map(letter => checkIfExists(letter, project.obstakels));
            const gewensteResultaatResults = letters.map(letter => checkIfExists(letter, project.gewensteResultaat));
            const vervolgstappenResults = letters.map(letter => checkIfExists(letter, project.vervolgstappen));
            const belemmeringenResults = letters.map(letter => checkIfExists(letter, project.belemmeringen));

            return [
                project.company,
                project.name,
                project.kvkNummer,
                project.companyEmail,
                project.typeActiviteit,

                //0-Lijst
                project.inAanraking,
                "",
                project.aanleiding === "a" ? "x" : "",
                project.aanleiding === "b" ? "x" : "",
                project.aanleiding === "c" ? "x" : "",
                project.aanleiding === "d" ? "x" : "",
                project.digitlisering,
                "",
                ...obstakelsResults,
                "",
                "",
                ...gewensteResultaatResults,
                project.vraagstuk,
                "",
                "",

                //1-Lijst
                project.meerInzicht,
                project.meerTeWeten,
                project.toegang,
                project.kennisToegang,
                project.zelfKennis,
                project.tevredenheid,
                project.resultaat,
                project.tevredenheidNummer,
                project.extraUitkomst,
                project.aanraden,
                "",
                ...vervolgstappenResults,
                "",
                ...belemmeringenResults,
                project.suggesties,
            ];

        });

        data.unshift(labels);

        let tData = transpose(data);

        const workSheet = xlsx.utils.json_to_sheet(tData);
        const workBook = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(workBook, workSheet, "Projects");

        let buf = xlsx.write(workBook, {type:'buffer', bookType: 'xlsx'});

        res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buf);

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while generating Excel file");
    }
};

module.exports = exportCSV;