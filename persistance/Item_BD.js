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
	var item1 = new oItem(0, "Epée a", "aaaaa", 3, null);
	var item2 = new oItem(1, "Epée b", "bbbbb", 4, null);
	var item3 = new oItem(2, "Epée c", "ccccc", 2, null);
	var item4 = new oItem(3, "Epée d", "ddddd", 3, null);
	var item5 = new oItem(4, "Epée e", "eeeeeee", 30, null);
	var item6 = new oItem(5, "Epée f", "fffff", 4, null);
	var item7 = new oItem(6, "Epée g", "ggggg", 5, null);
	var item8 = new oItem(7, "Epée h", "hhhhh", 1, null);
	var item9 = new oItem(8, "Epée i", "iiiii", 1, null);
	var item10 = new oItem(9, "Epée j", "jjjjj", 5, null);
	var item11 = new oItem(10, "Epée k", "kkkkk", 7, null);
	var item12 = new oItem(11, "Epée l", "lllll", 7, null);
	var item13 = new oItem(12, "Epée m", "mmmmm", 7, null);
	var item14 = new oItem(13, "Epée n", "nnnnn", 5, null);
	var item15 = new oItem(14, "Epée o", "ooooo", 7, null);
	var item16 = new oItem(15, "Epée p", "ppppp", 3, null);
	var item17 = new oItem(16, "Epée q", "qqqqq", 1, null);
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