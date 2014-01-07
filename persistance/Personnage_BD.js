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

// **** EXEMPLE CREATION PERSONNGE ***

// var sacADos = [oItem_BD.GetItemById(9), oItem_BD.GetItemById(10),
// oItem_BD.GetItemById(11)];
// var myPerso = new oPersonnage(10, 100, 100, 20, 25, 10, 15, 100, 3, 0,
// "chasseur", null, null, sacADos);

// ***********************************

/**
 * ENVOIE UN PERSONNAGE POUR METTRE A JOUR CES PROPRIETES
 *
 * @method SetPersonnage
 */

/*Personnage_BD.SetPersonnage = function(personnageToSave,callbackSetPersonnage) {
	
	var PersonnageModel = mongoose.model('Personnage');
	
	PersonnageModel.findOneAndUpdate({_id : personnageToSave.id},{	ptSante : personnageToSave.ptSante,
																	ptSanteMax : personnageToSave.ptSanteMax,
																	Action : personnageToSave.ptActions,
																	ActionMax : personnageToSave.ptActionsMax,
																	ptDeplacement : personnageToSave.ptDeplacement,
																	ptDeplacementMax : personnageToSave.ptDeplacementMax,
																	poidsMax : personnageToSave.poidsMax,
																	gouleLimite : personnageToSave.goulesMax,
																	competence : personnageToSave.competence,
																	idSalleEnCours : personnageToSave.idSalleEnCours,
																	idArmeEquipee : personnageToSave.armeEquipee,
																	idArmureEquipee : personnageToSave.armureEquipee,
																	sacADos : personnageToSave.sacADos,});
	
PersonnageModel.findOne({_id : personnageToSave.id}, function(err,perso)
	{
		if (err)  
		{
			throw err;
		}
		
		if (typeof perso[0] === "undefined")
		{
			callbackSetPersonnage(-1)
		}
		else
		{	
			//perso._id = personnageToSave.id;
			ptSante : personnageToSave.ptSante,
			ptSanteMax : personnageToSave.ptSanteMax,
			Action : personnageToSave.ptActions,
			ActionMax : personnageToSave.ptActionsMax,
			ptDeplacement : personnageToSave.ptDeplacement,
			ptDeplacementMax : personnageToSave.ptDeplacementMax,
			poidsMax : personnageToSave.poidsMax,
			gouleLimite : personnageToSave.goulesMax,
			competence : personnageToSave.competence,
			idSalleEnCours : personnageToSave.idSalleEnCours,
			idArmeEquipee : personnageToSave.armeEquipee,
			idArmureEquipee : personnageToSave.armureEquipee,
			sacADos : personnageToSave.sacADos,
			console.log('Le personnage a bien été modifié');
			perso.save(function (err)
			{
				if (err)
				{
					throw err;
				}
				callbackSetPersonnage(new oPersonnage(
					perso._id,perso.ptSante,perso.ptSanteMax,
					perso.ptAction,perso.ptActionMax,perso.ptDeplacement,
					perso.ptDeplacementMax,perso.poidsMax,perso.gouleLimite,
					perso.competence,perso.idSalleEnCours,perso.idArmeEquipee,
					perso.idArmureEquipee,perso.sacADos));
			});
		}
			
	});*/
	

Personnage_BD.SetPersonnage = function (personnageToSave, callbackSetPersonnage) {

    console.log("PERSONNAGE_BD : id du perso : " + personnageToSave.id);
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
            //callbackSetPersonnage(-1)
        } else {
            console.log("PERSONNAGE_BD : SetPersonnage() : personnage trouvé dans la BD ! ");

            var idArme = 0,
                idArmure = 0;
            // si pas d'arme équipée
            if (personnageToSave.armeEquipee == null)
                idArme = null;
            else
                idArme = personnageToSave.armeEquipee.id;
            // si pas d'amur d'équipée
            if (personnageToSave.armureEquipee == null)
                idArmure = null;
            else
                idArmure = personnageToSave.armureEquipee.id;

            console.log("PERSONNAGE_BD : SetPersonnage() : id :  " + personnageToSave.id);
       
            PersonnageModel.update({
                    _id: personnageToSave.id
                }, {
                    ptSante: personnageToSave.ptSante,
                    ptSanteMax: personnageToSave.ptSanteMax,
                    ptAction: personnageToSave.ptActions,
                    ptActionMax: personnageToSave.ptActionsMax,
                    ptDeplacement: personnageToSave.ptDeplacement,
                    ptDeplacementMax: personnageToSave.ptDeplacementMax,
                    poidsMax: personnageToSave.poidsMax,
                    gouleLimite: personnageToSave.goulesMax,
                    competence: personnageToSave.competence,
                    idSalleEnCours: personnageToSave.idSalleEnCours,
                    mode : personnageToSave.mode,
            		multiPtsAttaque : personnageToSave.multiPtsAttaque,
            		multiPtsDefense : personnageToSave.multiPtsDefense,
            	    multiProbaCache : personnageToSave.multiProbaCache,
            	    multiProbaFouille : personnageToSave.multiProbaFouille,
                    idArmeEquipee: idArme,
                    idArmureEquipee: idArmure,
                    sacADos: personnageToSave.sacADos,
                },
                function (err) {
                    if (err) {
                        throw err;
                    }
                    console.log('Pseudos modifiés !');
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



    // / *** POUR TESTER COTE SERVEUR ****
    //var sacADos = [ oItem_BD.GetItemById(9), oItem_BD.GetItemById(10),
    //	oItem_BD.GetItemById(11) ];
    //var myPerso = new oPersonnage(10, 100, 100, 20, 25, 10, 15, 100, 0, null,
    //	null, sacADos);
    //console.log("PERSONNAGE_BD : Renvoi du personnage - Demande par id user");
    //return myPerso;
    // //////////////////////////////////

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
            callbackGetPersonnageByIdUser(-1);
        } else {
            PersonnageModel.find({_id: user[0].personnage}, function (err, perso) 
            {
            	console.log("PERSONNAGE_BD : ID user[0].id : " + user[0].id);
            	console.log("PERSONNAGE_BD : ID user[0].pseudo : " + user[0].pseudo);
                console.log("PERSONNAGE_BD : ID user[0].personnage : " + user[0].personnage);
                
                if (err) {
                    console.log("PERSONNAGE_BD : GetPersonnage() : erreur ! ");
                    throw err;
                }

                if (typeof perso[0] === "undefined") {
                    console.log("PERSONNAGE_BD : GetPersonnage() : pas trouvé le perso ! ");
                    callbackGetPersonnageByIdUser(-2);

                } else {
                    console.log('PERSONNAGE_BD : id perso récupéré : ' + perso[0].id);
                    console.log('PERSONNAGE_BD : id salle perso récupéré : ' + perso[0].idSalleEnCours);
                    // conversion des id "ArmeEquipee" et "ArmureEquipee" en objet
                    var arme = null, armure = null;
                    if (perso[0].idArmeEquipee != null)
                    	 arme = oItem_BD.GetItemById(perso[0].idArmeEquipee);
                    if (perso[0].idArmureEquipee != null)
                   	 armure	 = oItem_BD.GetItemById(perso[0].idArmureEquipee);
                    callbackGetPersonnageByIdUser(new oPersonnage(
                        perso[0].id, perso[0].ptSante, perso[0].ptSanteMax,
                        perso[0].ptAction, perso[0].ptActionMax, perso[0].ptDeplacement+30,
                        perso[0].ptDeplacementMax, perso[0].poidsMax, perso[0].gouleLimite,
                        perso[0].competence, perso[0].idSalleEnCours, perso[0].mode, 
                        perso[0].multiPtsAttaque,  perso[0].multiPtsDefense,  perso[0].multiProbaCache,  perso[0].multiProbaFouille, 
                        arme,armure, perso[0].sacADos));
                }
            });
        }
    });
},


/**
 * ENVOIE UN ID DE PERSONNAGE ET RETOURNE LE PERSO
 * retourn -1 si le personnage n'est pas trouvé
 * retourn un personnage si tout est ok
 * @method GetPersonnageByIdPerso
 */
Personnage_BD.GetPersonnageByIdPerso = function (idPersonnage, callbackGetPersonnageByIdPerso) {

    // renvoi un personnage selon l'id passé en paramètre
    var PersonnageModel = mongoose.model('Personnage');

    PersonnageModel.find({
        _id: idPersonnage
    }, function (err, perso) {
        if (err) {
            throw err;
        }

        if (typeof perso[0] === "undefined") {
            callbackGetPersonnageByIdPerso(-1)
        } else {
            callbackGetPersonnageByIdPerso(new oPersonnage(
                perso._id, perso.ptSante, perso.ptSanteMax,
                perso.ptAction, perso.ptActionMax, (perso.ptDeplacement+30),
                perso.ptDeplacementMax, perso.poidsMax, perso.gouleLimite,
                perso.competence, perso.idSalleEnCours, perso.idArmeEquipee,
                perso.idArmureEquipee, perso.sacADos));
        }

    });

},

/**
 * CREER UN PERSONNAGE A LA CREATION DE L'UTILISATEUR
 * retourn le personage si le perso est bien créer
 *
 * @method Creation
 */
Personnage_BD.Creation = function (vie, action, deplacement, poids, goule, competence) {

    var PersonnageModel = mongoose.model('Personnage');
    var Perso = new PersonnageModel();

    Perso.ptSanteMax = vie;
    Perso.ptSante = vie;
    Perso.ptAction = action;
    Perso.ptActionMax = action;
    Perso.ptDeplacement = deplacement;
    Perso.ptDeplacementMax = deplacement;
    Perso.poidsMax = poids;
    Perso.gouleLimite = goule;
    Perso.competence = competence;
    Perso.sacADos = new Array();
    Perso.idSalleEnCours = 0;
    Perso.mode = 0;
    Perso.multiPtsAttaque = 1;
    Perso.multiPtsDefense = 1;
    Perso.multiProbaCache = 1;
    Perso.multiProbaFouille = 1;
    Perso.idArmeEquipee = null;
    Perso.idArmureEquipee = null;

    Perso.save(function (err) {
        if (err) {
            throw err;
        }
        
        console.log('BASE DE DONNEES : Creation de personnage réussie !');

    });
    return Perso;
},

Personnage_BD.test = function () {
    console.log("TEST");
},


module.exports = Personnage_BD;
