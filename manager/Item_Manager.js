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

    
	// --- METHODE DE CLASSE
	Item_Manager.build = function(idUser) {return new Item_Manager();};

	function Item_Manager() {
		oItem_BD.Initialiser();
		console.log("IMANAGER : Actif !");
	}
	// --- METHODES D'INSTANCE
	Item_Manager.prototype = {

		GetItem : function(idItem)
		{
			return oItem_BD.GetItemById(idItem);
		},
		
		GetItemAleatoire : function()
		{
			// tirer un id aléatoire
			var max = oItem_BD.NbrItemDifferents();
			var id = Math.floor(Math.random() * max);
			
			// récupère item
			var newItem;
			this.GetItem(id, function(item)
					{
						// l'ajouter à la BD
						this.AjouterItemAuJeu(newItem);
						
						newItem = item;
						// pour tests
						var newItem = new oItem(16, 	"Item q", 		"qqqqq", 	1, 	0, 21,	"public/spritesheets/armes/16.png");
					
					});
			
			
			
			// return l'item
			return newItem;
		},
		
		AjouterItemAuJeu : function(item)
		{
			//oItem_BD.NewItem(item, function(){});
		},
		
		SupprimerItemDuJeu : function(item)
		{ 
			oItem_BD.DestroyItem(item, function(){});
		},

	};
	return Item_Manager;
}());

module.exports = Item_Manager;