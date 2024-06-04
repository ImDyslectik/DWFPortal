const mongoose = require("mongoose");
const {
        obstakelsMapper,
        verwachtResultaatMapper,
        vervolgstappenMapper,
        belemmeringenMapper
} = require("../Helpers/ArrayMapper");
const { Schema } = mongoose;


const projectSchema = new Schema(
    {
        name: { type: String, required: true },
        companyEmail: { type: String, required: true },
        dealOwnerEmail: { type: String, required: true },
        stage: { type: String, required: true },

        name: { type: String },
        company: { type: String },
        problem: { type: String },
        description: { type: String },
        nameContactPerson: { type: String },

        kvkNummer: { type: String },
        typeActiviteit: { type: String },
        inAanraking: { type: String },
        aanleiding: { type: String },
        digitlisering: { type: Number },

        obstakels: { type: Array },
        gewensteResultaat: { type: Array },
        vraagstuk: { type: String },

        meerInzicht: { type: String },
        meerTeWeten: { type: String },
        toegang: { type: String },
        kennisToegang: { type: String },
        zelfKennis: { type: String },
        tevredenheid: { type: String },
        resultaat: { type: String },
        tevredenheidNummer: { type: Number },
        extraUitkomst: { type: String },

        aanraden: { type: Number },
        vervolgstappen: { type: Array },
        belemmeringen: { type: Array },
        suggesties: { type: String },
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
