// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
<<<<<<< HEAD
var oPresonnage = require('./Personnage_BD');
=======
>>>>>>> 00262bf13d52fde0963dc5a147accb9564d64140

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

},

/**
 * AJOUTE UN UTILISATEUR DANS LA BASE DE DONNEES
 * Renvoi 1 si inscription ok
 * Renvoi 0 si erreur
 * Renvoi -1 si pseudo deja pris
 * Renvoi -2 si email deja pris
 * @method Inscription
 */

 
 Utilisateur_BD.Inscription = function(pseudoU,emailU,passU,vie,action,deplacement,poids,goule,competence){
 
	
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
		console.log('cette utilisateur existe déja');
	else if(mailExiste)
		console.log('cette email est déjà utilisé');
	else
	{	
		NewUser.pseudo = pseudoU;
		NewUser.pass = passU;
		NewUser.email = emailU;
		
		
		
		NewUser.save(function (err) {
			if (err) { throw err; }
			console.log('tu es dans la base maintenant Motherfuker !');
			
			});
		
	var PersonnageModel = mongoose.model('Personnage');
	var NewPerso = new PersonnageModel();
	
	NewPerso = oPresonnage.Creation(vie,action,deplacement,poids,goule,competence);
	console.log(NewPerso._id );
	NewUser.presonnage = NewPerso._id;
	
	NewUser.save(function (err) {
		if (err) { throw err; }
		console.log('fini boy <3 !');
		});
	
	}
	
	
		});
	

	});
		
		
 },
 
 
 
 /**
 *	Renvoi 1 si le pseudo n'existe pas, 2 si le mot de passe ne coresspond pas au pseudo et 0 si tout est en règle 
 * 
 * @method Connexion
 */
 
 Utilisateur_BD.Connexion = function (pseudoU,passU){
 
	var Utilisateurmodel = mongoose.model('Utilisateur'); 				//recupération de la classe utilisateur
	
	var NewUser = new Utilisateurmodel();
	
	var queryU = Utilisateurmodel.find({pseudo : pseudoU});
	
	var etat = 3;
	
	queryU.exec(function (err, testuseru) {
	if (err)  throw err;
	
	console.log(testuseru[0]);
	if (!testuseru[0])
		etat = 1;
	else if (testuseru[0].pass === passU)
		etat = 0;
	else
		etat = 2;
		
	
	console.log(etat);
		
	return etat;
	});
	
	
 
 },
 
 
 

 
 module.exports = Utilisateur_BD;
/*

Utilisateur_BD.Inscription = function(pseudoU, emailU, passU) {
	var Utilisateurmodel = mongoose.model('Utilisateur');

	var NewUser = new Utilisateurmodel();

	NewUser.pseudo = pseudoU;
	NewUser.pass = passU;
	NewUser.email = emailU;

	NewUser.save(function(err) {
		if (err) {
			throw err;
		}
		console.log('tu es dans la base maintenant Motherfuker !');
	});
>>>>>>> 00262bf13d52fde0963dc5a147accb9564d64140

},

/*
 * DEMANDE DE CONNEXION D'UN UTILISATEUR
 * Renvoi true si ok
 * Renvoi false si couple inexistant
 */
Utilisateur_BD.Connexion = function(pseudoU, passU) {
	// renvoi true si couple ok, false sinon
},

module.exports = Utilisateur_BD;

*/
