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
	
	console.log("PERSONNAGE_BD : id du perso : " + personnageToSave.id);
	var PersonnageModel = mongoose.model('Personnage');
	var nouveauPerso = PersonnageModel();
	
	PersonnageModel.find({_id : personnageToSave.id}, function(err,perso)
	{
		if (err)  
		{
			console.log("PERSONNAGE_BD : SetPersonnage() : erreur ! ");
			throw err;
		}
		
		if (typeof perso[0] === "undefined")
		{
			console.log("PERSONNAGE_BD : SetPersonnage() : undefined ! ");
			//callbackSetPersonnage(-1)
		}
		else
		{
			console.log("PERSONNAGE_BD : SetPersonnage() : personnage trouvé dans la BD ! ");
			/*nouveauPerso._id = personnageToSave.id;
			nouveauPerso.ptSante = personnageToSave.ptSante; 
			nouveauPerso.ptSanteMax = personnageToSave.ptSanteMax; 
			nouveauPerso.Action = personnageToSave.ptActions; 
			nouveauPerso.ActionMax = personnageToSave.ptActionsMax;
			nouveauPerso.ptDeplacement = personnageToSave.ptDeplacement; 
			nouveauPerso.ptDeplacementMax = personnageToSave.ptDeplacementMax;
			nouveauPerso.poidsMax = personnageToSave.poidsMax; 
			nouveauPerso.gouleLimite = personnageToSave.goulesMax; 
			nouveauPerso.competence = personnageToSave.competence; 
			nouveauPerso.idSalleEnCours = personnageToSave.idSalleEnCours;
			nouveauPerso.idArmeEquipee = personnageToSave.armeEquipee;
			nouveauPerso.idArmureEquipee = personnageToSave.armureEquipee;
			nouveauPerso.sacADos = personnageToSave.sacADos;
			*/
			var idArme = 0, idArmure = 0;
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
			console.log("PERSONNAGE_BD : SetPersonnage() : idArme :  " + idArme);
			PersonnageModel.update({ _id : personnageToSave.id}, 
					{ptSante 			:  personnageToSave.ptSante,
						ptSanteMax 			:  personnageToSave.ptSanteMax, 
						ptAction 			:  personnageToSave.ptActions, 
						ptActionMax 		:  personnageToSave.ptActionsMax, 
						ptDeplacement 		:  personnageToSave.ptDeplacement, 
						ptDeplacementMax 	:  personnageToSave.ptDeplacementMax, 
						poidsMax 			:  personnageToSave.poidsMax,
						gouleLimite 		:  personnageToSave.goulesMax, 
						competence 			:  personnageToSave.competence, 
						idSalleEnCours		:  personnageToSave.idSalleEnCours,
						idArmeEquipee		:  idArme, 
						idArmureEquipee		:  idArmure, 
						sacADos				:  personnageToSave.sacADos,
						},
					 function (err) {
						  if (err) { throw err; }
						  console.log('Pseudos modifiés !');}
					);
					/*
					
					 
				
					}*/
					/*function (err)
					{
						if (err){throw err;}
						console.log('Le personnage a bien été modifié'); 
					}*/
			/*callbackSetPersonnage(new oPersonnage(
				perso._id,perso.ptSante,perso.ptSanteMax,
				perso.ptAction,perso.ptActionMax,perso.ptDeplacement,
				perso.ptDeplacementMax,perso.poidsMax,perso.gouleLimite,
				perso.competence,perso.idSalleEnCours,perso.idArmeEquipee,
				perso.idArmureEquipee,perso.sacADos));*/
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
			console.log("PERSONNAGE_BD : GetPersonnage() : erreur ! ");
			throw err;
		}
		if (typeof user[0] === "undefined")
		{
			console.log("PERSONNAGE_BD : GetPersonnage() : undefined 1 ! ");
			callbackGetPersonnageByIdUser(-1);
		}
		else
		{
			PersonnageModel.find({_id : user[0].presonnage}, function(err,perso)
			{
				console.log("PERSONNAGE_BD : ID user[0].personnage : " +  user[0].presonnage);
				if (err)  
				{
					console.log("PERSONNAGE_BD : GetPersonnage() : erreur ! ");
					throw err;
				}
				
				if (typeof perso[0] === "undefined")
				{
					console.log("PERSONNAGE_BD : GetPersonnage() : undefined 2 ! ");
					callbackGetPersonnageByIdUser(-2);
					
				}
				else
				{
					console.log('PERSONNAGE_BD : id perso récupéré : ' + perso[0].id);
					
					callbackGetPersonnageByIdUser(new oPersonnage(
						perso[0].id					,perso[0].ptSante			,perso[0].ptSanteMax,
						perso[0].ptAction			,perso[0].ptActionMax		,perso[0].ptDeplacement,
						perso[0].ptDeplacementMax	,perso[0].poidsMax			,perso[0].gouleLimite,
						perso[0].competence			,perso[0].idSalleEnCours	,perso[0].idArmeEquipee,
						perso[0].idArmureEquipee	,perso[0].sacADos));
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
Personnage_BD.Creation = function(vie, action, deplacement, poids, goule, competence) {

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
	Perso.idArmeEquipee = 0;
	Perso.idArmureEquipee = 0;

	Perso.save(function(err) {
		if (err) {
			throw err;
		}




		console.log('BASE DE DONNEES : Creation de personnage réussie !');

	});
	return Perso;
},

Personnage_BD.test = function()
{
	console.log("COUCOU");
},


module.exports = Personnage_BD;
