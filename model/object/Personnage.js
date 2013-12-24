var oPersonnage_BD = require('../../persistance/Personnage_BD');
var oCarte = require('../../model/object/Carte');

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
	Personnage.ptSanteMax;
	Personnage.ptActions;
	Personnage.ptActionsMax;
	Personnage.ptDeplacement;
	Personnage.ptDeplacementMax;
	Personnage.poidsMax;
	Personnage.goulesMax;
	Personnage.competence;
	Personnage.idSalleEnCours;
	Personnage.armeEquipee;
	Personnage.armureEquipee;
	Personnage.sacADos;

	// --- ENUMERATIONS DE CLASSE ---
	Personnage.DIRECTIONS = [ 'NORD', 'SUD', 'EST', 'OUEST' ];

	// --- METHODES DE CLASSE ---
	Personnage.build = function(ptSante, ptSanteMax, ptActions, ptActionsMax,
			ptDeplacement, ptDeplacementMax, poidsMax, idSalleEnCours,
			armeEquipee, armureEquipee, sacADos) {
		return new Personnage();

	};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Personnage(id, ptSante, ptSanteMax, ptActions, ptActionsMax,
			ptDeplacement, ptDeplacementMax, poidsMax, goulesMax, competence, idSalleEnCours,
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
		this.goulesMax = goulesMax;
		this.competence = competence;
		this.idSalleEnCours = idSalleEnCours;
		this.armeEquipee = armeEquipee;
		this.armureEquipee = armureEquipee;
		this.sacADos = sacADos;
		console.log("PERSONNAGE : Nouveau personnage crée ");
	}

	// --- METHODES D'INSTANCE
	Personnage.prototype = {
		
		/**
		 * ECRITURE
		 * 
		 * FONCTION DE DEPLACEMENT D'UN PERSONNAGE return : 1 si ok erreur : -1
		 * si déplacement impossible (pas de case dans la direction) erreur : -2
		 * si pas de pts mouvement
		 * 
		 * @method deplacement
		 */
		deplacement : function(direction) {
			console.log("PERSONNAGE : Déplacement ! id salle en cours : " + this.idSalleEnCours);
			// si pu de pts de mouvement, on peut s'arreter là
			if (this.ptDeplacement == 0)
				return -2;
			// Vérification de la direction demandée
			if (typeof direction !== 'string'
					&& Personnage.DIRECTIONS.indexOf(direction.toUpperCase()) === -1) {
				throw 'Direction argument invalid!';
				return -1;
			}
			
			// recupere l'id de la salle
			var ansIdSalle = oCarte.GetIdSalleSuivante(this.idSalleEnCours,
					direction);
			if (ansIdSalle == -1) {
				console.log("PERSONNAGE : Déplacement impossible ! ");
				return -1;
			} else {
				// Affiche sur le log
				console.log('PERSONNAGE : Deplacement vers : ' + direction);
				console.log('PERSONNAGE : Déplacement ok - '
						+ this.idSalleEnCours);
				// Décrémente les points de déplacement
				this.ptDeplacement--;
				// si c'est un id valide, on modifie l'id de salle du perso
				this.idSalleEnCours = ansIdSalle;

				// maj dans la BD
				//oPersonnage_BD.SetPersonnage(this, null);
				oPersonnage_BD.test();
				return 1;
			}
		},

		/**
		 * ECRITURE
		 * 
		 * FONCTION RAMASSER UN OBJET return : 1 si ok si trop de poids : renvoi
		 * item
		 * 
		 * @method ajouterAuSac
		 */
		ajouterAuSac : function(item) {
			this.sacADos.push(item);
			console.log("PERSONNAGE : ajout de l'item " + item.nom
					+ " au personnage " + this.id);
			// maj dans la BD
			oPersonnage_BD.SetPersonnage(this);
		},

		/**
		 * ECRITURE
		 * 
		 * FONCTION DEPOSER UN OBJET
		 * 
		 * @method supprimerDuSac
		 */
		supprimerDuSac : function(item) {
			console.log("PERSONNAGE : suppression de l'item " + item.nom
					+ " du personnage " + this.id);
			this.logAfficherSacADos();
			var index;
			for (var i = 0; i < this.sacADos.length; i++) {
				if (this.sacADos[i].id == item.id) {
					index = i;
					break;
				}
			}
			// index = index - 1;
			console.log("CASE : DEBUG index : " + index);
			this.sacADos.splice(i, 1);
			this.logAfficherSacADos();
			// maj dans la BD
			oPersonnage_BD.SetPersonnage(this);
		},

		/*
		 * LECTURE
		 * 
		 * FONCTION POUR AFFICHER DANS LA CONSOLE LA LISTE DES OBJETS DE DU SAC
		 */
		logAfficherSacADos : function() {
			console.log("PERSONNAGE : ****** AFFICHAGE OBJET PERSONNAGE :  "+ (this.sacADos.length) + " du perso : " + this.id + " *********");
			for (var i = 0; i < this.sacADos.length; i++)
			{
				console.log("PERSONNAGE : Objet id = " + this.sacADos[i].id+ " - " + this.sacADos[i].nom);
			}
			console.log("PERSONNAGE : *********************************");
		},

		/**
		 * LECTURE
		 * 
		 * FONCTION POUR REVOYER SI UN ITEM EST BIEN DANS LE SAC return :true si
		 * objet est dans la salle, sinon false
		 * 
		 * @method existItemInSac
		 */
		existItemInSac : function(item) {
			this.logAfficherSacADos();
			if (this.sacADos.indexOf(item) != -1) {
				console.log("PERSONNAGE : L'item (" + item.id + " - " + item.nom + ") est bien dans le sac  du perso " + this.id);
				return true;
			} else {
				console.log("PERSONNAGE : WARNING : L'item - id = " + item.id + " - " + item.nom + " - n'est pas dans le sac du perso  "+ this.id);
				return false;
			}
		},

		/**
		 * ECRITURE
		 * 
		 * FONCTION POUR S'EQUIPER D'UN ITEM return 1 si ok erreur : -1 si déja
		 * une arme équipée erreur : -2 si déja une armure équipée erreur : -3
		 * si ni une arme, ni une armure
		 */
		sEquiperDunItem : function(item) {
			var codeRetour = 1;
			// si type arme
			console.log("---- " + this.armeEquipee);
			if (item.type == 1) {
				// si déja une arme équipée
				if (this.armeEquipee != null)
					return -1;
				// pas d'arme équipée
				else
					this.armeEquipee = item;
			}
			// si type armure
			else if (item.type == 2) {
				// si armure déja équipée
				if (this.armureEquipee != null)
					return -2;
				// pas d'armure équipée
				else
					this.armureEquipee = item;
			} else {
				return -3;
			}
			// maj dans la BD
			oPersonnage_BD.SetPersonnage(this);
			return codeRetour;
		},
		/**
		 * ECRITURE FONCTION POUR SE DEQUIPER D'UN ITEM
		 * 
		 */
		sDesequiperDunItem : function(item) {
			console.log("PERSONNAGE : Déséquipement !");
			if (item.type == 1)
				this.armeEquipee = null;
			else if (item.type == 2)
				this.armureEquipee = null;
			// maj dans la BD
			oPersonnage_BD.SetPersonnage(this);
		},

		/**
		 * FONCTION POUR UTILISER UN ITEM
		 * 
		 * @method utiliser
		 */
		utiliser : function(item) {
			if (item.type < 4 || item.type > 6)
				return -1;
			switch (item.type) {
			case 4:
				this.ptSante += item.valeur;
				break;
			case 5:
				this.ptActions += item.valeur;
				break;
			case 6:
				this.ptDeplacement += item.valeur;
				break;
			}
			// maj dans la BD
			oPersonnage_BD.SetPersonnage(this);
			return 1;

		},

		/**
		 * LECTURE
		 * 
		 * FONCTION QUI RENVOI LE POIDS DU SAC A DOS
		 * 
		 * @method getPoidsSac
		 */
		getPoidsSac : function() {
			var poids = 0;
			console.log("PERSONNAGE : DEBUG : nombre d'objets dans sac "
					+ this.sacADos.length);
			// calcule le poids du sac + poids item
			var i = 0;
			for (i = 0; i < this.sacADos.length; i++) {
				poids = poids + this.sacADos[i].poids;
			}
			// if (armeEquipee != null) poids += armeEquipee.poids;
			// if (armureEquipee != null) poids += armeEquipee.poids;
			console.log("PERSONNAGE : Calcul du poids total du sac : " + poids);
			return poids;
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

		/**
		 * ACTUALISE LE PERSONNAGE. DOIT ÊTRE DÉCLENCHÉE QUAND LE SERVEUR RELÈVE
		 * UN ... ... CHANGEMENT FAITE PAR UN AUTRE JOUEUR
		 */
		actualiser : function() {
			// chercher infos dans la BD
		},

		/**
		 * UPDATE EN BD LE PERSONNAGE. DOIT ÊTRE DÉCLENCHÉE QUAND LE SERVEUR
		 * RELÈVE UN ... ... CHANGEMENT FAITE PAR LE JOUEUR EN COURS
		 */
		update : function() {
			// écrire infos dans la BD
		},
		
	};
	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Personnage;
}());

callbackSetPersonnage = function(reponse)
{
	
},


module.exports = Personnage;
