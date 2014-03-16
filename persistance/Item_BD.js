// includes
var fs = require('fs');
var oItem = require('../model/object/Item');
var oDatabase = require('../model/database');
var mongoose = require('mongoose');
var EventLog    = require('../model/EventLog');

var async = require('async');


this.listeItems;
this.nbrItem;


/**
 * ITEM : COMMUNICATION SERVEUR <-> BD
 * 
 * @class Item_BD
 */

function Item_BD() {
	if (false === (this instanceof Item_BD)) {
		return new Item_BD();
	}
};

// **** EXEMPLE CREATION ITEM ****

// var item1 = new oItem(0, "Item a", "aaaaa", 3, 0, 10, "epee.jpg");

/**
 *	RENVOIE UN ITEM PAR ID
 *
 * @method GetItemById
 */
Item_BD.GetItemById = function(idItem)
{
	return this.listeItems[idItem];
},


Item_BD.GetNbrItem = function()
{
	return this.nbrItem;
},

/**
 * CREE UNE LISTE D'ITEMS
 * 
 * @method GetListItem
 */
Item_BD.GetListItem = function()
{
	EventLog.log("ITEM_BD : Initialisation liste item");
	
	var ItemModel = mongoose.model('Item');
	
	ItemModel.remove(true, function(err)
	{
		if (err)
		{
			// enlève l'exception pour empecher que le serveur plante //throw err;
		}
		EventLog.log('ITEM_BD : Items supprimés !');
	});
	
	this.listeItems = new Array();
	this.nbrItem = 0;
	
	ItemModel = mongoose.model('Item');

	var itemFile = fs.readFileSync('./persistance/itemListe.txt', "utf8");
	
	var lignes = itemFile.split("\n");
	
	for(var i in lignes)
	{
		if(lignes[i] != "")
		{
			var infos = new Array();
			infos = lignes[i].split("-");
			
			if(infos[1])
			{
				var newItem = new ItemModel();
				
				newItem.idItem		= infos[0];
				newItem.nom			= infos[1];
				newItem.description	= infos[2];
				newItem.poids		= infos[3];
				newItem.type		= infos[4];
				newItem.valeur		= infos[5];
				newItem.imageName	= infos[6];
				
				this.listeItems[infos[0]] = new oItem(infos[0], infos[1], infos[2], infos[3], infos[4], infos[5], infos[6]);
				this.nbrItem += 1;
				
				newItem.save();
			}
		}

	}
	
	return this.listeItems;
},

module.exports = Item_BD;