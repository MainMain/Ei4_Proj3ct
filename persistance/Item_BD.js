// includes
var oItem = require('../model/object/Item');
/**
 * MODELISATION DE LA BD CONTENANT TOUS LES ITEMS
 * 
 * @class Item_BD
 */
function Item_BD() {
	if (false === (this instanceof Item_BD)) {
		return new Item_BD();
	}
};

//--- ATTRIBUTS DE CLASSE ---
Item_BD.listeItems;

/**
 * CREE UNE LISTE D'ITEMS
 * 
 * @method Initialiser
 */
Item_BD.Initialiser = function() {
	console.log("ITEM_BD : initialisation liste item");
	// id, nom, description, poids, type, imageName
	var item1 = new oItem(0, 	"Item a",		"aaaaa", 	3, 	0, null);
	var item2 = new oItem(1, 	"Arme b",		"bbbbb", 	4, 	1, null);
	var item3 = new oItem(2, 	"Armure  c", 	"ccccc", 	2, 	2, null);
	var item4 = new oItem(3, 	"Arme d", 		"ddddd", 	1, 	1, null);
	var item5 = new oItem(4, 	"Item  e", 		"eeeeeee", 	30,	0, null);
	var item6 = new oItem(5, 	"ODD f", 		"fffff", 	4,	4, null);
	var item7 = new oItem(6, 	"Arme g", 		"ggggg", 	5, 	1, null);
	var item8 = new oItem(7, 	"Item h", 		"hhhhh", 	1, 	0, null);
	var item9 = new oItem(8, 	"Armure i", 	"iiiii", 	1, 	2, null);
	var item10 = new oItem(9, 	"Item j", 		"jjjjj", 	5, 	0, null);
	var item11 = new oItem(10, 	"Arme k", 		"kkkkk", 	7, 	1, null);
	var item12 = new oItem(11, 	"ODD l", 		"lllll", 	7, 	4, null);
	var item13 = new oItem(12, 	"Item m", 		"mmmmm", 	7, 	0, null);
	var item14 = new oItem(13, 	"Arme n", 		"nnnnn", 	5, 	1, null);
	var item15 = new oItem(14, 	"Armure o", 	"ooooo", 	7, 	2, null);
	var item16 = new oItem(15, 	"Item p", 		"ppppp", 	3, 	0, null);
	var item17 = new oItem(16, 	"Item q", 		"qqqqq", 	1, 	0, null);
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
		return this.listeItems[id_item];
	else
		{
		console.log("ITEM_BD : WARNING -> return null");
		return null;
		}

},


module.exports = Item_BD;