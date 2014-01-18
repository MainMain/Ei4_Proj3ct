// includes
var fs = require('fs');
var oItem = require('../model/object/Item');
var oDatabase = require('../model/database');
var mongoose = require('mongoose');

var async = require('async');


this.listeItems;


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

/**
 * CREE UNE LISTE D'ITEMS
 * 
 * @method GetListItem
 */
Item_BD.GetListItem = function()
{
	console.log("ITEM_BD : Initialisation liste item");
	
	var ItemModel = mongoose.model('Item');
	
	ItemModel.remove(true, function(err)
	{
		if (err)
		{
			throw err;
		}
		console.log('Items supprimés !');
	});
	
	this.listeItems = new Array();
	

	ItemBaseModel = mongoose.model('ItemBase');
	ItemModel = mongoose.model('Item');

	var file = fs.readFileSync('./persistance/itemListe.txt', "utf8");

	
	var lignes = file.split("\r\n");
	
	for(var i in lignes)
	{
		if(lignes != "")
		{
			var infos = lignes[i].split("-");
				
			var newItem = new ItemModel();
			

			});
		}
		
		
	});
	

},


//********************************* TO TRASH SOON ***********************
//--- ATTRIBUTS DE CLASSE ---
Item_BD.listeItems;

/**
 * CREE UNE LISTE D'ITEMS
 * 
 * @method Initialiser
 */
 /*
Item_BD.Initialiser = function() {
	console.log("ITEM_BD : initialisation liste item");
	// id, nom, description, poids, type, valeur, imageName
	var item1 = new oItem(0, 	"Item a",		"aaaaa", 	3, 	0, 0,	"public/spritesheets/armes/0.png");
	var item2 = new oItem(1, 	"Arme b",		"bbbbb", 	4, 	1, 2,	"public/spritesheets/armes/1.png");
	var item3 = new oItem(2, 	"Armure  c", 	"ccccc", 	2, 	2, 4,	"public/spritesheets/armes/2.png");
	var item4 = new oItem(3, 	"Arme d", 		"ddddd", 	1, 	1, 6,	"public/spritesheets/armes/3.png");
	var item5 = new oItem(4, 	"Item  e", 		"eeeeeee", 	30,	0, 1,	"public/spritesheets/armes/4.png");
	var item6 = new oItem(5, 	"ODD f", 		"fffff", 	4,	4, 2,	"public/spritesheets/armes/5.png");
	var item7 = new oItem(6, 	"Arme g", 		"ggggg", 	5, 	1, 7,	"public/spritesheets/armes/6.png");
	var item8 = new oItem(7, 	"Item h", 		"hhhhh", 	1, 	0, 2,	"public/spritesheets/armes/7.png");
	var item9 = new oItem(8, 	"Armure i", 	"iiiii", 	1, 	2, 6,	"public/spritesheets/armes/8.png");
	var item10 = new oItem(9, 	"Item j", 		"jjjjj", 	5, 	0, 4,	"public/spritesheets/armes/9.png");
	var item11 = new oItem(10, 	"Arme k", 		"kkkkk", 	7, 	1, 7,	"public/spritesheets/armes/10.png");
	var item12 = new oItem(11, 	"ODD l", 		"lllll", 	7, 	4, 2,	"public/spritesheets/armes/11.png");
	var item13 = new oItem(12, 	"Item m", 		"mmmmm", 	7, 	0, 41,	"public/spritesheets/armes/12.png");
	var item14 = new oItem(13, 	"Arme n", 		"nnnnn", 	5, 	1, 8,	"public/spritesheets/armes/13.png");
	var item15 = new oItem(14, 	"Armure o", 	"ooooo", 	7, 	2, 5,	"public/spritesheets/armes/14.png");
	var item16 = new oItem(15, 	"Item p", 		"ppppp", 	3, 	0, 54,	"public/spritesheets/armes/15.png");
	var item17 = new oItem(16, 	"Item q", 		"qqqqq", 	1, 	0, 21,	"public/spritesheets/armes/16.png");
	this.listeItems = new Array(item1, item2, item3, item4, item5, item6,
			item7, item8, item9, item10, item11, item12, item13, item14, item15, item16, item17);
	 
},

/*
 * RENVOI L'ITEM SUIVANT L'ID PASSE EN PARAMATRE
 * return : item
 * erreur : null
 */
Item_BD.GetItemById = function(id_item)
{
	if (id_item < 17)
		{
			console.log("ITEM_BD : Item trouvé dans la BD !");
			return this.listeItems[id_item];
		}
		
	else
		{
		console.log("ITEM_BD : WARNING -> return null");
		return null;

			newItem.idItem		= infos[0];
			newItem.nom			= infos[1];
			newItem.description	= infos[2];
			newItem.poids		= infos[3];
			newItem.type		= infos[4];
			newItem.valeur		= infos[5];
			newItem.imageName	= infos[6];
			
			this.listeItems[infos[0]] = new oItem(infos[0], infos[1], infos[2], infos[3], infos[4], infos[5], infos[6]);
			
			newItem.save();

		}

	}
	
	return this.listeItems;
}

module.exports = Item_BD;