// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
var oPersonnageDB = require('./Personnage_BD');
var oUtilisateur = require('../model/object/Utilisateur');




/**
 * UTILISATEUR : COMMUNICATION SERVEUR <-> BD
 * 
 * @class Utilisateur_BD
 */
function Utilisateur_BD() {
	if (false === (this instanceof Utilisateur_BD)) {
		return new Utilisateur_BD();
	}
};

/**
 * ENVOI UN UTILISATEUR POUR METTRE A JOUR CES PROPRIETES
 * 
 * @method SetUtilisateur
 */
Utilisateur_BD.SetUtilisateur = function(utilisateurToSave) {
	
},

/**
 * RENVOIE UN UTILISATEUR AVEC SON ID PASSE EN PARAMETRE
 * 
 * @method GetUtilisateur
 */
Utilisateur_BD.GetUtilisateur = function(idUtilisateur) {
	
	var Utilisateurmodel = mongoose.model('Utilisateur'); 
	var queryU = Utilisateurmodel.find({_id : idUtilisateur});
	
	queryU.exec(function (err, NewUser) {
	if (err)  throw err;
	
	return oUtilisateur(
		NewUser._id,NewUser.pseudo,NewUser.email,NewUser.pass,
		NewUser.nbrMeurtres,NewUser.nbrMeurtresCumule,
		NewUser.nbrFoisTue,NewUser.nbrFoisTueCumule,
		NewUser.numEquipe,NewUser.personnage);
	});
	


},

/**
 * AJOUTE UN UTILISATEUR DANS LA BASE DE DONNEES
 * Renvoi le user si inscription ok
 * Renvoi 0 si erreur
 * Renvoi -1 si pseudo deja pris
 * Renvoi -2 si email deja pris
 * @method Inscription
 */

 
 Utilisateur_BD.Inscription = function(pseudoU,emailU,passU){
 
	
	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	
	var NewUser = new Utilisateurmodel();
	var userExiste = true;
	var mailExiste = true;
	
	
	
	var queryU = Utilisateurmodel.find({pseudo : pseudoU});
	queryU.limit(1);
	
	queryU.exec(function (err, testuseru) {
	if (err)  throw err; 

	if(testuseru[0])
		userExiste = true;
	else
		userExiste = false;
	
	
	queryU = Utilisateurmodel.find({email : emailU});
	queryU.limit(1);
	queryU.exec(function (err, testuseru) {
	if (err)  throw err; 
	
	if(testuseru[0])
		mailExiste = true;
	else
		mailExiste = false;
	

	if (userExiste)	
		return -1;
	else if(mailExiste)
		return -2;
	else
	{	
		NewUser.pseudo = pseudoU;
		NewUser.pass = passU;
		NewUser.email = emailU;
		NewUser.nbrMeurtres = 0;
		NewUser.nbrMeurtresCumule = 0;
		NewUser.nbrFoisTue = 0;
		NewUser.nbrFoisTueCumule = 0;
		NewUser.numEquipe = 0;
		
		
		
		NewUser.save(function (err) {
			if (err) { throw err; }
			console.log('tu es dans la base maintenant Motherfuker !');
			
			});
		
	var PersonnageModel = mongoose.model('Personnage');
	var NewPerso = new PersonnageModel();
	
	NewPerso = oPersonnageDB.Creation(0,0,0,0,0,"");
	console.log(NewPerso._id );
	NewUser.presonnage = NewPerso._id;
	
	NewUser.save(function (err) {
		if (err) { throw err; }
		console.log('fini boy <3 !');
		});
	
	}
	
	
		});
	

	});
		
		return oUtilisateur(
		NewUser._id,NewUser.pseudo,NewUser.email,NewUser.pass,
		NewUser.nbrMeurtres,NewUser.nbrMeurtresCumule,
		NewUser.nbrFoisTue,NewUser.nbrFoisTueCumule,
		NewUser.numEquipe,NewUser.personnage);
 },
 
 
 
 /**
 *	Renvoi 1 si le pseudo n'existe pas, 2 si le mot de passe ne coresspond pas au pseudo et 0 si tout est en règle 
 * Renvoi 1 si conexion ok
 * Renvoi 0 si erreur
 * Renvoi -1 si le password ne corespond pas
 * @method Connexion
 */
 
 Utilisateur_BD.Connexion = function (pseudoU,passU){
 
	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	
	var NewUser = new Utilisateurmodel();
	
	var queryU = Utilisateurmodel.find({pseudo : pseudoU});
	
	var etat = 0;
	
	queryU.exec(function (err, testuseru) {
	if (err)  throw err;
	
	console.log(testuseru[0]);
	if (testuseru[0] && testuseru[0].pass === passU)
		etat = 1;
	else
		etat = -1;
		
	
	console.log(etat);
		
	return etat;
	});
	
	
 
 },
 
 
 

 
 module.exports = Utilisateur_BD;