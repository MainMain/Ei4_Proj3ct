var oCarte = require('./Carte');

/**
 * Modélisation d'un personnage
 * 
 * @class Personnage
 */
var Personnage = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Personnage.id;
	Personnage.ptSante;
	Personnage.ptSanteMax ;
	Personnage.ptActions;
	Personnage.ptActionsMax;
	Personnage.ptDeplacement;
	Personnage.ptDeplacementMax;
	Personnage.poidsMax;
	Personnage.idSalleEnCours;
	Personnage.idArmeEquipee;
	Personnage.idArmureEquipee;
	Personnage.sacADos;

	// --- ENUMERATIONS DE CLASSE ---
	Personnage.DIRECTIONS = [ 'NORD', 'SUD', 'EST', 'OUEST' ];

	// --- METHODES DE CLASSE ---
	Personnage.build = function(ptSante, ptSanteMax, ptActions, ptActionsMax,
			ptDeplacement, ptDeplacementMax, poidsMax, idSalleEnCours,
			armeEquipee, armureEquipee, sacADos) {
		return new Personnage(name);

	};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Personnage(id, ptSante, ptSanteMax, ptActions, ptActionsMax,
			ptDeplacement, ptDeplacementMax, poidsMax, idSalleEnCours,
			armeEquipee, armureEquipee, sacADos) {
		// --- Attributs d'instance
		this.id = id;
		this.ptSante = ptSante;
		this.ptSanteMax = ptSanteMax;
		this.ptActions = ptActions;
		this.ptActionsMax = ptActionsMax;
		this.ptDeplacement = ptDeplacement;
		this.ptDeplacementMax = ptDeplacementMax;
		this.poidsMax = poidsMax;
		this.idSalleEnCours = idSalleEnCours;
		this.idArmeEquipee = armeEquipee;
		this.idArmureEquipee = armureEquipee;
		this.sacADos = sacADos;
		console.log("PERSONNAGE : Nouveau personnage crée ");
	}

	// --- METHODES D'INSTANCE
	Personnage.prototype = {
		
		/**
		 * FONCTION DE DEPLACEMENT D'UN PERSONNAGE return : id de la salle si ok
		 * erreur : -1 si déplacement impossible (pas de case dans la direction)
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
		 * FONCTION RAMASSER UN OBJET return : 1 si ok si trop de poids : renvoi
		 * item
		 * 
		 * @method ajouterAuSac
		 */
		ajouterAuSac : function(item) {
			//this.logAfficherSacADos();
			this.sacADos.push(item);
			//this.logAfficherSacADos();
			console.log("PERSONNAGE : ajout de l'item " + item.nom + " au personnage ");
		},

		/**
		 * FONCTION QUI RENVOI LE POIDS DU SAC A DOS
		 * item
		 * 
		 * @method getPoidsSac
		 */
		getPoidsSac : function() {
			var poids = 0;
			console.log("PERSONNAGE : DEBUG : nombre d'objets dans sac " + this.sacADos.length);
			// calcule le poids du sac + poids item
			var i = 0;
			for (i=0;i<this.length;i++){
			    poids = poids + curItem.poids;
			}
			console.log("PERSONNAGE : Calcul du poids total du sac : " + poids);
			return poids;
		},
		
		/*
		 * FONCTION POUR AFFICHER DANS LA CONSOLE LA LISTE DES OBJETS DE DU SAC
		 */
		logAfficherSacADos : function()
		{
			console.log("PERSONNAGE : ****** AFFICHAGE OBJET PERSONNAGE :  " + this.sacADos.length-1 + " *********");
			for (var i=0; i<this.sacADos.length; i++) {
				   console.log("PERSONNAGE : Objet id = " + this.sacADos[i].id + " - " + this.sacADos[i].nom);
				}
			console.log("PERSONNAGE : *********************************");
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
