// includes
var oCase_BD = require('../../persistance/Case_BD');
/**
 * Modélisation d'une case
 * 
 * @class Case
 */
var Case = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Case.id;
	Case.nom;
	Case.description;
	Case.probaObjet;
	Case.probaCache;
	Case.objetsAuSol;
	Case.nbrGoules;
	Case.listeItem;

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	Case.build = function(id, nom, probaObjet, probaCache, objetsAuSol,
			nbrGoules) {
		return new Case(id, nom, probaObjet, probaCache, objetsAuSol,
				nbrGoules);
	};

	// --- METHODES DE CLASSE ---
	function Case(id, nom, probaObjet, probaCache, objetsAuSol, nbrGoules,
			listeItem) {
		this.id = id;
		this.nom = nom;
		this.probaObjet = probaObjet;
		this.probaCache = probaCache;
		this.objetsAuSol = objetsAuSol;
		this.nbrGoules = nbrGoules;
		this.listeItem = listeItem;
	}

	// --- METHODES D'INSTANCE
	Case.prototype = {
		/**
		 * FONCTION POUR REVOYER SI UN ITEM EST BIEN DANS LA CASE 
		 * return :true si objet est dans la salle, sinon false
		 * 
		 * @method existItemInSalle
		 */
		existItemInSalle : function(item) {
			this.logAfficherItems();
			if (this.listeItem.indexOf(item) != -1){
				console.log("CASE : L'objet (" + item.id + " - " + item.nom + ") est bien dans la case ! " + this.nom);
				return true;
			} else {
				console.log("CASE : WARNING : L'objet (" + item.id + " - " + item.nom + ") n'est pas dans la case ! " + this.nom);
				return false;
			}
		},
		
		/**
		 * FONCTION POUR AJOUTER UN ITEM A UNE CASE
		 */
		ajouterItem : function(item)
		{
			this.listeItem.push(item);
			console.log("CASE : suppression de l'item " + item.nom + " a la case " + this.nom);
			
			// enregistre les modifs en BD
			//oCase_BD.UpdateCase(this.id);
		},
		
		
		/**
		 * FONCTION POUR SUPPRIMER UN ITEM D'UNE CASE
		 * 
		 * @method supprimerItem
		 */
		supprimerItem : function(item)
		{
			console.log("CASE : suppression de l'objet " + item.nom + " de la case " + this.nom);
			this.logAfficherItems();
			var index;
			for (var i=0; i<this.listeItem.length; i++) {
				  if (this.listeItem[i].id == item.id)
					  {
					  index = i;
					  break;
			}
				}
			//index = index-1;
			//console.log("CASE : DEBUG index : " + index);
			this.listeItem.splice(i, 1);
			
			// enregistre les modifs en BD
			//oCase_BD.UpdateCase(this.id);
		},
		
		/*
		 * FONCTION POUR AFFICHER DANS LA CONSOLE LA LISTE DES OBJETS DE LA
		 * SALLE
		 */
		logAfficherItems : function()
		{
			console.log("CASE : ****** AFFICHAGE OBJET CASE " + this.nom + " *********");
			for (var i=0; i<this.listeItem.length; i++) {
			   console.log("CASE : Objet id = " + this.listeItem[i].id + " - " + this.listeItem[i].nom);
			}
			console.log("CASE : *********************************");
		},
	};

	// On pense à retourner le constructeur (afin de pouvoir construire des
	// instances, sinon tout
	// le code de notre classe serait inutile car non visible depuis
	// l'extérieur)
	return Case;
}());

module.exports = Case;
