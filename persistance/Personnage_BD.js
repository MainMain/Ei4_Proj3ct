// includes
var oItem_BD = require('./Item_BD'); // devrait disparaitre...
var oPersonnage = require('../model/Object/Personnage');
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
var oUtilisateur_BD = require('./Utilisateur_BD');
var oUtilisateur = require('../model/object/Utilisateur');


/**
 * PERSONNAGES : COMMUNICATION SERVEUR <-> BD
 *
 * @class Personnage_BD
 */
function Personnage_BD() {
    if (false === (this instanceof Personnage_BD)) {
        return new Personnage_BD();
    }
};


/**
 * ENVOIE UN PERSONNAGE POUR METTRE A JOUR CES PROPRIETES
 *
 * @method SetPersonnage
 */
Personnage_BD.SetPersonnage = function (personnageToSave, callbackSetPersonnage)
{
    var PersonnageModel = mongoose.model('Personnage');
    var nouveauPerso = PersonnageModel();

    PersonnageModel.find({
        _id: personnageToSave.id
    }, function (err, perso) {
        if (err) {
            console.log("PERSONNAGE_BD : SetPersonnage() : erreur ! ");
            throw err;
        }

        if (typeof perso[0] === "undefined") {
            console.log("PERSONNAGE_BD : SetPersonnage() : undefined ! ");
            callbackSetPersonnage(-1);
        } 
        else 
        {
            var idArme = 0,
                idArmure = 0;
            // si pas d'arme équipée
            if (personnageToSave.armeEquipee == null)
                idArme = null;
            else
                idArme = personnageToSave.armeEquipee.id;
            // si pas d'amure d'équipée
            if (personnageToSave.armureEquipee == null)
                idArmure = null;
            else
                idArmure = personnageToSave.armureEquipee.id;
            
            PersonnageModel.update({_id: personnageToSave.id}, 
            {
                    ptSante: 			personnageToSave.ptSante,
                    ptSanteMax: 		personnageToSave.ptSanteMax,
                    ptAction: 			personnageToSave.ptActions,
                    ptActionMax: 		personnageToSave.ptActionsMax,
                    ptDeplacement: 		personnageToSave.ptDeplacement,
                    ptDeplacementMax: 	personnageToSave.ptDeplacementMax,
            		ptFaim : 			personnageToSave.ptFaim,
            		ptFaimMax : 		personnageToSave.ptFaimMax,
                    poidsMax: 			personnageToSave.poidsMax,
                    gouleLimite: 		personnageToSave.goulesMax,
                    competence: 		personnageToSave.competence,
                    idSalleEnCours: 	personnageToSave.idSalleEnCours,
                    mode : 				personnageToSave.mode,
            		multiPtsAttaque : 	personnageToSave.multiPtsAttaque,
            		multiPtsDefense : 	personnageToSave.multiPtsDefense,
            	    multiProbaCache : 	personnageToSave.multiProbaCache,
            	    multiProbaFouille : personnageToSave.multiProbaFouille,
                    idArmeEquipee: 		idArme,
                    idArmureEquipee: 	idArmure,
                    sacADos: 			personnageToSave.sacADos,		
                    dernierMvt : 		personnageToSave.dernierMvt,
            		listeMsgAtt : 		personnageToSave.listeMsgAtt,
            		nbrNvMsg : 			personnageToSave.nbrNvMsg,
                },
                function (err) 
                {
                    if (err)
                    {
                        throw err;
                    }
					
                    console.log("PERSONNAGE_BD : Mis à jour du personnage : ["+personnageToSave.id+"]");
					callbackSetPersonnage(1);
                }
            );
        }

    });
},

/**
 * ENVOIE UN ID DE USER ET RETOURNE LE PERSO CORRESPONDANT
 * retourn -1 si l'utilisateur n'est pas trouvé
 * retourn -2 si le personnage n'est pas trouvé
 * retourn un personnage si tout est ok
 * @method GetPersonnageByIdUser
 */
Personnage_BD.GetPersonnageByIdUser = function (idUtilisateur, callbackGetPersonnageByIdUser) {
    // renvoi un personnage selon l'id passé en paramètre

    var PersonnageModel = mongoose.model('Personnage');
    var Utilisateurmodel = mongoose.model('Utilisateur');

    Utilisateurmodel.find({
        _id: idUtilisateur
    }, function (err, user) {
        if (err) {
            console.log("PERSONNAGE_BD : GetPersonnage() : erreur ! ");
            throw err;
        }
        if (typeof user[0] === "undefined") {
            console.log("PERSONNAGE_BD : GetPersonnage() : pas trouvé l'user ! ");
            callbackGetPersonnageByIdUser(idUtilisateur, -1);
        } else {
            PersonnageModel.find({_id: user[0].personnage}, function (err, perso) 
            {
                
                if (err) {
                    console.log("PERSONNAGE_BD : GetPersonnage() : erreur ! ");
                    throw err;
                }

                if (typeof perso[0] === "undefined") {
                    console.log("PERSONNAGE_BD : GetPersonnage() : pas trouvé le perso ! ");
                    callbackGetPersonnageByIdUser(idUtilisateur, -2);

                } else {
                    console.log("PERSONNAGE_BD : Chargement du personnage : ["+perso[0].id+"]");
                    //console.log('PERSONNAGE_BD : id salle perso récupéré : ' + perso[0].idSalleEnCours);
                    // conversion des id "ArmeEquipee" et "ArmureEquipee" en objet
                    var arme = null, armure = null;
					//console.log("idArmeEquipee = " + perso[0].idArmeEquipee);
                    if (perso[0].idArmeEquipee != null)
                    	 arme = oItem_BD.GetItemById(perso[0].idArmeEquipee);
                    if (perso[0].idArmureEquipee != null)
                   	 armure	 = oItem_BD.GetItemById(perso[0].idArmureEquipee);
                    callbackGetPersonnageByIdUser(idUtilisateur, new oPersonnage(
                        perso[0].id, 				perso[0].ptSante, 			perso[0].ptSanteMax,
                        perso[0].ptAction,		 	perso[0].ptActionMax, 		perso[0].ptDeplacement,
                        perso[0].ptDeplacementMax,	perso[0].ptFaim,			perso[0].ptFaimMax,
                        perso[0].poidsMax, 			perso[0].gouleLimite,
                        perso[0].competence, 		perso[0].idSalleEnCours, 	perso[0].mode, 
                        perso[0].multiPtsAttaque,  	perso[0].multiPtsDefense,  	perso[0].multiProbaCache,  
                        perso[0].multiProbaFouille, arme,						armure,
                        perso[0].sacADos,			perso[0].dernierMvt,		perso[0].listeMsgAtt,
                        perso[0].nbrNvMsg));
                }
            });
        }
    });
},

/**
 * CREER UN PERSONNAGE A LA CREATION DE L'UTILISATEUR
 * retourn le personage si le perso est bien créé
 *
 * @method Creation
 */
Personnage_BD.Creation = function (id) 
{
	var a = 0;
	a = a / 0;
    var PersonnageModel = mongoose.model('Personnage');
    var Perso = new PersonnageModel();

    var nvPerso = new oPersonnage(0);
    nvPerso.initialiser();
    
    Perso.ptSanteMax		= nvPerso.ptSanteMax;
    Perso.ptSante 			= nvPerso.ptSante;
    Perso.ptAction 			= nvPerso.ptAction;
    Perso.ptActionMax 		= nvPerso.ptActionMax;
    Perso.ptDeplacement 	= nvPerso.ptDeplacement;
    Perso.ptDeplacementMax 	= nvPerso.ptDeplacementMax;
    Perso.ptFaim		 	= nvPerso.ptFaim;
    Perso.ptFaimMax		 	= nvPerso.ptFaimMax;
    Perso.poidsMax 			= nvPerso.poidsMax;
    Perso.gouleLimite 		= nvPerso.gouleLimite;
    Perso.competence 		= nvPerso.competence;
    Perso.sacADos 			= nvPerso.sacADos;
    Perso.idSalleEnCours 	= nvPerso.idSalleEnCours;
    Perso.mode 				= nvPerso.mode;
    Perso.multiPtsAttaque 	= nvPerso.multiPtsAttaque;
    Perso.multiPtsDefense 	= nvPerso.multiPtsDefense;
    Perso.multiProbaCache 	= nvPerso.multiProbaCache;
    Perso.multiProbaFouille = nvPerso.multiProbaFouille;
    Perso.idArmeEquipee 	= nvPerso.idArmeEquipee;
    Perso.idArmureEquipee 	= nvPerso.idArmureEquipee;
    Perso.dernierMvt 		= nvPerso.dernierMvt;
    Perso.listeMsgAtt 		= nvPerso.listeMsgAtt;
    Perso.nbrNvMsg			= nvPerso.nbrNvMsg;
    
    console.log("----------------> sdsdfsf : " +   nvPerso.mode);

    Perso.save(function (err) {
        if (err) {
            throw err;
        }
        
        console.log('BASE DE DONNEES : Creation de personnage réussie !');

    });
    return Perso;
},


module.exports = Personnage_BD;
