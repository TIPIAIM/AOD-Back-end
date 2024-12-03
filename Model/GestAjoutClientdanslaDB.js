const mongoose= require('mongoose')

const AjouterClientdanslaBDSchema = new mongoose.Schema({//les champs identiques a notre formulaire
    nameid: { type : String, },
    name: { type : String, },
    adresse :  { type : String, },
    dateajout:{ type : Date,   },
    numero :  { type : Number,},
    selectionne :{ type : String },
    avocat: { type : String, }
})// 'Lesclientenregistree: cest nouvelle table qu'il va creer dans la bd' on met le nom qu'on v sa sera dans la base
const AjouterClientdanslaBDModel = mongoose.model("LeclientTabs",AjouterClientdanslaBDSchema )//la table "LesclientTab"

//on exporte maintenant le module puis importons dans le serveur 
module.exports = AjouterClientdanslaBDModel

