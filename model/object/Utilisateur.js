/**
 * Modélisation d'un utlisateur
 * 
 * @class Utilisateur
 */

//inclusion des règles
var GameRules	= require('../GameRules');
var EventLog    = require('../EventLog');

var Utilisateur = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Utilisateur.id;
	Utilisateur.pseudo;
	Utilisateur.email;
	Utilisateur.numEquipe;
	Utilisateur.idPersonnage;
	Utilisateur.idSession;
	Utilisateur.compteConfirme;
	
	// --- METHODES DE CLASSE ---
	Utilisateur.build = function() {return new Utilisateur();};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	// Utilisé a l'inscription
	/*function Utilisateur(id, pseudo, email, numEquipe, idPersonnage, idSession) {
		// --- Attributs d'instance
		this.id 					= id;
		this.pseudo 				= pseudo;
		this.email 					= email;
		this.numEquipe			 	= numEquipe;
		this.idPersonnage 			= idPersonnage;
		this.idSession				= idSession;
		this.compteConfirme			= false;
	}*/
	
	// Utilisé par la base de données
	function Utilisateur(id, pseudo, email, numEquipe, idPersonnage, idSession, compteConfirme) {
		// --- Attributs d'instance
		this.id 					= id;
		this.pseudo 				= pseudo;
		this.email 					= email;
		this.numEquipe			 	= numEquipe;
		this.idPersonnage 			= idPersonnage;
		this.idSession				= idSession;
		this.compteConfirme			= compteConfirme;
	}
	

	// --- METHODES D'INSTANCE
	Utilisateur.prototype =
	{
		getIdSession 		: function() { return this.idSession; },
		
		getNumEquipe 		: function() { return this.numEquipe; },
		
		getPseudo 			: function() { return this.pseudo; },
		
		getIdPersonnage 	: function() { return this.idPersonnage; },
		
		getScore 			: function() { return this.scoreByMeutreCumule; },
		
		getUser 			: function() { return this; },
		
		getCompteConfirme 	: function() { return this.compteConfirme; },
		
		setScore 			: function(newScore) { this.scoreByMeutreCumule = newScore; },
		
		setNumEquipe 		: function(newNumEquipe) { this.numEquipe = newNumEquipe; },
		
		setIdSession 		: function(newIdSession) {	this.idSession = newIdSession; },
		
		confirmerCompte		: function() { this.compteConfirme = true; },

	};
	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Utilisateur;
}());

module.exports = Utilisateur;
