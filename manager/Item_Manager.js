// includes
var oItem = require('../model/object/Item');
var oItem_BD = require('./../persistance/Item_BD');
var EventLog    = require('../model/EventLog');

// inclusion des règles
var GameRules	= require('../model/GameRules');

this.listeItems;
this.nbrItems;

function Item_Manager(){}

Item_Manager.Load = function()
{
	// création des listes
	this.listeItems = new Array();
	this.listeItems = oItem_BD.GetListItem();
	this.nbrItems	= oItem_BD.GetNbrItem();
		
	// cast certaines propriétés en int
	for (var id in this.listeItems)
	{
		this.listeItems[id].poids 	= parseInt(this.listeItems[id].poids);
		this.listeItems[id].type 	= parseInt(this.listeItems[id].type);
		this.listeItems[id].valeur 	= parseInt(this.listeItems[id].valeur);
	}
	
	EventLog.log("IMANAGER : Actif !");
},

Item_Manager.GetItem = function(idItem)
{
	return this.listeItems[idItem];
},

Item_Manager.GetItemAleatoire = function()
{
	// tirer un id aléatoire
	var nbAleatoire	= Math.floor(Math.random() * this.nbrItems);
	var c = 0;
	var id = 100;
	
	// pour chaque id
	for(var i in this.listeItems)
	{
		// si c'est un ODD
		if (i >= 300 && i < 400)
		{
			// on repousse la position recherchée
			nbAleatoire++;
		}
		// si c'est l'id de la position recherchée
		else if(c == nbAleatoire)
		{
			id = i;
			break;
		}
		c += 1;
	}
	
	EventLog.log(">>> ITEM_MANAER : GetItemAleatoire : id = " + id);
	// return l'item
	return this.listeItems[id];
},

module.exports = Item_Manager;