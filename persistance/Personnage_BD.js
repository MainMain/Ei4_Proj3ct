// includes
var oItem_BD = require('./Item_BD');
var oPersonnage = require('../model/Object/Personnage');
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
 * ENVOIE UN PERSONNAGE POUR METTRE A JOUR CES PROPRIETES
 * 
 * @method SetPersonnage
 */
Personnage_BD.SetPersonnage = function(personnageToSave) {
	// envoi un personnage à rajouter (ou modifier si son id existe déja)
},


/**
 * ENVOIE UN ID DE USER ET RETOURNE LE PERSO CORRESPONDANT
 * 
 * @method GetPersonnageByIdUser
 */
Personnage_BD.GetPersonnageByIdUser = function(idUtilisateur) {
	// renvoi un personnage selon l'id passé en paramètre
	
	
	/// *** POUR TESTER COTE SERVEUR ****
	var sacADos = [oItem_BD.GetItemById(9), oItem_BD.GetItemById(10), oItem_BD.GetItemById(11)];
	var myPerso = new oPersonnage(10, 100, 100, 20, 25, 10,
	    15, 100, 0, null, null, sacADos);
	console.log("PERSONNAGE_BD : Renvoi du personnage - Demande par id user");
	return myPerso;
	////////////////////////////////////
},

/**
 * ENVOIE UN ID DE PERSONNAGE ET RETOURNE LE PERSO
 * 
 * @method GetPersonnageByIdPerso
 */
Personnage_BD.GetPersonnageByIdPerso = function(idPersonnage) {
	// renvoi un personnage selon l'id passé en paramètre
},

module.exports = Personnage_BD;
