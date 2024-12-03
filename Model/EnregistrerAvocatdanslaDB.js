const mongoose= require('mongoose')

const AjouterAvocatdanslaBDSchema = new mongoose.Schema({
    name: { type : String, required: true },
    adresse: { type : String},
    email : { type : String},
    dateajout: { type : Date},
    numero :{ type : String},
    avocat : { type : String},
    
})
const AjouterAvocatdanslaBDModel = mongoose.model("LesAvocats",AjouterAvocatdanslaBDSchema ) 
module.exports = AjouterAvocatdanslaBDModel
