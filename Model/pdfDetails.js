const mongoose= require('mongoose')

const PdfDetailsSchema = new mongoose.Schema({//les champs identiques a notre formulaire
            
         pdf :String ,
         detail :String ,
         recepteur :String ,
         dateajout: Date,
         titre: String 
                  
}, { collection:"PdfDetails"})// nom de la table 'Lesclientenregistree: cest nouvelle table qu'il va creer dans la bd' on met le nom qu'on v sa sera dans la base
   mongoose.model("PdfDetails",PdfDetailsSchema )//la table "LesclientTab"
