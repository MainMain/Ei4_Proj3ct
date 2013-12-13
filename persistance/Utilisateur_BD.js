// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');

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
