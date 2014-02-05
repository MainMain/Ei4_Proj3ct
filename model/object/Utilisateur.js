/**
 * Modélisation d'un utlisateur
 * 
 * @class Utilisateur
 */

//inclusion des règles
var GameRules	= require('../GameRules');

var Utilisateur = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Utilisateur.id;
	Utilisateur.pseudo;
	Utilisateur.email;
	Utilisateur.pass;
	Utilisateur.numEquipe;
	Utilisateur.idPersonnage;
	Utilisateur.idSession;
	
	// --- METHODES DE CLASSE ---
	Utilisateur.build = function() {return new Utilisateur();};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Utilisateur(id, pseudo, email, numEquipe, idPersonnage, idSession) {
		// --- Attributs d'instance
		this.id 					= id;
		this.pseudo 				= pseudo;
		this.email 					= email;
		this.numEquipe			 	= numEquipe;
		this.idPersonnage 			= idPersonnage;
		this.idSession				= idSession;
	}

	// --- METHODES D'INSTANCE
	Utilisateur.prototype = {

		getIdSession : function()
		{
			return this.idSession;
		},
		
		getNumEquipe : function()
		{
			return this.numEquipe;
		},
		
		getPseudo : function()
		{
			return this.pseudo;
		},
		
		getIdPersonnage : function()
		{
			return this.idPersonnage;
		},
		
		getScore : function()
		{
			return this.scoreByMeutreCumule;
		},
		
		setScore : function(newScore)
		{
			this.scoreByMeutreCumule = newScore;
		},

	};
	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Utilisateur;
}());

module.exports = Utilisateur;
