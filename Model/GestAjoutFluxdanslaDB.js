const mongoose = require("mongoose");

const AjouterFluxdanslaBDSchema = new mongoose.Schema({
  //les champs identiques a notre formulaire
  clientid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LeclientTabs",
  },
  clientid: { type: String },
  enregistrant: { type: String },
  libelle: { type: String },
  dateajout: { type: Date },
  montant: { type: Number },
  nature: { type: String },
}); // 'Lesclientenregistree: cest nouvelle table qu'il va creer dans la bd' on met le nom qu'on v sa sera dans la base
const AjouterFluxdanslaBDModel = mongoose.model(
  "Lecentrersorties",
  AjouterFluxdanslaBDSchema
); //la table "LesclientTab"

//on exporte maintenant le module puis importons dans le serveur
module.exports = AjouterFluxdanslaBDModel;
