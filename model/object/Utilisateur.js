/**
 * Modélisation d'un utlisateur
 * 
 * @class Utilisateur
 */
var Utilisateur = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Utilisateur.id;
	Utilisateur.pseudo;
	Utilisateur.email;
	Utilisateur.pass;
	Utilisateur.nbrMeurtres;
	Utilisateur.nbrMeurtresCumule;
	Utilisateur.nbrFoisTue;
	Utilisateur.nbrFoisTueCumule;
	Utilisateur.numEquipe;
	Utilisateur.idPersonnage;

	// --- METHODES DE CLASSE ---
	Utilisateur.build = function(id, pseudo, email, nbrMeurtres,
			nbrMeurtresCumule, nbrFoisTue, nbrFoisTueCumule, numEquipe,
			idPersonnage) {
		return new Utilisateur();
	};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Utilisateur(id, pseudo, email, nbrMeurtres, nbrMeurtresCumule,
			nbrFoisTue, nbrFoisTueCumule, numEquipe, idPersonnage) {
		// --- Attributs d'instance
		this.id;
		this.pseudo;
		this.email;
		this.pass;
		this.nbrMeurtres;
		this.nbrMeurtresCumule;
		this.nbrFoisTue;
		this.nbrFoisTueCumule;
		this.numEquipe;
		this.idPersonnage;
		console.log("Utilisateur : Nouveau Utilisateur crée ");
	}

	// --- METHODES D'INSTANCE
	Utilisateur.prototype = {
		/**
		 * L'UTILISATEUR A COMMIT A MEUTRE item
		 * 
		 * @method ajoutMeurtre
		 */
		ajoutMeurtre : function() {
			this.nbrMeurtres += 1;
			this.nbrMeurtresCumule += 1;
		},

		/**
		 * L'UTILISATTER A ETE TUE
		 * 
		 * @method ajoutMeurtre
		 */
		ajoutTue : function() {
			this.nbrFoisTue += 1;
			this.nbrFoisTueCumule += 1;
		},

	};
	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Utilisateur;
}());

module.exports = Utilisateur;
