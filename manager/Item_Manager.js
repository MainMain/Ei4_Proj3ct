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
    
	// --- METHODE DE CLASSE
	Item_Manager.build = function(idUser) {return new Item_Manager();};

	function Item_Manager() {
		// création de la BD "fictive"
		this.listeItems = oItem_BD.GetListItem();
		
		// cast certaines propriétés en int
		for (var id in this.listeItems)
		{
			this.listeItems[id].poids = parseInt(this.listeItems[id].poids);
			this.listeItems[id].type = parseInt(this.listeItems[id].type);
			this.listeItems[id].valeur = parseInt(this.listeItems[id].valeur);
		}
		console.log("IMANAGER : Actif !");
	}
	
	// --- METHODES D'INSTANCE
	Item_Manager.prototype = 
	{
		GetItem : function(idItem)
		{
			return this.listeItems[idItem];
		},
		
		GetItemAleatoire : function()
		{
			// tirer un id aléatoire
			var max = listeItems.count();
			var id = Math.floor(Math.random() * max);
			
			// return l'item
			return this.GetItem(id);
		}
	};
	return Item_Manager;
}());

module.exports = Item_Manager;