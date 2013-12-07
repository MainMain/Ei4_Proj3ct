/**
 * Modélisation d'une case
 * 
 * @class item
 */
var Item = (function() {
	'use strict';

	// --- ATTRIBUTS DE CLASSE ---
	Item.id;
	Item.nom;
	Item.description;
	Item.poids;
	// type : 0 : objet, 1 : arme, 2 : armure, 3 : ODD
	Item.type;
	Item.imageName;


	// --- METHODES DE CLASSE ---
	
	Item.build = function(id, nom, description, poids, imageName) {
		return new Item(id, nom, description, poids, imageName);
	};

	// --- Constructeur + attributs d'instance (définis dans le constructeur)
	function Item(id, nom, description, poids, type, imageName) {
		this.id = id;
		this.nom = nom;
		this.description = description;
		this.poids = poids;
		this.type = type; 
		this.imageName = imageName;
	}

	// --- METHODES D'INSTANCE
	Item.prototype = {
		
	};

	return Item;
}());

module.exports = Item;