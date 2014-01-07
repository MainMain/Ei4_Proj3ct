// includes
var oItem_BD = require('./Item_BD');
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
Personnage_BD.SetPersonnage = function(personnageToSave,callbackSetPersonnage) {
	
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
	
/*	PersonnageModel.findOne({_id : personnageToSave.id}, function(err,perso)
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
	
},

/**
 * ENVOIE UN ID DE USER ET RETOURNE LE PERSO CORRESPONDANT
 * retourn -1 si l'utilisateur n'est pas trouvé
 * retourn -2 si le personnage n'est pas trouvé
 * retourn un personnage si tout est ok
 * @method GetPersonnageByIdUser
 */
Personnage_BD.GetPersonnageByIdUser = function(idUtilisateur,callbackGetPersonnageByIdUser) {
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
	
	
	Utilisateurmodel.find({_id : idUtilisateur},function (err, user)
	{
		if (err)  
		{
		throw err;
		}
		if (typeof user[0] === "undefined")
		{
			callbackGetPersonnageByIdUser(-1)
		}
		else
		{
			PersonnageModel.find({_id : user[0].personnage}, function(err,perso)
			{
				if (err)  
				{
					throw err;
				}
				
				if (typeof perso[0] === "undefined")
				{
					callbackGetPersonnageByIdUser(-2)
				}
				else
				{
					callbackGetPersonnageByIdUser(new oPersonnage(
						perso._id,perso.ptSante,perso.ptSanteMax,
						perso.ptAction,perso.ptActionMax,perso.ptDeplacement,
						perso.ptDeplacementMax,perso.poidsMax,perso.gouleLimite,
						perso.competence,perso.idSalleEnCours,perso.idArmeEquipee,
						perso.idArmureEquipee,perso.sacADos));
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
Personnage_BD.GetPersonnageByIdPerso = function(idPersonnage,callbackGetPersonnageByIdPerso) {
	
	// renvoi un personnage selon l'id passé en paramètre
	var PersonnageModel = mongoose.model('Personnage');
	
	PersonnageModel.find({_id : idPersonnage}, function(err,perso)
	{
		if (err)  
		{
			throw err;
		}
		
		if (typeof perso[0] === "undefined")
		{
			callbackGetPersonnageByIdPerso(-1)
		}
		else
		{
			callbackGetPersonnageByIdPerso(new oPersonnage(
				perso._id,perso.ptSante,perso.ptSanteMax,
				perso.ptAction,perso.ptActionMax,perso.ptDeplacement,
				perso.ptDeplacementMax,perso.poidsMax,perso.gouleLimite,
				perso.competence,perso.idSalleEnCours,perso.idArmeEquipee,
				perso.idArmureEquipee,perso.sacADos));
		}
			
	});
	
},


/**
 * CREER UN PERSONNAGE A LA CREATION DE L'UTILISATEUR
 * retourn le personage si le perso est bien créer
 * 
 * @method Creation
 */

Personnage_BD.Creation = function(vie, action, deplacement, poids, goule,
		competence) {

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
	Perso.idSalleEnCours = "";
	Perso.idArmeEquipee = "";
	Perso.idArmureEquipee = "";

	Perso.save(function(err) {
		if (err) {
			throw err;
		}




		console.log('BASE DE DONNEES : Creation de personnage réussie !');

	});
	return Perso;
},


module.exports = Personnage_BD;
