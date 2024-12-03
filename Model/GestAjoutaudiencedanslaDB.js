const mongoose= require('mongoose')

const AjouterAudiencedanslaBDSchema = new mongoose.Schema({//les champs identiques a notre formulaire
    name: { type : String, required: true},
    nameau: { type : String, required: true},
    dateajout :  { type : Date, required: true},
    rapport :  { type : String},
    afaire :  { type : String},
    nature: { type : String },
   
})// 'Lesclientenregistree: cest nouvelle table qu'il va creer dans la bd' on met le nom qu'on v sa sera dans la base
const AjouterAudiencedanslaBDModel = mongoose.model("LesAudiences",AjouterAudiencedanslaBDSchema )//la table "LesclientTab"

//on exporte maintenant le module puis importons dans le serveur 
module.exports = AjouterAudiencedanslaBDModel