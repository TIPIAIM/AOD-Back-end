const mongoose = require("mongoose");

const AjouterprogrammedanslaBDSchema = new mongoose.Schema({
  //les champs identiques a notre formulaire
  numerodoss: { type: String },
  juge: { type: String },
  juridiction: { type: String },
  date: { type: String },
  parties: { type: String },
  natureAffaire: { type: String },
  dateRenvoi: { type: String },
  responsable: { type: String },
  motifRenvoi: { type: String },
}); // 'Lesclientenregistree: cest nouvelle table qu'il va creer dans la bd' on met le nom qu'on v sa sera dans la base
const AjouterProgrammedanslaBDModel = mongoose.model(
  "Leprogramm",
  AjouterprogrammedanslaBDSchema
); //la table "LesclientTab"

//on exporte maintenant le module puis importons dans le serveur
module.exports = AjouterProgrammedanslaBDModel;
