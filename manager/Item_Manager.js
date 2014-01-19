// includes
var oItem = require('../model/object/Item');
var oItem_BD = require('./../persistance/Item_BD');

var oPersonnage_Manager  = require('./Personnage_Manager');
var oCase_Manager        = require('./Case_Manager');
var oUtilisateur_Manager = require('./Utilisateur_Manager');

this.listeItems;

function Item_Manager(){}

Item_Manager.Load = function()
{
	this.listeItems = new Array();
	this.listeItems = oItem_BD.GetListItem();
		
	// cast certaines propriétés en int
	for (var id in this.listeItems)
	{
		this.listeItems[id].poids = parseInt(this.listeItems[id].poids);
		this.listeItems[id].type = parseInt(this.listeItems[id].type);
		this.listeItems[id].valeur = parseInt(this.listeItems[id].valeur);
	}
	
	console.log("IMANAGER : Actif !");
},

Item_Manager.GetItem = function(idItem)
{
	return this.listeItems[idItem];
},

Item_Manager.GetItemAleatoire = function()
{
	// tirer un id aléatoire
	var max = listeItems.count();
	var id = Math.floor(Math.random() * max);
	
	// return l'item
	return this.GetItem(id);
}

module.exports = Item_Manager;