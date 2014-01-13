// includes
var oItem = require('../model/object/Item');
var oItem_BD = require('./../persistance/Item_BD');

/**
 * PERSONNAGE MANAGER : RELIE LE SERVEUR AUX CASES ET GERE LES SAUVEGARDES
 *
 * @class Item_Manager
 */
var Item_Manager = (function() {
	'use strict';

	Item_Manager.listeItems;
    Item_Manager.listeItemsEnJeu;
    
	// --- METHODE DE CLASSE
	Item_Manager.build = function(idUser) {return new Item_Manager();};

	function Item_Manager() {
		// création de la BD "fictive"
		this.listeItems = oItem_BD.Initialiser();
		this.listeItemsEnJeu = oItem_BD.Initialiser();
		
		// chargement de tout les objets
		
		console.log("IMANAGER : Actif !");
	}
	// --- METHODES D'INSTANCE
	Item_Manager.prototype = {

		
		GetItem : function(idItem)
		{
			return this.listeItemsEnJeu[idItem];
		},
		
		GetItemAleatoire : function()
		{
			// tirer un id aléatoire
			var max = listeItems.count();
			var id = Math.floor(Math.random() * max);
			
			// récupère item
			/*var newItem;
			this.GetItem(id, function(item)
					{
						// l'ajouter à la BD
						this.AjouterItemAuJeu(newItem);
						
						newItem = item;
						// pour tests
						var newItem = new oItem(16, 	"Item q", 		"qqqqq", 	1, 	0, 21,	"public/spritesheets/armes/16.png");
					
					});
					*/

			// ajout de l'item au jeu
			AjouterItemAuJeu(item);
			// return l'item
			return newItem;
		},
		
		AjouterItemAuJeu : function(item)
		{
			listeItemsEnJeu[item.id] = item;
		},
		
		SupprimerItemDuJeu : function(item)
		{ 
			listeItems.splice(listeItemsEnJeu.indexOf(item.id), 1);
		},
		
		Load : function()
		{
			this.listeItemsEnJeu = oItem.Initialiser();
		},
		
		Save : function()
		{
			oItem_BD.SaveItems(this.listeItemsEnJeu);
		},
		
		callbackLoad : function(reponse)
		{
			if (reponse == -1)
				console.log("!!!!! WARNING : IMANAGER : erreur lecture ");
			else if (reponse == -2)
				console.log("!!!!! WARNING :IMANAGER : erreur lecture ");
			else
				console.log("IMANAGER : lecture ok");
		},

	};
	return Item_Manager;
}());

module.exports = Item_Manager;