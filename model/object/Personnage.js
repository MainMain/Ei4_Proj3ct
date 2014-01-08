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
	Personnage.mode;			// 0 : oisif - 1 : fouille - 2 : cache - 3 : defense
	Personnage.multiPtsAttaque;
	Personnage.multiPtsDefense;
	Personnage.multiProbaCache;
    Personnage.multiProbaFouille;
	Personnage.armeEquipee;
	Personnage.armureEquipee;
	Personnage.sacADos;
	Personnage.dernierMvt;
	Personnage.listeMsgAtt;

	// --- ENUMERATIONS DE CLASSE ---
	Personnage.DIRECTIONS = [ 'NORD', 'SUD', 'EST', 'OUEST' ];

	// --- METHODES DE CLASSE ---
	Personnage.build = function(ptSante, ptSanteMax, ptActions, ptActionsMax,
			ptDeplacement, ptDeplacementMax, poidsMax, idSalleEnCours, mode,
			multiPtsAttaque, multiPtsDefense, multiProbaCache, multiProbaFouille, 
			armeEquipee, armureEquipee, sacADos, dernierMvt, listeMsgAtt) {
		return new Personnage();

	};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Personnage(id, ptSante, ptSanteMax, ptActions, ptActionsMax,
			ptDeplacement, ptDeplacementMax, poidsMax, goulesMax, competence, idSalleEnCours, mode,
			multiPtsAttaque, multiPtsDefense, multiProbaCache, multiProbaFouille, 
			armeEquipee, armureEquipee, sacADos, dernierMvt, listeMsgAtt) {
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
		this.mode = mode;
		this.multiPtsAttaque = multiPtsAttaque;
		this.multiPtsDefense = multiPtsDefense;
	    this.multiProbaCache = multiProbaCache;
	    this.multiProbaFouille = multiProbaFouille;
		this.armeEquipee = armeEquipee;
		this.armureEquipee = armureEquipee;
		this.sacADos = sacADos;
		this.dernierMvt = dernierMvt;
		this.listeMsgAtt = listeMsgAtt;
		
		console.log("PERSONNAGE : Nouveau personnage crée");
	}

	// --- METHODES D'INSTANCE
	Personnage.prototype = {
		
		/**
		 * ECRITURE
		 * 
		 * FONCTION DE DEPLACEMENT D'UN PERSONNAGE 
		 * return : 1 si ok 
		 * erreur : -1 si déplacement impossible (pas de case dans la direction)
		 * erreur : -2 si pas de pts mouvement
		 * erreur : -3 si trop de goules
		 * erreur : -4 si zone sure adverse
		 * erreur : -6 si impossible à cause goules
		 * 
		 * ET dégats infligés
		 * 
		 * @method deplacement
		 */
		deplacement : function(direction, nbrGoules) {
			console.log("PERSONNAGE : Essai déplacement ! id salle en cours : " + this.idSalleEnCours);
			
			// si pu de pts de mouvement, on peut s'arreter là
			if (this.ptDeplacement <= 0)
				{
					console.log("PERSONNAGE : pu de pts de déplacement !");
				return -2;
				}
			// si trop de goules, on peut s'arreter là
			if (nbrGoules > this.goulesMax)
				return -3;
			
        	// Vérification de la direction demandée
			if (typeof direction !== 'string'
					&& Personnage.DIRECTIONS.indexOf(direction.toUpperCase()) === -1) {
				throw 'Direction argument invalid!';
				return -1;
			}
			
			// recupere l'id de la salle
			var ansIdSalle = oCarte.GetIdSalleSuivante(this.idSalleEnCours, direction);
			
			// si id de la salle -1, pas de salle dans la direction
			if (ansIdSalle == -1)
			{
				console.log("PERSONNAGE : Déplacement impossible ! ");
				return -1;
			} 
			else 
			{
				// Décrémente les points de déplacement
				this.ptDeplacement--;
				
				//  on modifie l'id de salle du perso
				this.idSalleEnCours = ansIdSalle;

				// Affiche sur le log
				console.log('PERSONNAGE : Deplacement vers : ' + direction);
				console.log('PERSONNAGE : Déplacement ok - nvlle salle '+ this.idSalleEnCours);
				
				// return
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

		getValeurArme : function()
		{
			var att;
			if (this.armeEquipee == null) att = 5;
			else att = this.armeEquipee.valeur;
			return (this.att * this.multiPtsAttaque);
		},
		
		getValeurArmure : function()
		{
			var def;
			if (this.armureEquipee == null) def = 0;
			else def = this.armureEquipee.valeur;
			
			console.log("PERSONNAGE : Valeur Armure : " + def );
			return (def * this.multiPtsDefense);
		},
		
		changerMode : function(mode)
		{
			// Décrémente les points de déplacement
			this.ptActions--;
			
			this.mode = mode;
		},
		
		/**
		 * LECTURE
		 * 
		 * FONCTION POUR RENVOYER SI UN ITEM EST BIEN DANS LE SAC return :true si
		 * objet est dans la salle, sinon false
		 * 
		 * @method existItemInSac
		 */
		existItemInSac : function(item) {
			this.logAfficherSacADos();
			var bool = false;
			for (var i = 0; i < this.sacADos.length; i++)
			{
				if (this.sacADos[i].id == item.id) bool = true;
			}
			//if (this.sacADos.indexOf(item) != -1) {
			if (bool == true){
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
			// configuration du code de retour
			var codeRetour = 1;

			// si c'est une arme
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
		},

		/**
		 * FONCTION POUR UTILISER UN ITEM
		 * 
		 * @method utiliser
		 */
		utiliser : function(item) {
			if (item.type < 4 || item.type > 6)
				return -1;
			switch (item.type) 
			{
			case 4:
				this.ptSante += item.valeur;
				if(this.ptSante > this.ptSanteMax) this.ptSante = this.ptSanteMax;
				break;
			case 5:
				this.ptActions += item.valeur;
				if(this.ptActions > this.ptActionsMax) this.ptActions = this.ptActionsMax;
				break;
			case 6:
				this.ptDeplacement += item.valeur;
				if(this.ptDeplacement > this.ptDeplacementMax) this.ptDeplacement = this.ptDeplacementMax;
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
