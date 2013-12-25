// includes
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
			
		},
		
		AjouterItemDuJeu : function(item)
		{
			
		},
		
		SupprimerItemDuJeu : function(item)
		{ 
			
		},

	};
	return Item_Manager;
}());

module.exports = Item_Manager;