const mongoose= require('mongoose')

const AjouterrendezvousdanslaBDSchema = new mongoose.Schema({//les champs identiques a notre formulaire
    identifiant: { type : String, },
    titre: { type : String, },
    date:{ type : String,   },
    letime :  { type : String,},
   
})// 'Lesclientenregistree: cest nouvelle table qu'il va creer dans la bd' on met le nom qu'on v sa sera dans la base
const AjouterRendezvousdanslaBDModel = mongoose.model("Lecrendezvous",AjouterrendezvousdanslaBDSchema )//la table "LesclientTab"

//on exporte maintenant le module puis importons dans le serveur 
module.exports = AjouterRendezvousdanslaBDModel

