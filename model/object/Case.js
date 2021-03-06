/**
 * Modélisation d'une case
 * 
 * @class Case
 */
var EventLog    = require('../EventLog');

var Case = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Case.idmongo;
	Case.id;
	Case.nom;
	Case.description;
	Case.probaObjet;
	Case.probaCache;
	//Case.objetsAuSol;
	Case.nbrGoules;
	Case.listeItem;
	Case.pathImg;

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	Case.build = function() {return new Case();};

	// --- METHODES DE CLASSE ---
	function Case(idmongo, id, nom, description, probaObjet, probaCache,
			nbrGoules, listeItem) {
		this.idmongo = idmongo;
		this.id = id;
		this.nom = nom;
		this.description = description;
		this.probaObjet = probaObjet;
		this.probaCache = probaCache;
		this.nbrGoules = nbrGoules;
		this.listeItem = listeItem;
		this.pathImg = "/public/map/"+id;
	}

	// --- METHODES D'INSTANCE
	Case.prototype = {
		/**
		 * LECTURE
		 * 
		 * FONCTION POUR REVOYER SI UN ITEM EST BIEN DANS LA CASE return :true
		 * si objet est dans la salle, sinon false
		 * 
		 * @method existItemInSalle
		 */
		existItemInSalle : function(item) {
			//this.logAfficherItems();
			var itemTrouve = false;
			for (var i = 0; i < this.listeItem.length; i++)
				{
					if (this.listeItem[i].id == item.id) itemTrouve = true; 
				}
			if (itemTrouve) {
				EventLog.log("CASE : L'objet (" + item.id + " - " + item.nom
						+ ") est bien dans la case ! " + this.nom);
				return true;
			} else {
				EventLog.log("CASE : WARNING : L'objet (" + item.id + " - "
						+ item.nom + ") n'est pas dans la case ! " + this.nom);
				return false;
			}
		},

		/**
		 * ECRITURE
		 * 
		 * FONCTION POUR AJOUTER UN ITEM A UNE CASE
		 */
		ajouterItem : function(item)
		{
			this.listeItem.push(item);
			EventLog.log("CASE : Ajout de l'item " + item.nom + " a la case " + this.nom);
			//this.logAfficherItems();
		},

		/**
		 * ECRITURE
		 * 
		 * FONCTION POUR SUPPRIMER UN ITEM D'UNE CASE
		 * 
		 * @method supprimerItem
		 */
		supprimerItem : function(item) {
			EventLog.log("CASE : suppression de l'objet " + item.nom
					+ " de la case " + this.nom);
			//this.logAfficherItems();
			var index;
			for (var i = 0; i < this.listeItem.length; i++) {
				if (this.listeItem[i].id == item.id) {
					index = i;
					break;
				}
			}
			// supprime de la liste
			this.listeItem.splice(i, 1);
			//this.logAfficherItems();
		},
		
		AttaqueGoule : function(nbrGoules)
		{
			this.nbrGoules -= nbrGoules;
			if(this.nbrGoules < 0)
			{
				this.nbrGoules = 0;
			}
		},
		
		getNbrGoules : function()
		{
			return this.nbrGoules;
		},
		
		getNom : function() { return this.nom; },
		/*
		 * LECTURE
		 * 
		 * FONCTION POUR AFFICHER DANS LA CONSOLE LA LISTE DES OBJETS DE LA
		 * SALLE
		 */
		logAfficherItems : function() {
			EventLog.log("CASE : ****** AFFICHAGE OBJET CASE " + this.nom
					+ " *********");
			for (var i = 0; i < this.listeItem.length; i++) {
				EventLog.log("CASE : Objet id = " + this.listeItem[i].id + " - "
						+ this.listeItem[i].nom);
			}
			EventLog.log("CASE : *********************************");
		},
	};

	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Case;
}());

module.exports = Case;
