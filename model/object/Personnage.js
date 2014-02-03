var oCarte = require('../../model/object/Carte');

//inclusion des règles
var GameRules	= require('../../model/GameRules');

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
	Personnage.ptFaim;
	Personnage.ptFaimMax;
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
	Personnage.nbrNvMsg;

	// --- ENUMERATIONS DE CLASSE ---
	Personnage.DIRECTIONS = [ 'NORD', 'SUD', 'EST', 'OUEST' ];

	// --- METHODES DE CLASSE ---
	Personnage.build = function() {return new Personnage();};
	
	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Personnage(id, ptSante, ptSanteMax, ptActions, ptActionsMax,
			ptDeplacement, ptDeplacementMax, ptFaim, ptFaimMax, poidsMax, goulesMax, competence, idSalleEnCours, mode,
			multiPtsAttaque, multiPtsDefense, multiProbaCache, multiProbaFouille, 
			armeEquipee, armureEquipee, sacADos, dernierMvt, listeMsgAtt, nbrNvMsg) 
	{
		// --- Attributs d'instance
				console.log("1");
		this.id 				= id;
		this.ptSante			= ptSante;
		this.ptSanteMax 		= ptSanteMax;
		this.ptActions 			= ptActions;
		this.ptActionsMax		= ptActionsMax;
		this.ptDeplacement 		= ptDeplacement;
		this.ptDeplacementMax	= ptDeplacementMax;
		this.ptFaim				= ptFaim;
		this.ptFaimMax			= ptFaimMax;
		this.poidsMax 			= poidsMax;
		this.goulesMax 			= goulesMax;
		this.competence 		= competence;
		this.idSalleEnCours 	= idSalleEnCours;
		this.mode 				= mode;
		this.multiPtsAttaque	= multiPtsAttaque;
		this.multiPtsDefense	= multiPtsDefense;
	    this.multiProbaCache 	= multiProbaCache;
	    this.multiProbaFouille 	= multiProbaFouille;
		this.armeEquipee 		= armeEquipee;
		this.armureEquipee 		= armureEquipee;
		this.sacADos 			= sacADos;
		this.dernierMvt 		= dernierMvt;
		this.listeMsgAtt 		= listeMsgAtt;
		this.nbrNvMsg			= nbrNvMsg;
	}

	// --- METHODES D'INSTANCE
	Personnage.prototype =
	{
		initialiser : function()
		{
		 	this.ptSanteMax			= -1;
		 	this.ptSante 			= -1;
		    this.ptAction 			= -1;
		    this.ptActionsMax 		= -1;
		    this.ptDeplacement 		= -1;
		    this.ptDeplacementMax 	= -1;
		    this.ptFaim		 		= 10;
		    this.ptFaimMax		 	= 10;
		    this.poidsMax 			= 30;
		    this.gouleLimite 		= -1;
		    this.competence 		= -1;
		    this.sacADos 			= new Array();
		    this.idSalleEnCours 	= -1;
		    this.mode 				= 0;
		    this.multiPtsAttaque 	= -1;
		    this.multiPtsDefense 	= -1;
		    this.multiProbaCache 	= -1;
		    this.multiProbaFouille	= -1;
		    this.idArmeEquipee 		= null;
		    this.idArmureEquipee 	= null;
		    this.dernierMvt 		= null;
		    this.listeMsgAtt 		= new Array();
		    this.nbrNvMsg			= 0;
		},
		
		setCompetence : function(competence, numEquipe)
		{
			// initialiser les attributs
			this.initialiser();
			
			/*** - CALCUL SUR LES MULTI POINTS - ***/
			if(competence == "brute")
			{
				this.setptSanteMax		(140);
				this.setptDeplacementMax(15);
				this.setptActionsMax		(20);
				this.multiPtsAttaque	= 2;
				this.multiPtsDefense	= 2;
				this.multiProbaCache	= 0.5;
				this.multiProbaFouille	= 1;
				this.goulesMax			= 2;
			}
			else if(competence == "explorateur")
			{
				this.setptSanteMax		(100);
				this.setptDeplacementMax(25);
				this.setptActionsMax		(20);
				this.multiPtsAttaque	= 1;
				this.multiPtsDefense	= 0.3;
				this.multiProbaCache	= 1;
				this.multiProbaFouille	= 3;
				this.goulesMax			= 5;
			}
			else if(competence == "chercheur")
			{
				this.setptSanteMax		(100);
				this.setptDeplacementMax(15);
				this.setptActionsMax		(30);
				this.multiPtsAttaque	= 0.5;
				this.multiPtsDefense	= 1.5;
				this.multiProbaCache	= 3;
				this.multiProbaFouille	= 0.5;
				this.goulesMax			= 3;
			}
			this.competence=competence;
			
			if (numEquipe == 1)
			{
				this.idSalleEnCours = GameRules.idZoneSure_1(); 
			}
			else if (numEquipe == 2)
			{
				this.idSalleEnCours = GameRules.idZoneSure_2(); 
			}
			else
			{
				this.idSalleEnCours = GameRules.idZoneSure_3(); 
			}
			
		},
		/**
		 * ECRITURE
		 * 
		 * FONCTION DE DEPLACEMENT D'UN PERSONNAGE 
		 * return : idNewCase si ok 
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
		deplacement : function(direction, nbrGoules, idZoneSureEnnemi)
		{
			//console.log("PERSONNAGE : Essai déplacement ! id salle en cours : " + this.idSalleEnCours);
			
			// si pu de pts de mouvement, on peut s'arreter là
			if (this.ptDeplacement <= 0)
			{
				//console.log("PERSONNAGE : pu de pts de déplacement !");
				return -2;
			}
			
			// si trop de goules, on peut s'arreter là
			if (nbrGoules > this.goulesMax)
			{
				if (!
					(direction == "OUEST" && this.dernierMvt == "EST" ||
					direction == "EST" && this.dernierMvt == "OUEST" ||
					direction == "NORD" && this.dernierMvt == "SUD" ||
					direction == "SUD" && this.dernierMvt == "NORD"))
				{
					return -3;
				}
			}
			
        	// Vérification de la direction demandée
			if (typeof direction !== 'string'
					&& Personnage.DIRECTIONS.indexOf(direction.toUpperCase()) === -1) {
				throw 'Direction argument invalid!';
				return -1;
			}
			
			// recupere l'id de la salle suivante
			var ansIdSalle = oCarte.GetIdSalleSuivante(this.idSalleEnCours, direction);
 
			// si id de la salle -1, pas de salle dans la direction
			if (ansIdSalle == -1)
			{
				//console.log("PERSONNAGE : Déplacement impossible ! ");
				return -1;
			} 
			
			if(ansIdSalle == idZoneSureEnnemi)
			{
				console.log("PERSONNAGE : Déplacement impossible ! Zone sure Ennemi");
				return -4;
			}
			
			// Décrémente les points de déplacement
			this.ptDeplacement--;
			
			//  on modifie l'id de salle du perso
			this.idSalleEnCours = ansIdSalle;
			
			//Passe en mode oisif
			this.mode = 0;

			// on gère son dernier mouvement
			this.dernierMvt = direction;
			
			// return
			return this.idSalleEnCours;
		},

		/**
		 * ECRITURE
		 * 
		 * FONCTION RAMASSER UN OBJET return : 1 si ok si trop de poids : renvoi
		 * item
		 * 
		 * @method ajouterAuSac
		 */
		ajouterAuSac : function(item)
		{
			if ((this.getPoidsSac() + item.poids) > this.poidsMax) return -1;
			
			this.sacADos.push(item);
			return 1;
		},
		
		testPoidsOk : function(item)
		{
			return (this.getPoidsSac() + item.poids) <= this.poidsMax;
		},

		/**
		 * ECRITURE
		 * 
		 * FONCTION DEPOSER UN OBJET
		 * 
		 * @method supprimerDuSac
		 */
		supprimerDuSac : function(item)
		{
			//console.log("PERSONNAGE : suppression de l'item " + item.nom
					//+ " du personnage " + this.id);
			this.logAfficherSacADos();
			var index;
			for (var i = 0; i < this.sacADos.length; i++) {
				if (this.sacADos[i].id == item.id) 
				{
					index = i;
					
					// si c'est l'arme équipe
					console.log("---------------> RETRAIT DE L'ITEM " + this.sacADos[i].id);
					if (this.armeEquipee != null) console.log("---------------> id arme " + this.armeEquipee.id);
					if (this.armureEquipee != null) console.log("---------------> id armure " + this.armureEquipee.id);
					
					if (this.armeEquipee != null && this.sacADos[i].id == this.armeEquipee.id)
						this.armeEquipee = null;
					if (this.armureEquipee != null && this.sacADos[i].id == this.armureEquipee.id)
						this.armureEquipee = null;
					
					
					break;
				}
			}
			// index = index - 1;
			//console.log("CASE : DEBUG index : " + index);
			this.sacADos.splice(i, 1);
			this.logAfficherSacADos();
		},
		
		subirDegats : function(degats)
		{
			degats -= this.getValeurArmure();
			
			// si en mode defense
			if (this.mode == 3)
			{
				degats *= 0.75;
			}
			
			if (degats < 0)
			{
				degats = 0;
			}
			
			this.ptSante -= degats;
			
			if (this.ptSante < 0) this.ptSante = 0;
			
			return degats;
		},
		
		diminuerPointAction : function(coutAction)
		{
			this.ptActions -= coutAction;
			if(this.ptActions < 0)
			{
				this.ptActions = 0;
			}
		},
		
		acquitterMsg : function()
		{
			console.log("PERSONNAGE : Acquittement des messages ! ");
			this.nbrNvMsg = 0;
 		},
		
		setPtsSante : function(newPtSante)
		{
			if(newPtSante >= this.ptSanteMax)
			{
				this.ptSante = this.ptSanteMax;
			}
			else if(newPtSante <= 0)
			{
				this.ptSante = 0;
			}
			else
			{
				this.ptSante = newPtSante;
			}
		},
		
		setptSanteMax : function(newPtSanteMax)
		{
			this.ptSanteMax = newPtSanteMax;
			this.ptSante = this.ptSanteMax;
		},
		
		setptDeplacement : function(newPtDeplacement)
		{
			if(newPtMouvement >= this.ptDeplacementMax)
			{
				newPtDeplacement = this.ptDeplacementMax;
			}
			else if(newPtDeplacement <= 0)
			{
				newPtDeplacement = 0;
			}
			this.ptDeplacement = newPtDeplacement;
		},
		
		setptDeplacementMax : function(newPtDeplacementMax)
		{
			this.ptDeplacementMax = newPtDeplacementMax;
			this.ptDeplacement = this.ptDeplacementMax;
		},
		
		setptAction : function(newPtAction)
		{
			if(newPtAction >= this.ptActionsMax)
			{
				newPtAction = this.ptActionsMax;
			}
			else if(newPtAction <= 0)
			{
				newPtAction = 0;
			}
			this.ptActions = newPtAction;
		},
		
		setptActionsMax : function(newptActionsMax)
		{
			this.ptActionsMax = newptActionsMax;
			this.ptActions = this.ptActionsMax;
		},
		
		setmultiPtsAttaque : function(multiPtsAttaque)
		{
			this.multiPtsAttaque = multiPtsAttaque;
		},
		
		setmultiPtsDefense : function(multiPtsDefense)
		{
			this.multiPtsDefense = multiPtsDefense;
		},
		
		setmultiProbaCache : function(multiProbaCache)
		{
			this.multiProbaCache = multiProbaCache;
		},
		
		setmultiProbaFouille : function(multiProbaFouille)
		{
			this.multiProbaFouille = multiProbaFouille;
		},
		
		setgoulesMax : function(goulesMax)
		{
			this.goulesMax = goulesMax;
		},
		
		getCompetence : function()
		{
			return this.competence;
		},

		/*
		 * LECTURE
		 * 
		 * FONCTION POUR AFFICHER DANS LA CONSOLE LA LISTE DES OBJETS DE DU SAC
		 */
		logAfficherSacADos : function() {
			//console.log("PERSONNAGE : ****** AFFICHAGE OBJET PERSONNAGE :  "+ this.sacADos.length + " du perso : " + this.id + " *********");
			for (var i = 0; i < this.sacADos.length; i++)
			{
				//console.log("PERSONNAGE : Objet id = " + this.sacADos[i].id+ " - " + this.sacADos[i].nom);
			}
			//console.log("PERSONNAGE : *********************************");
		},

		getValeurAttaque : function()
		{
			var att;
			if (this.competence == "brute") 		 att = GameRules.combat_ptsAttaque_base_brute();
			if (this.competence == "explorateur") att = GameRules.combat_ptsAttaque_base_explorateur();
			if (this.competence == "chercheur") 	 att = GameRules.combat_ptsAttaque_base_chercheur();
			
			if (this.armeEquipee != null)
			{
				att += this.armeEquipee.valeur;
			}
			
			return (att * this.multiPtsAttaque);
		},
		
		getValeurArmure : function()
		{
			var def = GameRules.combat_ptsDefense_base();
			
			if (this.armureEquipee != null)
			{
				def += this.armureEquipee.valeur;
			}

			return (def * this.multiPtsDefense);
		},
		
		initialiserMode : function()
		{
			this.mode = 0;
		},
		
		changerMode : function(mode)
		{
			console.log("PERSONNAGE : passage en mode " + mode);
			if(mode == 3)
			{
				this.ptActions -= GameRules.coutPA_ChgtMode_def();
			}
			else
			{
				this.ptActions -= GameRules.coutPA_ChgtMode();
			}
			
			this.mode = mode;
			
			return 1;
		},
		
		setIdCase : function(idCase)
		{
			this.idSalleEnCours = idCase;
		},
		
		Attaquer : function(coutAttaquer)
		{
			this.ptActions -= coutAttaquer;
		},
		
		testDeplacement : function(nbrGoules, direction)
		{
			// si pu de PM
			if (this.ptDeplacement <= 0)
				return -2;
			
			// force le passage à  1
			//console.log("P : last mvt : " + this.dernierMvt);
			if (
					direction == "OUEST" && this.dernierMvt == "EST" ||
					direction == "EST" && this.dernierMvt == "OUEST" ||
					direction == "NORD" && this.dernierMvt == "SUD" ||
					direction == "SUD" && this.dernierMvt == "NORD"
				)
			{
				return 1;
			}
			
			// si trop de goules, on peut s'arreter là
			if (nbrGoules > this.goulesMax)
				return -3;
			
			return 1;
		},
		
		/**
		 * LECTURE
		 * 
		 * FONCTION POUR RENVOYER SI UN ITEM EST BIEN DANS LE SAC return :true si
		 * objet est dans la salle, sinon false
		 * 
		 * @method existItemInSac
		 */
		existItemInSac : function(item)
		{
			this.logAfficherSacADos();
			var bool = false;
			for (var i = 0; i < this.sacADos.length; i++)
			{
				if (this.sacADos[i].id == item.id)
				{
					//console.log("PERSONNAGE : L'item (" + item.id + " - " + item.nom + ") est bien dans le sac  du perso " + this.id);
					return true;
				}
			}
			//console.log("PERSONNAGE : WARNING : L'item - id = " + item.id + " - " + item.nom + " - n'est pas dans le sac du perso  "+ this.id);
			return false;
		},

		/**
		 * ECRITURE
		 * 
		 * FONCTION POUR S'EQUIPER D'UN ITEM return 1 si ok erreur : -1 si déja
		 * une arme équipée erreur : -2 si déja une armure équipée erreur : -3
		 * si ni une arme, ni une armure
		 */
		equiper : function(item)
		{
			switch(item.type)
			{
				case 1:
					this.armeEquipee = item;
					return 1;
				case 2:
					this.armureEquipee = item;
					return 2;
				default:
					return -3;
			}
		},
		/**
		 * ECRITURE FONCTION POUR SE DEQUIPER D'UN ITEM
		 * 
		 */
		desequiper : function(item)
		{
			if(this.isItemEquipee(item))
			{
				if (item.type == 1)
				{
					this.armeEquipee = null;
					return 1;
				}
				else if (item.type == 2)
				{
					this.armureEquipee = null;
					return 2;
				}
			}
			return -4;
		},
            
		isItemEquipee : function(item)
		{
			if (this.armeEquipee != null && this.armeEquipee.id == item.id) return true;
			
			if (this.armureEquipee != null && this.armureEquipee.id == item.id) return true;
			
			return false;
		},
		
		/**
		 * FONCTION POUR UTILISER UN ITEM
		 * 
		 * @method utiliser
		 */
		utiliser : function(item)
		{
			var type = parseInt(item.type);
			var valeur = parseInt(item.valeur);
			//console.log("PERSONNAGE : utiliser() : utilisation de l'item" + item.nom + " de type : " + type + " de valeur " + valeur);
			
			if(!this.existItemInSac(item))
			{
				return -2;
			}
			
			if (type < 4 || type > 6)
			{
				return -1;
			}
			switch (type) 
			{
				case 4:
					this.ptSante += valeur;
					if(this.ptSante > this.ptSanteMax)
					{
						this.ptSante = this.ptSanteMax;
					}
					//console.log("valeur = " + valeur);
					break;
				case 5:
					this.ptActions += valeur;
					if(this.ptActions > this.ptActionsMax) this.ptActions = this.ptActionsMax;
					//console.log("valeur = " + valeur);
					break;
				case 6:
					this.ptDeplacement += valeur;
					if(this.ptDeplacement > this.ptDeplacementMax) this.ptDeplacement = this.ptDeplacementMax;
					//console.log("valeur = " + valeur);
					break;
				default:
					break;
			}
			// suppression du sac
			this.supprimerDuSac(item);
			return 1;
		},
		
		ajouterMessage : function(msg)
		{
			if (msg != "Z" && msg != "N")
			{
				var date = new Date();
				var mois = parseInt(date.getMonth()) + 1;
				var str = date.getDate() +"/"+mois+" - "+date.getHours()+ ":"+date.getMinutes(); 
				this.listeMsgAtt.push(str + " : " + msg);
			}
			this.nbrNvMsg++;
			
			console.log("PERSONNAGE : Ajout d'un message : " + msg);
		},
		
		effacerMessage : function(msg)
		{
			this.listeMsgAtt = new Array();
		},
		
		manger : function(valeur)
		{
			
		},
		
		viderInventaire : function()
		{
			this.sacADos = new Array();
			this.armeEquipee = null;
			this.armureEquipee = null;
		},
		
		nvlleJournee : function()
		{
			if(this.competence == "brute")
			{
				this.ptDeplacement = 15;
				this.ptActions = 20;
			}
			else if(this.competence == "explorateur")
			{
				this.ptDeplacement = 25;
				this.ptActions = 20;
			}
			else if(this.competence == "chercheur")
			{
				this.ptDeplacement = 15;
				this.ptActions = 30;
			}
			this.ptFaim -= 3;
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
			//console.log("PERSONNAGE : DEBUG : nombre d'objets dans sac "
					//+ this.sacADos.length);
			// calcule le poids du sac + poids item
			var i = 0;
			for (i = 0; i < this.sacADos.length; i++) {
				poids = poids + parseInt(this.sacADos[i].poids);
			}
			// if (armeEquipee != null) poids += armeEquipee.poids;
			// if (armureEquipee != null) poids += armeEquipee.poids;
			//console.log("PERSONNAGE : Calcul du poids total du sac : " + poids);
			return parseInt(poids);
		},

		/**
		 * Retourne le poids max du personnage
		 * 
		 * @method getPoidsMax
		 */
		getPoidsMax : function()
		{
			return this.poidsMax;
		},

		/**
		 * Retourne l'arme equipe par le personnage
		 * 
		 * @method getArmeEquipee
		 */
		getArmeEquipee : function()
		{
			return this.armeEquipee;
		},

		/**
		 * Retourne l'armure equipe par le personnage
		 * 
		 * @method getArmureEquipee
		 */
		getArmureEquipee : function()
		{
			return this.armureEquipee;
		},
		
		/**
		 * Retourne la sante du personnage
		 * 
		 * @method getPtSante
		 */
		getPtSante : function()
		{
			return this.ptSante;
		},

		/**
		 * Retourne la sante max du personnage
		 * 
		 * @method getPtSanteMax
		 */
		getPtSanteMax : function()
		{
			return this.ptSanteMax;
		},

		/**
		 * Retourne les points d'action du personnage
		 * 
		 * @method getPtActions
		 */
		getPtActions : function()
		{
			return this.ptActions;
		},

		/**
		 * Retourne les points de déplacement du personnage
		 * 
		 * @method getPtDeplacement
		 */
		getPtDeplacement : function()
		{
			return this.ptDeplacement;
		},

		/**
		 * Retourne la salle du personnage
		 * 
		 * @method getIdSalleEnCours
		 */
		getIdSalleEnCours : function()
		{
			return this.idSalleEnCours;
		},
		
		getIdPerso : function()
		{
			return this.id;
		},
		
		/**
		 * Retourne la liste des messages
		 * 
		 * @method getListMsgAtt
		 */
		getListMsgAtt : function()
		{
			return this.listeMsgAtt;
		},
		
		getMultiFouille : function()
		{
			return this.multiProbaFouille;
		},
		
		GetMultiCache : function()
		{
			return this.multiProbaCache;
		},
		
		GetMode : function()
		{
			return this.mode;
		},
		
		GetSac : function()
		{
			return this.sacADos;
		},
		
		estMort : function()
		{
			return (this.ptSante <= 0);
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
