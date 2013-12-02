var oCarte = require('./Carte');

/**
 * Modélisation d'un personnage
 * 
 * @class Personnage
 */
var Personnage = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Personnage.id = 1;
	Personnage.ptSante = 100;
	Personnage.ptActions = 20;
	Personnage.ptDeplacement = 50;
	Personnage.idSalleEnCours = 2;
	Personnage.armeEquipee = "aucun";
	Personnage.armureEquipee = "aucune";
	Personnage.sacADos;

	// --- ENUMERATIONS DE CLASSE ---
	Personnage.DIRECTIONS = [ 'NORD', 'SUD', 'EST', 'OUEST' ];

	// --- METHODES DE CLASSE ---
	Personnage.build = function(name) {
		return new Personnage(name);
		//sacADos = new Array();
	};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Personnage(name) {
		// --- Attributs d'instance
		this.name = name;
		this.idSalleEnCours = 2;
	}

	// --- METHODES D'INSTANCE
	Personnage.prototype = {
		/**
		 * Un personnage peut se déplacer
		 * 
		 * @method deplacement
		 */
		deplacement : function(direction) {
			// Vérification de la direction demandée
			if (typeof direction !== 'string'
					&& Personnage.DIRECTIONS.indexOf(direction.toUpperCase()) === -1) {
				throw 'Direction argument invalid!';
			}
			// Affiche sur le log
			console.log('PERSONNAGE : Deplacement de : ' + this.name
					+ ' vers : ' + direction);
			// Décrémente les points de déplacement
			this.ptDeplacement--;
			// change l'id de la salle
			var ansIdSalle = oCarte.GetIdSalleSuivante(this.idSalleEnCours,
					direction);
			// vérifie l'id de la salle, s'il est correct ( = existe une salle
			// dans la direction donné)
			if (ansIdSalle >= 0) {
				this.idSalleEnCours = ansIdSalle;
				console.log('PERSONNAGE : Déplacement ok - '
						+ this.idSalleEnCours);
				return true;
			} else {
				console.log("PERSONNAGE : Déplacement impossible ! ");
				return false;
			}
		},

		/**
		 * Un Personnage peut ramasser un objet
		 * 
		 * @method ramasser
		 */
		ramasser : function(objet) {
		},

		/**
		 * Retourne la sante du personnage
		 * 
		 * @method getPtSante
		 */
		getPtSante : function() {
			return this.ptSante;
		},

		/**
		 * Retourne les points d'action du personnage
		 * 
		 * @method getPtActions
		 */
		getPtActions : function() {
			return this.ptAction;
		},

		/**
		 * Retourne les points de déplacement du personnage
		 * 
		 * @method getPtDeplacement
		 */
		getPtDeplacement : function() {
			return this.ptDeplacement;
		},

		/**
		 * Retourne la salle du personnage
		 * 
		 * @method getIdSalleEnCours
		 */
		getIdSalleEnCours : function() {
			return this.idSalleEnCours;
		},

	};

	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Personnage;
}());

module.exports = Personnage;
