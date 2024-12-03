const mongoose= require('mongoose')

const AjouterDossierdanslaBDSchema = new mongoose.Schema({
    clientid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"LeclientTbs"
    },
    rg:  { type : String   },
    jugechambre: { type : String },
    dateajout: { type : Date,   },
    categorie : { type : String }, 
    degredudoss :{ type : String },
    descriptioncas : { type : String },
    avocatquisuit: { type : String },   
    statutdoc :{ type : String },
    partiadverse :{ type : String },
    juridiction :{ type : String },
    autreAvocat :{ type : String },
    autreCategorie :{ type : String },


})

const AjouterDossierdanslaBDModel = mongoose.model("LesDossiers",AjouterDossierdanslaBDSchema ) 
module.exports = AjouterDossierdanslaBDModel

