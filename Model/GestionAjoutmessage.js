const mongoose= require('mongoose')

const AjouterMessagedanslaBDSchema = new mongoose.Schema({//les champs identiques a notre formulaire
    name: { type : String, required: true},
   
    dateajout :  { type : Date},
    
    afaire :  { type : String},
    repondre :  { type : String},
    recepteur :  { type : String},
   
   
})// 'Lesclientenregistree: cest nouvelle table qu'il va creer dans la bd' on met le nom qu'on v sa sera dans la base
const AjouterMessagedanslaBDModel = mongoose.model("LesMessages",AjouterMessagedanslaBDSchema )//la table "LesclientTab"

//on exporte maintenant le module puis importons dans le serveur 
module.exports = AjouterMessagedanslaBDModel