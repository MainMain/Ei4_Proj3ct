// includes
var oDatabase = require('../model/database');
var mongoose = require('mongoose');

/**
 * PERSONNAGES : COMMUNICATION SERVEUR <-> BD
 * 
 * @class Personnage_BD
 */
function Personnage_BD() {
	if (false === (this instanceof Personnage_BD)) {
		return new Personnage_BD();
	}
};

// **** EXEMPLE CREATION PERSONNGE ***

// var sacADos = [oItem_BD.GetItemById(9), oItem_BD.GetItemById(10), oItem_BD.GetItemById(11)];
//var myPerso = new oPersonnage(10, 100, 100, 20, 25, 10, 15, 100, 3, 0, "chasseur", null, null, sacADos);

// ***********************************


/**
 * ENVOIE UNE CASE POUR METTRE A JOUR CES PROPRIETES
 * 
 * @method SetPersonnage
 */
Personnage_BD.SetPersonnage = function(personnageToSave) {
	// envoi un personnage à rajouter (ou modifier si son id existe déja)
},


/**
 * ENVOIE UNE CASE POUR METTRE A JOUR CES PROPRIETES
 * 
 * @method GetPersonnage
 */
Personnage_BD.GetPersonnage = function(idPersonnage) {
	// renvoi un personnage selon l'id passé en paramètre
},

/**
 *CREER UN PERSONNAGE A LA CREATION DE L'UTILISATEUR
 *
 *@method Creation
 */
 
 Personnage_BD.Creation = function(){
	
 
 },
 
  module.exports = Personnage_BD;