const mongoose= require('mongoose')
//a sup^rimer
const AjouterSubassementdanslaBDSchema = new mongoose.Schema({//les champs identiques a notre formulaire
         name: {
                type : String,
                required: true
                },
         recepteur: {
                type : String,
                required: true
                },
        dateajout:{
                type : Date,
                required: true
                },
        fichier :{ 
                 type : Buffer, 
                 required: true},
    description:{
                 type : String,
                required: true},
   
})// 'Lesclientenregistree: cest nouvelle table qu'il va creer dans la bd' on met le nom qu'on v sa sera dans la base
const AjouterSubassementdanslaBDModel = mongoose.model("LesSubassement",AjouterSubassementdanslaBDSchema )//la table "LesclientTab"

//on exporte maintenant le module puis importons dans le serveur 
module.exports = AjouterSubassementdanslaBDModel