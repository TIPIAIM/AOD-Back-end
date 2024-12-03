const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require("bcryptjs")//pour la comparaison des codes pour authentification
const jwt = require('jsonwebtoken')
const cookieparser = require('cookie-parser')
const EnregistrementdanslaBDModel = require("./Model/EnregistrerdanslaDB")//on a importé le model utilisons le dans post mainte
const AjouterClientdanslaBDModel = require("./Model/GestAjoutClientdanslaDB")//on a importé le model utilisons le dans post mainte
const AjouterAudiencedanslaBDModel = require('./Model/GestAjoutaudiencedanslaDB')
const AjouterDossierdanslaBDModel = require('./Model/GestAjoutDossierdanslaDB')
const AjouterAvocatdanslaBDModel = require('./Model/EnregistrerAvocatdanslaDB')
const AjouterMessagedanslaBDModel = require('./Model/GestionAjoutmessage')
const AjouterFluxdanslaBDModel = require('./Model/GestAjoutFluxdanslaDB')
const AjouterRendezvousdanslaBDModel = require('./Model/GestAjoutRendevousdanslaDB')
const AjouterProgrammedanslaBDModel = require('./Model/GestProgrammedanslaDB')


require('dotenv').config();
const PORT = process.env.PORT 
const DB = process.env.DB;
const FRONTEND= process.env.FRONTEND
const MESROUTES=  process.env.MESROUTES
const app = express()

app.use("/files", express.static("files"))//pour rendre louverture du fichier static pour que sa soit accessible nimporte ou puis envoyé les données

app.use(express.json())
app.use(cors({
  origin: [FRONTEND],//l'adesse de notre front
  methodes: [MESROUTES],  //les mothodes
  credentials: true //les info d'identification qui devrait etre vrai
}))
app.use(cookieparser())
app.use("/files", express.static("files"))//pour le fichier pourpouvoir l'ouvrir ou on v
//sa creer une base de donnée directement en se basan sur le 27017 dans mongo et lui donne le nom "CabinetDonne"
mongoose.connect(DB);//connextion local puis le nom de la base donnée


//seconnecte , ajout de jwt pour ns generer les jeton
app.post("/seconnecter", (req, res) => {
  const { email, password } = req.body;
  
  EnregistrementdanslaBDModel.findOne({ email: email })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const token = jwt.sign({ email: user.email, role: user.role }, "jwt-secret-key", { expiresIn: '1d' });
            res.cookie("token", token);

            // Redirection en fonction du rôle
            let redirectUrl;
            switch (user.role) {
              case 'admin':
                redirectUrl = `${FRONTEND}/admindasboardgenerale`;
                break;
              case 'avocat':
                redirectUrl = `${FRONTEND}/Pagedechoixavoccc`;
                break;
                case 'client':
                redirectUrl = `${FRONTEND}/adminfils`;
                break;
              case 'visiteur':
                redirectUrl = `${FRONTEND}/home`;
                break;
              default:
                redirectUrl = FRONTEND;
            }

            res.json({ message: "Success", redirectUrl });
          } else {
            res.json({ message: "Le mot de passe n'est pas correct" });
          }
        });
      } else {
        res.json({ message: "Utilisateur non trouvé" });
      }
    });
});

//senregistrer pour pouvoir se 
app.post("/EnregistrerdanslaDB", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Vérifier si l'email est déjà utilisé
    const existingUser = await EnregistrementdanslaBDModel.findOne({ email: email });
    if (existingUser) {
      // Répondre avec une erreur si l'email est déjà utilisé
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer un nouv utilisateur dans la base de données
    const newUser = await EnregistrementdanslaBDModel.create({ name, email, password: hashedPassword, role });

    // Répondre avec les détails de l'utilisateur créé
    res.json(newUser);
  } catch (err) {
    // En cas d'erreur lors de l'enregistrement
    res.status(500).json({ message: "Erreur d'enregistrement", error: err.message });
  }
});
//le code qui verifie le mail et mot de passe pourquil se connect  EnregistrementdanslaBDModel.create({ name, email, password: hash, role })


// 'GestAjoutClientdanslaDB' on va lui metre dans axions de front
app.post("/GestAjoutClientdanslaDB", (req, res) => {//creons le model dans le serveur donc la route qui contient la table 'LesclientTab'
  AjouterClientdanslaBDModel.create(req.body)
    .then(LeclientTab => res.json(LeclientTab))// "LesclientTab : cest la nouvel table qu'il creer rans la base de donne" ce quon a mis dans le module en bas rappele vous
    .catch(err => res.json(err))
})//recuere tous les enregistrements de la base de données
app.get("/lesclients", (req, res) => {//afficher la liste de nos enregistrement
  AjouterClientdanslaBDModel.find({})
    .then(LeclientTabs => res.json(LeclientTabs))
    .catch(err => res.json(err))
})//recupere par id 
app.get("/recupparidclient/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterClientdanslaBDModel.findById({ _id: id })
    .then(LeclientTabs => res.json(LeclientTabs))
    .catch(err => res.json(err))
})//pour modifier on ajoute le put 
app.put("/Metajourlerecuperer/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterClientdanslaBDModel.findByIdAndUpdate({ _id: id }, {
    nameid: req.body.nameid,
    name: req.body.name,
    adresse: req.body.adresse,
    dateajout: req.body.dateajout,
    numero: req.body.numero,
    selectionne: req.body.selectionne,
    avocat: req.body.avocat,
  })
    .then(LeclientTabs => res.json(LeclientTabs))
    .catch(err => res.json(err))
})//pour suprimer un element 
app.delete("/deleteclient/:id", (req, res) => {
  const id = req.params.id
  AjouterClientdanslaBDModel.findByIdAndDelete({ _id: id })
    .then(LeclientTabs => res.json(LeclientTabs))
    .catch(err => res.json(err))
})


//le multer ----------------------------------------------------------------------------

const multer = require('multer')//importation de multer dans notre projet
//const upload = multer({ dest: './files' })//chemin ou les fichiers serons stocké apres envoi donc jai cree un dossier files dans le dossier du serveur
//creeon maintenant les api post et gets // 
// 'GestAjoutSubassementdanslaDB2' on va lui metre dans axions de front //upload.single('tu me le nom du variable que tu a mis dans ton coté client moi jai mis fichier au lieu de file')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {//destination est utilisé pour déterminer dans quel dossier les fichiers téléchargés doivent être stocké. 
    cb(null, './files')
  },
  filename: function (req, file, cb) {//utilisé pour déterminer le nom du fichier à l’intérieur du dossier. Si no est donné, chaque fichier recevra un nom aléatoire qui ne le fait pas inclure n’importe quelle extension de fichier
    const uniqueSuffix = Date.now()
    cb(null, uniqueSuffix + file.originalname)//donc le nom du fochier aura son nom original sur le doc avec date et lheur actuel
  }
})

require("./Model/pdfDetails") // importation du fichier du schema le modele son nom
const PdfSchema = mongoose.model("PdfDetails")//creons une varible puis importon le schema et meton le dans la vari
const upload = multer({ storage: storage })//enfi on a transferer storage comme variable maintenant

app.post("/upload-files", upload.single('file'), async (req, res) => {//creons le model dans le serveur donc la route qui contient la table 'LesclientTab'
  console.log(req.file)

  const titre = req.body.titre //le bd recup le titre
  const detail = req.body.detail //le bd recup le titre
  const dateajout = req.body.dateajout //le bd recup le titre
  const recepteur = req.body.recepteur //

  const fileName = req.file.filename//la bd recupere le nom  de notre fichier pdf en ajoutant autre caractere pour oublié les doublure

  try {
    await PdfSchema.create({ titre: titre, detail: detail, recepteur: recepteur, dateajout: dateajout, pdf: fileName })
    res.send({ status: "ok" })
  } catch (error) {
    res.json({ status: error })
  } //configuration sur les fichiers

})

app.get("/get-files", async (req, res) => {//afficher la liste de nos enregistrement
  try {
    PdfSchema.find({}).then((data) => {//trouv toutes les donées a l'interieur de cette table
      res.send({ status: 'ok', data: data })// puis tu me les envoie
    })
  } catch (error) { }
})

//fin multer pour les fichiers-----------------------------------------------
//------------------suprimer un fichier
app.delete("/deletesubassemen/:id", (req, res) => {
  const id = req.params.id

  PdfSchema.findByIdAndDelete({ _id: id })
    .then(PdfDetails => res.json(PdfDetails))
    .catch(err => res.json(err))
})
//recupere par id  "useEffect" dans la liste
app.get("/recupparidsubassemen/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  PdfSchema.findById({ _id: id })
    .then(PdfDetails => res.json(PdfDetails))
    .catch(err => res.json(err))
})
//pour modifier on ajoute le put "chemin de mise a jour (e)" //prendre par id e laficher dans un formulaire pou la modif
app.put("/Metajourlerecuperersubassemen/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  PdfSchema.findByIdAndUpdate({ _id: id }, {
    titre: req.body.titre,
    detail: req.body.detail,
    recepteur: req.body.recepteur,
    dateajout: req.body.dateajout,
    fileName: req.body.fileName,
  })
    .then(PdfDetails => res.json(PdfDetails))
    .catch(err => res.json(err))
})



//Les messages -------------------------------------------------------

app.post("/GestAjoutmessagedanslaDB", (req, res) => {
  AjouterMessagedanslaBDModel.create(req.body)
    .then(LesMessages => res.json(LesMessages))
    .catch(err => res.json(err))
})

app.get("/lesmessagess", (req, res) => {
  AjouterMessagedanslaBDModel.find({})
    .then(LesMessages => res.json(LesMessages))
    .catch(err => res.json(err))
})

app.get("/recupparidMessage/:id", (req, res) => {
  const id = req.params.id
  AjouterMessagedanslaBDModel.findById({ _id: id })
    .then(LesMessages => res.json(LesMessages))
    .catch(err => res.json(err))
})

app.put("/MetajourlerecupererMessage/:id", (req, res) => {
  const id = req.params.id
  AjouterMessagedanslaBDModel.findByIdAndUpdate({ _id: id }, {
    name: req.body.name,
    dateajout: req.body.dateajout,
    afaire: req.body.afaire,
    repondre: req.body.repondre,
    recepteur: req.body.recepteur,
  })
    .then(LesMessages => res.json(LesMessages))
    .catch(err => res.json(err))
})
app.delete("/deletemessages/:id", (req, res) => {
  const id = req.params.id
  AjouterMessagedanslaBDModel.findByIdAndDelete({ _id: id })
    .then(LesMessages => res.json(LesMessages))
    .catch(err => res.json(err))
})
//__________________________________________________________________________





//-----------------------------------------audience

app.post("/GestAjoutaudiencedanslaDB", (req, res) => {
  AjouterAudiencedanslaBDModel.create(req.body)
    .then(LesAudiences => res.json(LesAudiences))
    .catch(err => res.json(err))
})//recup la liste des audience
app.get("/lesaudiencess", (req, res) => {//afficher la liste de nos enregistrement
  AjouterAudiencedanslaBDModel.find({})
    .then(LesAudiences => res.json(LesAudiences))
    .catch(err => res.json(err))
})// ici on ne travaillera qu'avec le formulaire de mise a jour "pour recuperer et modifier puis stocker"
//recupere par id  "useEffect" dans la liste le formulaire apar ou serons les autre champs pour modifier sa amene les doné dans se formulaire et modifier
app.get("/recupparidAudience/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterAudiencedanslaBDModel.findById({ _id: id })
    .then(LesAudiences => res.json(LesAudiences))
    .catch(err => res.json(err))
})//pour modifier on ajoute le put "chemin de mise a jour (e)" 
//en clican sur le bouton modifier sur la liste il nous dirrigera vers useeffet qui est aussi dans c formulaire 
// apres modica dans le formulaire il stock puis il remet la nouvel dans la liste//
//prendre par id e laficher dans un formulaire pou la modif
app.put("/MetajourlerecupererAudience/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterAudiencedanslaBDModel.findByIdAndUpdate({ _id: id }, {
    name: req.body.name,
    nameau: req.body.nameau,
    dateajout: req.body.dateajout,
    rapport: req.body.rapport,
    afaire: req.body.afaire,
    nature: req.body.nature,
  })
    .then(LesAudiences => res.json(LesAudiences))
    .catch(err => res.json(err))
})//supprimerdossier
app.delete("/deleteaudience/:id", (req, res) => {
  const id = req.params.id
  AjouterAudiencedanslaBDModel.findByIdAndDelete({ _id: id })
    .then(LesAudiences => res.json(LesAudiences))
    .catch(err => res.json(err))
})
//________________________________________________________________________________________


//--------------------------------------------------dossiers

app.post("/GestAjoutDossierdanslaDB", (req, res) => {
  AjouterDossierdanslaBDModel.create(req.body)
    .then(LesDossiers => res.json(LesDossiers))
    .catch(err => res.json(err))
})//recupere la liste des dossiers
app.get("/lesdossierss", (req, res) => {//afficher la liste de nos enregistrement
  AjouterDossierdanslaBDModel.find({})
    .then(LesDossiers => res.json(LesDossiers))
    .catch(err => res.json(err))
})
//recupere par id  "useEffect" dans la liste affiche formlair mise a jour
app.get("/recupparidDossier/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterDossierdanslaBDModel.findById({ _id: id })
    .then(LesDossiers => res.json(LesDossiers))
    .catch(err => res.json(err))
})//pour modifier on ajoute le put "chemin de mise a jour (e)" //prendre par id e laficher dans un formulaire pou la modif
app.put("/MetajourlerecupererDossier/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterDossierdanslaBDModel.findByIdAndUpdate({ _id: id }, {
    clientid: req.body.clientid,
    juridiction: req.body.juridiction,
    avocatquisuit: req.body.avocatquisuit,
    degredudoss: req.body.degredudoss,
    rg: req.body.rg,
    categorie: req.body.categorie,
    partiadverse: req.body.partiadverse,
    descriptioncas: req.body.descriptioncas,
    statutdoc: req.body.statutdoc,
    dateajout: req.body.dateajout,
    jugechambre: req.body.jugechambre,

    autreAvocat: req.body.autreAvocat,
    autreCategorie: req.body.autreCategorie,


 
  })
    .then(LesDossiers => res.json(LesDossiers))
    .catch(err => res.json(err))
})//supprimerdossier // formulaire de la liste on supprime laba
app.delete("/deletedossier/:id", (req, res) => {
  const id = req.params.id
  AjouterDossierdanslaBDModel.findByIdAndDelete({ _id: id })
    .then(LesDossiers => res.json(LesDossiers))
    .catch(err => res.json(err))
})
//_____________________________________________________


//-----------------------comptabilité entrer sortie--------------

app.post("/GestAjoutfluxdanslaDB", (req, res) => {
  AjouterFluxdanslaBDModel.create(req.body)
    .then(Lecentrersorties => res.json(Lecentrersorties))
    .catch(err => res.json(err))
})
//recup la liste 
app.get("/lesflux", (req, res) => {
  AjouterFluxdanslaBDModel.find({})
    .then(Lecentrersorties => res.json(Lecentrersorties))
    .catch(err => res.json(err))
})
app.get("/recupparidFlux/:id", (req, res) => {//afficher un  enregistrement a traver son identifiant 
  const id = req.params.id
  AjouterFluxdanslaBDModel.findById({ _id: id })
    .then(Lecentrersorties => res.json(Lecentrersorties))
    .catch(err => res.json(err))
})

app.put("/MetajourlerecupererFlux/:id", (req, res) => {//apres affichage d'un element il permet la modification et mise a jour
  const id = req.params.id
  AjouterFluxdanslaBDModel.findByIdAndUpdate({ _id: id }, {
    clientid: req.body.clientid,
    enregistrant: req.body.enregistrant,
    libelle: req.body.libelle,
    dateajout: req.body.dateajout,
    nature: req.body.nature,
    montant: req.body.montant,
  })
    .then(Lecentrersorties => res.json(Lecentrersorties))
    .catch(err => res.json(err))
})
app.delete("/deleteflux/:id", (req, res) => {
  const id = req.params.id
  AjouterFluxdanslaBDModel.findByIdAndDelete({ _id: id })
    .then(Lecentrersorties => res.json(Lecentrersorties))
    .catch(err => res.json(err))
})


//-------------------------------------------------

//------------------------------------------------avocats

app.post("/GestAjoutAvocatdanslaDB", (req, res) => {
  AjouterAvocatdanslaBDModel.create(req.body)
    .then(LesAvocats => res.json(LesAvocats))
    .catch(err => res.json(err))
})//recupere la liste des avocats
app.get("/lesavocatss", (req, res) => {//afficher la liste de nos enregistrement
  AjouterAvocatdanslaBDModel.find({})
    .then(LesAvocats => res.json(LesAvocats))
    .catch(err => res.json(err))
})//recupere par id  "useEffect" dans la liste
app.get("/recupparidAvocat/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterAvocatdanslaBDModel.findById({ _id: id })
    .then(LesAvocats => res.json(LesAvocats))
    .catch(err => res.json(err))
})//pour modifier on ajoute le put "chemin de mise a jour (e)" //prendre par id e laficher dans un formulaire pou la modif
app.put("/MetajourlerecupererAvocat/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterAvocatdanslaBDModel.findByIdAndUpdate({ _id: id }, {
    name: req.body.name,
    adresse: req.body.adresse,
    email: req.body.email,
    numero: req.body.numero,
    avocat: req.body.avocat,
  })
    .then(LesAvocats => res.json(LesAvocats))
    .catch(err => res.json(err))
})//pour suprimer un element 
app.delete("/deleteavocat/:id", (req, res) => {
  const id = req.params.id
  AjouterAvocatdanslaBDModel.findByIdAndDelete({ _id: id })
    .then(LesAvocats => res.json(LesAvocats))
    .catch(err => res.json(err))
})
//_______________________________________________________________

//______________________Rendez-vous et rappel____________________
app.post("/GestAjoutrendezvousdanslaDB", (req, res) => {
  AjouterRendezvousdanslaBDModel.create(req.body)
    .then(Lecrendezvous => res.json(Lecrendezvous))
    .catch(err => res.json(err))
})
//recupere la liste des avocats
app.get("/lesrendevous", (req, res) => {//afficher la liste de nos enregistrement
  AjouterRendezvousdanslaBDModel.find({})
    .then(Lecrendezvous => res.json(Lecrendezvous))
    .catch(err => res.json(err))
  })//recupere par id  "useEffect" dans la liste
  app.delete("/deleterendez/:id", (req, res) => {
    const id = req.params.id
    AjouterRendezvousdanslaBDModel.findByIdAndDelete({ _id: id })
      .then(Lecrendezvous => res.json(Lecrendezvous))
      .catch(err => res.json(err))
  })
 
  
  //______________________________Programme________________________________________---

  app.post("/GestAjoutprogrammedanslaDB", (req, res) => {
    AjouterProgrammedanslaBDModel.create(req.body)
      .then(Leprogramm => res.json(Leprogramm))
      .catch(err => res.json(err))
  })
//recupere la liste des avocats
app.get("/lesprogramme", (req, res) => {//afficher la liste de nos enregistrement
  AjouterProgrammedanslaBDModel.find({})
    .then(Leprogramm => res.json(Leprogramm))
    .catch(err => res.json(err))
  })//recupere par id  "useEffect" dans la liste
//recupere par id  "useEffect" dans la liste
app.get("/recupparidProgramme/:id", (req, res) => {//afficher la liste de nos enregistrement
  const id = req.params.id
  AjouterProgrammedanslaBDModel.findById({ _id: id })
    .then(Leprogramm => res.json(Leprogramm))
    .catch(err => res.json(err))
})
  app.put("/MetajourlerecupererProgramme/:id", (req, res) => {//afficher la liste de nos enregistrement
    const id = req.params.id
    AjouterProgrammedanslaBDModel.findByIdAndUpdate({ _id: id }, {
      
      numerodoss:req.body.numerodoss,
      juge:req.body.juge,
      juridiction:req.body.juridiction,
      date:req.body.date,
      parties:req.body.parties,
      natureAffaire:req.body.natureAffaire,
      dateRenvoi:req.body.dateRenvoi,
      responsable:req.body.responsable,
      motifRenvoi:req.body.motifRenvoi ,
    })
      .then(Leprogramm => res.json(Leprogramm))
      .catch(err => res.json(err))
  })
  app.delete("/deleteprogramme/:id", (req, res) => {
    const id = req.params.id
    AjouterProgrammedanslaBDModel.findByIdAndDelete({ _id: id })
      .then(Leprogramm => res.json(Leprogramm))
      .catch(err => res.json(err))
  })
 


  //---------------pour les notifiction mil----------------------------------

  
  //________________________________________________________________________


app.listen(PORT, () => {
  console.log(` le serveur es lancé a ${PORT}`)
})
