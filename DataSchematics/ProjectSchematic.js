const mongoose = require("mongoose");
const {
        obstakelsMapper,
        verwachtResultaatMapper,
        vervolgstappenMapper,
        belemmeringenMapper
} = require("../Backend/ExportTests");
const { Schema } = mongoose;


const projectSchema = new Schema(
    {
            name: { type: String, required: true },
            companyEmail: { type: String, required: true },
            dealOwnerEmail: { type: String, required: true },
            stage: { type: String, required: true },

            company: { type: String },
            problem: { type: String },
            description: { type: String },
            nameContactPerson: { type: String },
            digitlisering: { type: Number },

            kvkNummer: { type: String, required: false },
            typeActiviteit: { type: String, required: false },
            inAanraking: { type: Number, required: false },
            aanleiding: { type: Date, required: false },
            vraagstuk: { type: String, required: false },
            resultaat: { type: String, required: false },
            tevredenheid: { type: Number, required: false },
            extraUitkomst: { type: String, required: false },
            aanraden: { type: Number, required: false },
            suggesties: { type: String, required: false },

            obstakels: { type: Array, required: false },
            vervolgstappen: { type: Array, required: false },
            belemmeringen: { type: Array, required: false }

    },
    {
            timestamps: true,
    }
);


projectSchema.pre('save', function(next) {
        if (this.isModified('obstakels')) {
                this.obstakels = this.obstakels.split(';')
                    .map(obstacle => obstakelsMapper[obstacle.trim()])
                    .filter(Boolean);
        }
        if (this.isModified('verwachtResultaat')) {
                this.verwachtResultaat = this.verwachtResultaat.split(';')
                    .map(resultaat => verwachtResultaatMapper[resultaat.trim()])
                    .filter(Boolean);
        }
        if (this.isModified('vervolgstappen')) {
                this.vervolgstappen = this.vervolgstappen.split(';')
                    .map(stap => vervolgstappenMapper[stap.trim()])
                    .filter(Boolean);
        }
        if (this.isModified('belemmeringen')) {
                this.belemmeringen = this.belemmeringen.split(';')
                    .map( belemmering => belemmeringenMapper[belemmering.trim()])
                    .filter(Boolean);
        }
        next();
});



module.exports = mongoose.model("Project", projectSchema);
