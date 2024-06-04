const mongoose = require("mongoose");
const fs = require("fs");
const xlsx = require("xlsx");
const Project = require("../../DataSchematics/ProjectSchematic");

function transpose(array) {
    return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}

const exportCSV = async (req, res) => {
    try {
        const projects = await Project.find({}).lean();

        const labels = [
            "Bedrijfsnaam",
            "KvK nummer",
            "Email",
            "Type activiteit",
            "0-Lijst",
            "Vraag 1: Hoe bent u in aanraking gekomen met de werkplaats?",
            "Vraag 2: Wat was de aanleiding om de werkplaats te betrekken in uw vraagstuk?",
            "a. Online marketing & sales",
            "b. Data",
            "c. (Kantoor) automatisering",
            "d. Anders, nl ...",
            "Vraag 3: Stelt u zich de ideale organisatie voor die digitale technologieën en mogelijkheden gebruikt om de organisatie te verbeteren: hoe dicht staat uw organisatie bij dat ideaal (op een schaal van 1 tot 10)?",
            "Vraag 4 - Vraag 4: Indien u obstakels ervaart met (de implementatie van) digitalisering, wat heeft je er tot nu toe van weerhouden?",
            "a. Ik weet niet wat digitalisering mijn bedrijf kan opleveren",
            "b. Ik weet wat mogelijk is maar zie te weinig voordelen",
            "c. Digitalisering kost te veel geld in verhouding met de opbrengsten",
            "d. Ik weet welke innovatie ik zou willen maar de technologie is nog niet beschikbaar (voor mijn bedrijf)",
            "e. Binnen mijn bedrijf is onvoldoende kennis en kunde (know-how) aanwezig om met digitalisering aan de slag te gaan.",
            "f. Binnen mijn bedrijf hebben we te weinig tijd om met digitalisering aan de slag te gaan.",
            "g. Ik kan geen bedrijf vinden dat mij tegen redelijk tarief kan helpen om te digitaliseren.",
            "h. Ik wil wel maar de financiële mogelijkheden ontbreken.",
            "i. Overig",
            "",
            "Vraag 5: Wat hoopt u dat de samenwerking met de Digitale Werkplaats u oplevert?",
            "a. Meer inzicht in kansen voor digitaliseringsmogelijkheden voor mijn bedrijf",
            "b. Meer kennis over kosten en haalbaarheid voor digitaliseringsmogelijkheden voor mijn bedrijf",
            "c. Toegang krijgen tot data en/of software die nodig zijn om verder te digitaliseren",
            "d. Toegang tot kennis en vaardigheden",
            "e. Ontwikkeling van eigen kennis en vaardigheden",
            "f. Samenwerking met een student (extra capaciteit aantrekken)",
            "g. Verbreden (kennis)netwerk",
            "h. Een concreet opgeleverd advies / stappenplan of product",
            "Vraag 6: Met welk vraagstuk gaat u aan de slag?",
            "1-Lijst",
            "Vraag 1: Wat heeft de activiteit binnen de werkplaats u en/of uw bedrijf opgeleverd",
            "a. Ik heb meer inzicht gekregen in de kansen van digitalisering voor mijn bedrijf ",
            "b. Ik ben meer te weten gekomen over de kosten of haalbaarheid voor digitaliseringsmogelijkheden voor mijn bedrijf.",
            "c. Ik heb toegang gekregen tot data en/of software die nodig zijn om (verder) te digitaliseren.",
            "d. Ik heb toegang gekregen tot kennis en vaardigheden om (verder) te digitaliseren.",
            "e. Ik heb zelf kennis en vaardigheden ontwikkeld om (verder) te digitaliseren.",
            "f. Ik ben tevreden over de samenwerking met de student/ studenten.",
            "g. Er is een concreet advies/stappenplan of product opgeleverd.",
            "Vraag 2: In hoeverre bent u tevreden over het opgeleverde resultaat: het concrete advies/stappenplan of product ? (op een schaal van 1-10)",
            "Vraag 3: Is er naast bovenstaande antwoorden nog meer uitgekomen wat u op voorhand niet had gedacht/verwacht?",
            "Vraag 4: Zou u het andere ondernemers aanraden om een traject met een werkplaats te starten? (op een schaal van 1-10)",
            "Vraag 5: Welke vervolgstappen heeft u gezet of gaat u zetten naar aanleiding van het traject met de werkplaats?",
            "a: Voor de implementatie neem ik een gespecialiseerd bedrijf in de arm die een maatwerkoplossing ontwikkelt.",
            "b: Er worden werknemers bij-of omgeschoold",
            "c: Er worden nieuwe medewerker(s) aangetrokken",
            "d: We gaan meer investeren in digitalisering, er wordt bijvoorbeeld standaard apparatuur/data/software aangeschaft",
            "e: Er worden nieuwe producten of diensten ontwikkeld",
            "f: Een nieuwe onderneming starten (spin out/ startup)",
            "g: Een nieuw of vervolgt traject starten met de werkplaats",
            "h: Anders, namelijk: Wellicht voor de toekomst.",
            "i: Er worden geen aanvullende stappen gezet",
            "j: Weet ik niet",
            "Vraag 6: Indien u belemmeringen ervaart of voorziet bij het zetten van deze vervolgstappen, welke zijn dit dan?",
            "a: Ik ervaar of voorzie geen belemmeringen",
            "b: Ik heb geen budget",
            "c: Ik heb geen kennis",
            "e: Ik ben niet overtuigd van de noodzaak",
            "d: Ik beschik niet over het juiste netwerk",
            "f: Anders",
            "Vraag 7: Heeft u suggesties ter verbetering van de werkplaats?",
        ];

        const data = projects.map((project) => [
            project.company,
            project.name,
            project.kvkNummer,
            project.companyEmail,
            project.typeActiviteit,
            project.inAanraking,

            "",
            project.aanleiding === "a" ? "x" : "",
            project.aanleiding === "b" ? "x" : "",
            project.aanleiding === "c" ? "x" : "",
            project.aanleiding === "d" ? "x" : "",

            project.digitlisering,
            "",

            //vraag 4
            project.obstakels && project.obstakels.includes("a") ? "a" : "",
            project.obstakels.includes("b") ? "b" : "",
            project.obstakels && project.obstakels.includes("c") ? "c" : "",
            project.obstakels && project.obstakels.includes("d") ? "d" : "",
            project.obstakels && project.obstakels.includes("e") ? "e" : "",
            project.obstakels && project.obstakels.includes("f") ? "f" : "",
            project.obstakels && project.obstakels.includes("g") ? "g" : "",
            project.obstakels && project.obstakels.includes("h") ? "h" : "",
            project.obstakels && project.obstakels.includes("i") ? "i" : "",

            "",
            "",
            //vraag 5
            project.gewensteResultaat && project.gewensteResultaat.includes("a")
                ? "a"
                : "",
            project.gewensteResultaat && project.gewensteResultaat.includes("b")
                ? "b"
                : "",
            project.gewensteResultaat && project.gewensteResultaat.includes("c")
                ? "c"
                : "",
            project.gewensteResultaat && project.gewensteResultaat.includes("d")
                ? "d"
                : "",
            project.gewensteResultaat && project.gewensteResultaat.includes("e")
                ? "e"
                : "",
            project.gewensteResultaat && project.gewensteResultaat.includes("f")
                ? "f"
                : "",
            project.gewensteResultaat && project.gewensteResultaat.includes("g")
                ? "g"
                : "",
            project.gewensteResultaat && project.gewensteResultaat.includes("h")
                ? "h"
                : "",
            project.vraagstuk,
            "",
            "",

            //1 lijst
            project.meerInzicht,
            project.meerTeWeten,
            project.toegang,
            project.kennisToegang,
            project.zelfKennis,
            project.tevredenheid,
            //advies
            project.resultaat,
            project.tevredenheidNummer,
            project.extraUitkomst,
            project.aanraden,
            "",

            project.vervolgstappen.includes("a") ? "a" : "",
            project.vervolgstappen && project.vervolgstappen.includes("b") ? "b" : "",
            project.vervolgstappen && project.vervolgstappen.includes("c") ? "c" : "",
            project.vervolgstappen && project.vervolgstappen.includes("d") ? "d" : "",
            project.vervolgstappen && project.vervolgstappen.includes("e") ? "e" : "",
            project.vervolgstappen && project.vervolgstappen.includes("f") ? "f" : "",
            project.vervolgstappen && project.vervolgstappen.includes("g") ? "g" : "",
            project.vervolgstappen && project.vervolgstappen.includes("h") ? "h" : "",
            project.vervolgstappen && project.vervolgstappen.includes("i") ? "i" : "",
            project.vervolgstappen && project.vervolgstappen.includes("j") ? "j" : "",

            "",
            project.belemmeringen && project.belemmeringen.includes("a") ? "a" : "",
            project.belemmeringen && project.belemmeringen.includes("b") ? "b" : "",
            project.belemmeringen && project.belemmeringen.includes("c") ? "c" : "",
            project.belemmeringen && project.belemmeringen.includes("d") ? "d" : "",
            project.belemmeringen && project.belemmeringen.includes("e") ? "e" : "",
            project.belemmeringen && project.belemmeringen.includes("f") ? "f" : "",
            project.suggesties,
        ]);

        data.unshift(labels);

        let tData = transpose(data);

        const workSheet = xlsx.utils.json_to_sheet(tData);
        const workBook = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(workBook, workSheet, "Projects");

        const tempFileName = __dirname + "/Projects.xlsx";
        xlsx.writeFile(workBook, tempFileName);

        res.download(tempFileName, "ProjectsData.xlsx");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while generating Excel file");
    }
};

module.exports = exportCSV;
